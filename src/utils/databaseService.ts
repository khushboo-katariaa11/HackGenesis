import { PatientData, AnalysisResult, StoredAnalysis, AnalysisHistory, DatabaseStats } from '../types';

// IndexedDB database name and version
const DB_NAME = 'RadiologyAI_Database';
const DB_VERSION = 1;
const STORE_NAME = 'analyses';

class DatabaseService {
  private db: IDBDatabase | null = null;

  // Initialize the database
  async initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Database failed to open');
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('Database opened successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store for analyses
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          
          // Create indexes for efficient querying
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('patientId', 'patientData.patientId', { unique: false });
          store.createIndex('diagnosis', 'analysisResult.diagnosis', { unique: false });
          store.createIndex('status', 'status', { unique: false });
          
          console.log('Database setup complete');
        }
      };
    });
  }

  // Ensure database is initialized
  private async ensureDatabase(): Promise<void> {
    if (!this.db) {
      await this.initDatabase();
    }
  }

  // Convert File to base64 string for storage
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Convert base64 string back to File
  private base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  // Store a new analysis
  async storeAnalysis(patientData: PatientData, analysisResult: AnalysisResult): Promise<string> {
    await this.ensureDatabase();
    
    return new Promise(async (resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        // Convert image file to base64 for storage
        const xrayImageData = await this.fileToBase64(patientData.xrayImage);
        
        const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const storedAnalysis: StoredAnalysis = {
          id: analysisId,
          patientData: {
            ...patientData,
            xrayImageData
          },
          analysisResult,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'completed'
        };

        // Remove the File object as it can't be stored in IndexedDB
        delete (storedAnalysis.patientData as any).xrayImage;

        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = store.add(storedAnalysis);
        
        request.onsuccess = () => {
          console.log('Analysis stored successfully:', analysisId);
          resolve(analysisId);
        };
        
        request.onerror = () => {
          console.error('Failed to store analysis');
          reject(new Error('Failed to store analysis'));
        };
      } catch (error) {
        console.error('Error preparing analysis for storage:', error);
        reject(error);
      }
    });
  }

  // Retrieve a specific analysis by ID
  async getAnalysis(id: string): Promise<StoredAnalysis | null> {
    await this.ensureDatabase();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      
      request.onsuccess = () => {
        const result = request.result;
        if (result && result.patientData.xrayImageData) {
          // Convert base64 back to File object
          const filename = `xray_${result.patientData.patientId}.jpg`;
          (result.patientData as any).xrayImage = this.base64ToFile(result.patientData.xrayImageData, filename);
        }
        resolve(result || null);
      };
      
      request.onerror = () => {
        reject(new Error('Failed to retrieve analysis'));
      };
    });
  }

  // Get all analyses with pagination and filtering
  async getAnalysisHistory(
    limit: number = 50, 
    offset: number = 0,
    filters?: {
      patientId?: string;
      diagnosis?: 'Fracture' | 'Normal';
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<AnalysisHistory> {
    await this.ensureDatabase();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('createdAt');
      
      // Get all records in reverse chronological order
      const request = index.openCursor(null, 'prev');
      const analyses: StoredAnalysis[] = [];
      let count = 0;
      let skipped = 0;
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        
        if (cursor && analyses.length < limit) {
          const analysis = cursor.value as StoredAnalysis;
          
          // Apply filters
          let includeAnalysis = true;
          
          if (filters?.patientId && analysis.patientData.patientId !== filters.patientId) {
            includeAnalysis = false;
          }
          
          if (filters?.diagnosis && analysis.analysisResult.diagnosis !== filters.diagnosis) {
            includeAnalysis = false;
          }
          
          if (filters?.dateFrom && analysis.createdAt < filters.dateFrom) {
            includeAnalysis = false;
          }
          
          if (filters?.dateTo && analysis.createdAt > filters.dateTo) {
            includeAnalysis = false;
          }
          
          if (includeAnalysis) {
            if (skipped >= offset) {
              // Convert base64 back to File object for display
              if (analysis.patientData.xrayImageData) {
                const filename = `xray_${analysis.patientData.patientId}.jpg`;
                (analysis.patientData as any).xrayImage = this.base64ToFile(analysis.patientData.xrayImageData, filename);
              }
              analyses.push(analysis);
            } else {
              skipped++;
            }
          }
          
          count++;
          cursor.continue();
        } else {
          resolve({
            analyses,
            totalCount: count,
            lastUpdated: new Date().toISOString()
          });
        }
      };
      
      request.onerror = () => {
        reject(new Error('Failed to retrieve analysis history'));
      };
    });
  }

  // Delete an analysis
  async deleteAnalysis(id: string): Promise<void> {
    await this.ensureDatabase();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      
      request.onsuccess = () => {
        console.log('Analysis deleted successfully:', id);
        resolve();
      };
      
      request.onerror = () => {
        reject(new Error('Failed to delete analysis'));
      };
    });
  }

  // Update analysis notes or tags
  async updateAnalysis(id: string, updates: Partial<Pick<StoredAnalysis, 'notes' | 'tags'>>): Promise<void> {
    await this.ensureDatabase();
    
    return new Promise(async (resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        // First get the existing analysis
        const existing = await this.getAnalysis(id);
        if (!existing) {
          reject(new Error('Analysis not found'));
          return;
        }

        // Update the analysis
        const updatedAnalysis = {
          ...existing,
          ...updates,
          updatedAt: new Date().toISOString()
        };

        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(updatedAnalysis);
        
        request.onsuccess = () => {
          console.log('Analysis updated successfully:', id);
          resolve();
        };
        
        request.onerror = () => {
          reject(new Error('Failed to update analysis'));
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  // Get database statistics
  async getDatabaseStats(): Promise<DatabaseStats> {
    await this.ensureDatabase();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const analyses = request.result as StoredAnalysis[];
        
        const stats: DatabaseStats = {
          totalAnalyses: analyses.length,
          fractureDetected: analyses.filter(a => a.analysisResult.diagnosis === 'Fracture').length,
          normalResults: analyses.filter(a => a.analysisResult.diagnosis === 'Normal').length,
          averageConfidence: analyses.length > 0 
            ? analyses.reduce((sum, a) => sum + a.analysisResult.confidence, 0) / analyses.length 
            : 0,
          recentAnalyses: analyses.filter(a => {
            const analysisDate = new Date(a.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return analysisDate > weekAgo;
          }).length
        };
        
        resolve(stats);
      };
      
      request.onerror = () => {
        reject(new Error('Failed to get database statistics'));
      };
    });
  }

  // Clear all data (for testing or reset purposes)
  async clearAllData(): Promise<void> {
    await this.ensureDatabase();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      
      request.onsuccess = () => {
        console.log('All data cleared successfully');
        resolve();
      };
      
      request.onerror = () => {
        reject(new Error('Failed to clear data'));
      };
    });
  }

  // Export data as JSON
  async exportData(): Promise<string> {
    const history = await this.getAnalysisHistory(1000); // Get all data
    return JSON.stringify(history, null, 2);
  }

  // Search analyses by patient name or ID
  async searchAnalyses(query: string): Promise<StoredAnalysis[]> {
    const history = await this.getAnalysisHistory(1000);
    const lowerQuery = query.toLowerCase();
    
    return history.analyses.filter(analysis => 
      analysis.patientData.name.toLowerCase().includes(lowerQuery) ||
      analysis.patientData.patientId.toLowerCase().includes(lowerQuery)
    );
  }
}

// Create and export a singleton instance
export const databaseService = new DatabaseService();

// Initialize database on module load
databaseService.initDatabase().catch(console.error);

export default databaseService;