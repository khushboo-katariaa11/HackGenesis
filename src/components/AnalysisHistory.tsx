import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  FileText, 
  Trash2, 
  Eye, 
  Download, 
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Clock,
  Tag,
  StickyNote
} from 'lucide-react';
import { StoredAnalysis, AnalysisHistory, DatabaseStats, PatientData, AnalysisResult } from '../types';
import { databaseService } from '../utils/databaseService';

interface AnalysisHistoryProps {
  onBackToHome: () => void;
  onViewAnalysis: (patientData: PatientData, analysisResult: AnalysisResult) => void;
}

const AnalysisHistoryComponent: React.FC<AnalysisHistoryProps> = ({ onBackToHome, onViewAnalysis }) => {
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDiagnosis, setFilterDiagnosis] = useState<'all' | 'Fracture' | 'Normal'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<StoredAnalysis | null>(null);
  const [showNotes, setShowNotes] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');

  useEffect(() => {
    loadAnalyses();
    loadStats();
  }, []);

  const loadAnalyses = async () => {
    try {
      setLoading(true);
      
      // Apply date filter
      let dateFrom: string | undefined;
      const now = new Date();
      
      if (dateFilter === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        dateFrom = weekAgo.toISOString();
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        dateFrom = monthAgo.toISOString();
      } else if (dateFilter === 'year') {
        const yearAgo = new Date(now);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        dateFrom = yearAgo.toISOString();
      }

      const filters = {
        diagnosis: filterDiagnosis !== 'all' ? filterDiagnosis : undefined,
        dateFrom
      };

      const history = await databaseService.getAnalysisHistory(100, 0, filters);
      
      // Apply search filter
      let filteredAnalyses = history.analyses;
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filteredAnalyses = history.analyses.filter(analysis =>
          analysis.patientData.name.toLowerCase().includes(lowerQuery) ||
          analysis.patientData.patientId.toLowerCase().includes(lowerQuery)
        );
      }
      
      setAnalyses(filteredAnalyses);
    } catch (error) {
      console.error('Failed to load analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const dbStats = await databaseService.getDatabaseStats();
      setStats(dbStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    loadAnalyses();
  }, [searchQuery, filterDiagnosis, dateFilter]);

  const handleDeleteAnalysis = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this analysis? This action cannot be undone.')) {
      try {
        await databaseService.deleteAnalysis(id);
        loadAnalyses();
        loadStats();
      } catch (error) {
        console.error('Failed to delete analysis:', error);
        alert('Failed to delete analysis. Please try again.');
      }
    }
  };

  const handleViewAnalysis = (analysis: StoredAnalysis) => {
    // Convert stored analysis back to the format expected by the view
    const patientData: PatientData = {
      ...analysis.patientData,
      xrayImage: (analysis.patientData as any).xrayImage
    };
    
    onViewAnalysis(patientData, analysis.analysisResult);
  };

  const handleExportData = async () => {
    try {
      const data = await databaseService.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `radiology_analyses_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleUpdateNotes = async (id: string, notes: string) => {
    try {
      await databaseService.updateAnalysis(id, { notes });
      loadAnalyses();
      setShowNotes(null);
      setEditingNotes('');
    } catch (error) {
      console.error('Failed to update notes:', error);
      alert('Failed to update notes. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <button
                onClick={onBackToHome}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                title="Back to Home"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl flex-shrink-0">
                <History className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Analysis History</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">View and manage your radiological analysis records</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <button
                onClick={handleExportData}
                className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center space-x-1 sm:space-x-2 transition-colors text-xs sm:text-sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={() => { loadAnalyses(); loadStats(); }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center space-x-1 sm:space-x-2 transition-colors text-xs sm:text-sm"
              >
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                  <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Analyses</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalAnalyses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-red-100 p-2 sm:p-3 rounded-lg">
                  <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Fractures</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.fractureDetected}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                  <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Normal</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.normalResults}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
                  <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Confidence</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{(stats.averageConfidence * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 sm:p-3 rounded-lg">
                  <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.recentAnalyses}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search by patient name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Diagnosis Filter */}
            <select
              value={filterDiagnosis}
              onChange={(e) => setFilterDiagnosis(e.target.value as any)}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Diagnoses</option>
              <option value="Fracture">Fracture Detected</option>
              <option value="Normal">Normal Results</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center sm:justify-start text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <Filter className="w-4 h-4 mr-2" />
              {analyses.length} result{analyses.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Analysis List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 text-sm sm:text-base">Loading analyses...</span>
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No analyses found</h3>
            <p className="text-sm sm:text-base text-gray-600">
              {searchQuery || filterDiagnosis !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your search criteria or filters'
                : 'Start by performing your first radiological analysis'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <img
                        src={analysis.patientData.xrayImageUrl}
                        alt="X-ray"
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-gray-200"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                          {analysis.patientData.name}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          analysis.analysisResult.diagnosis === 'Fracture'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {analysis.analysisResult.diagnosis}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          ID: {analysis.patientData.patientId}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {formatDate(analysis.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Confidence: {(analysis.analysisResult.confidence * 100).toFixed(1)}%
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {analysis.analysisResult.processingTime.toFixed(2)}s
                        </div>
                      </div>

                      {analysis.notes && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs sm:text-sm text-yellow-800">
                          <StickyNote className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                          {analysis.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 lg:ml-6 flex-shrink-0">
                    <button
                      onClick={() => handleViewAnalysis(analysis)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-1 sm:space-x-2 transition-colors text-xs sm:text-sm"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>View</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowNotes(analysis.id);
                        setEditingNotes(analysis.notes || '');
                      }}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-1 sm:space-x-2 transition-colors text-xs sm:text-sm"
                    >
                      <StickyNote className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Notes</span>
                    </button>
                    
                    <button
                      onClick={() => handleDeleteAnalysis(analysis.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-1 sm:space-x-2 transition-colors text-xs sm:text-sm"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes Modal */}
      {showNotes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Notes</h3>
              <textarea
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                placeholder="Add notes about this analysis..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                rows={4}
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => handleUpdateNotes(showNotes, editingNotes)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Save Notes
                </button>
                <button
                  onClick={() => {
                    setShowNotes(null);
                    setEditingNotes('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisHistoryComponent;