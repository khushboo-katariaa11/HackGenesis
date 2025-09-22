// API-based AI Model Integration for PyTorch DenseNet121
import { performDetailedAnalysis, checkGeminiAvailability } from './geminiService';
import { DetailedAnalysisResult } from '../types';

const API_CONFIG = {
  // Change this to your actual API endpoint
  baseUrl: 'http://localhost:8000', // Your Flask/FastAPI server
  endpoints: {
    analyze: '/analyze',
    health: '/health'
  },
  timeout: 30000 // 30 seconds timeout for analysis
};

// Check if API server is available
export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.health}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

// Convert image file to base64 for API transmission
const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove data:image/jpeg;base64, prefix
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Main analysis function using API
export const analyzeXray = async (patientData: import('../types').PatientData): Promise<import('../types').AnalysisResult & {
  groundTruth?: string;
  correct?: boolean;
  patientMeta?: any;
}> => {
  const startTime = performance.now();

  // Check if API is available
  const isAPIHealthy = await checkAPIHealth();
  if (!isAPIHealthy) {
    throw new Error('API server is not available. Please ensure your model server is running.');
  }

  // Convert image to base64
  const base64Image = await imageToBase64(patientData.xrayImage);

  // Prepare API request with complete patient data
  const requestBody = {
    image: base64Image,
    filename: patientData.xrayImage.name,
    patient_data: {
      name: patientData.name,
      patientId: patientData.patientId,
      age: patientData.age,
      sex: patientData.sex,
      symptoms: patientData.symptoms,
      medicalHistory: patientData.medicalHistory,
      allergies: patientData.allergies,
      currentMedications: patientData.currentMedications,
      clinicalNote: patientData.clinicalNote
    }
  };

  // Call your API
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.analyze}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API request failed: ${response.status} - ${errorData.message || response.statusText}`);
  }

  const result = await response.json();

  // Use actual Grad-CAM image from API
  const gradCamUrl = result.gradcam_image
    ? `data:image/png;base64,${result.gradcam_image}`
    : '';

  // Process SHAP explanation if available
  const shapExplanation = result.shap_explanation ? {
    available: result.shap_explanation.available,
    image: result.shap_explanation.image 
      ? `data:image/png;base64,${result.shap_explanation.image}`
      : undefined,
    topFeatures: result.shap_explanation.top_features || [],
    description: result.shap_explanation.description || 'SHAP explanations not available'
  } : undefined;

  const processingTime = result.processing_time || ((performance.now() - startTime) / 1000);

  // Perform detailed analysis with Gemini if available
  let detailedAnalysis: DetailedAnalysisResult | undefined;
  try {
    const isGeminiAvailable = await checkGeminiAvailability();
    if (isGeminiAvailable && gradCamUrl) {
      console.log('Performing detailed analysis with Google Gemini...');
      detailedAnalysis = await performDetailedAnalysis(patientData, gradCamUrl);
      console.log('Detailed analysis completed successfully');
    } else {
      console.log('Gemini service not available or Grad-CAM image missing, skipping detailed analysis');
    }
  } catch (error) {
    console.error('Failed to perform detailed analysis:', error);
    // Continue without detailed analysis rather than failing the entire process
  }

  // Map API prediction to expected diagnosis type
  const mapDiagnosis = (prediction: string): 'Fracture' | 'Normal' => {
    const normalizedPrediction = prediction.toLowerCase().trim();
    if (normalizedPrediction.includes('fracture') || normalizedPrediction === 'positive' || normalizedPrediction === '1') {
      return 'Fracture';
    }
    return 'Normal';
  };

  const baseResult = {
    diagnosis: mapDiagnosis(result.prediction), // Map to expected union type
    confidence: result.confidence,
    gradCamImageUrl: gradCamUrl,
    processingTime,
    timestamp: new Date().toISOString(),
    detailedAnalysis,
    shapExplanation,
    groundTruth: result.ground_truth, // if provided by API
    correct: result.correct, // if provided by API
    patientMeta: result.patient_meta // if provided by API
  };

  return baseResult;
};