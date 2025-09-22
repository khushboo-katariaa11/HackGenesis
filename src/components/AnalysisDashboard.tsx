import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Grid3X3, 
  List, 
  TrendingUp, 
  Users, 
  Search, 
  Filter,
  ArrowLeft,
  Download,
  RefreshCw,
  Eye,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';
import { StoredAnalysis, DatabaseStats, PatientData, AnalysisResult } from '../types';
import { databaseService } from '../utils/databaseService';

interface AnalysisDashboardProps {
  onBackToHome: () => void;
  onViewAnalysis: (patientData: PatientData, analysisResult: AnalysisResult) => void;
}

type TabType = 'overview' | 'grid' | 'list' | 'timeline' | 'statistics' | 'patients';

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ onBackToHome, onViewAnalysis }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDiagnosis, setFilterDiagnosis] = useState<'all' | 'Fracture' | 'Normal'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month' | 'year'>('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadAnalyses();
  }, [searchQuery, filterDiagnosis, dateFilter]);

  const loadData = async () => {
    await Promise.all([loadAnalyses(), loadStats()]);
  };

  const loadAnalyses = async () => {
    try {
      setLoading(true);
      
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

      const history = await databaseService.getAnalysisHistory(200, 0, filters);
      
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

  const handleViewAnalysis = (analysis: StoredAnalysis) => {
    const patientData: PatientData = {
      ...analysis.patientData,
      xrayImage: (analysis.patientData as any).xrayImage
    };
    onViewAnalysis(patientData, analysis.analysisResult);
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

  const getUniquePatients = () => {
    const patientMap = new Map();
    analyses.forEach(analysis => {
      const key = analysis.patientData.patientId;
      if (!patientMap.has(key)) {
        patientMap.set(key, {
          ...analysis.patientData,
          analysisCount: 1,
          lastAnalysis: analysis.createdAt,
          diagnoses: [analysis.analysisResult.diagnosis]
        });
      } else {
        const patient = patientMap.get(key);
        patient.analysisCount++;
        patient.diagnoses.push(analysis.analysisResult.diagnosis);
        if (new Date(analysis.createdAt) > new Date(patient.lastAnalysis)) {
          patient.lastAnalysis = analysis.createdAt;
        }
      }
    });
    return Array.from(patientMap.values());
  };

  const getTimelineData = () => {
    const timeline = analyses.reduce((acc, analysis) => {
      const date = new Date(analysis.createdAt).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(analysis);
      return acc;
    }, {} as Record<string, StoredAnalysis[]>);

    return Object.entries(timeline)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, 30); // Last 30 days
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'grid', label: 'Grid View', icon: Grid3X3 },
    { id: 'list', label: 'List View', icon: List },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'statistics', label: 'Statistics', icon: TrendingUp },
    { id: 'patients', label: 'Patients', icon: Users }
  ];

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
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Analysis Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Comprehensive view of your radiological analysis history</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <button
                onClick={loadData}
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
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-4 sm:px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Filters */}
          <div className="p-4 sm:p-6 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <select
                value={filterDiagnosis}
                onChange={(e) => setFilterDiagnosis(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Diagnoses</option>
                <option value="Fracture">Fracture Detected</option>
                <option value="Normal">Normal Results</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Time</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="year">Past Year</option>
              </select>

              <div className="flex items-center justify-center text-sm text-gray-600 bg-white rounded-lg px-3 py-2 border border-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                {analyses.length} results
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 text-sm sm:text-base">Loading dashboard...</span>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6 sm:space-y-8">
                {/* Statistics Cards */}
                {stats && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                          <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
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
                          <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Confidence</p>
                          <p className="text-lg sm:text-2xl font-bold text-gray-900">{(stats.averageConfidence * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Analyses */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analyses</h3>
                  <div className="space-y-4">
                    {analyses.slice(0, 5).map((analysis) => (
                      <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img
                            src={analysis.patientData.xrayImageUrl}
                            alt="X-ray"
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{analysis.patientData.name}</h4>
                            <p className="text-sm text-gray-600">
                              {analysis.analysisResult.diagnosis} • {formatDate(analysis.createdAt)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleViewAnalysis(analysis)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Grid View Tab */}
            {activeTab === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {analyses.map((analysis) => (
                  <div key={analysis.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={analysis.patientData.xrayImageUrl}
                        alt="X-ray"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">{analysis.patientData.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          analysis.analysisResult.diagnosis === 'Fracture'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {analysis.analysisResult.diagnosis}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        ID: {analysis.patientData.patientId}
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        {formatDate(analysis.createdAt)}
                      </p>
                      <button
                        onClick={() => handleViewAnalysis(analysis)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        View Analysis
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View Tab */}
            {activeTab === 'list' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Diagnosis
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Confidence
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analyses.map((analysis) => (
                        <tr key={analysis.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={analysis.patientData.xrayImageUrl}
                                alt="X-ray"
                                className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {analysis.patientData.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {analysis.patientData.patientId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              analysis.analysisResult.diagnosis === 'Fracture'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {analysis.analysisResult.diagnosis}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(analysis.analysisResult.confidence * 100).toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(analysis.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewAnalysis(analysis)}
                              className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-6">
                {getTimelineData().map(([date, dayAnalyses]) => (
                  <div key={date} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                      <span className="ml-2 text-sm text-gray-500">({dayAnalyses.length} analyses)</span>
                    </h3>
                    <div className="space-y-4">
                      {dayAnalyses.map((analysis) => (
                        <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <img
                              src={analysis.patientData.xrayImageUrl}
                              alt="X-ray"
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">{analysis.patientData.name}</h4>
                              <p className="text-sm text-gray-600">
                                {analysis.analysisResult.diagnosis} • 
                                Confidence: {(analysis.analysisResult.confidence * 100).toFixed(1)}% • 
                                {new Date(analysis.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewAnalysis(analysis)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === 'statistics' && stats && (
              <div className="space-y-6 sm:space-y-8">
                {/* Diagnosis Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                    Diagnosis Distribution
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">Fracture Detected</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{stats.fractureDetected}</div>
                          <div className="text-sm text-gray-600">
                            {stats.totalAnalyses > 0 ? ((stats.fractureDetected / stats.totalAnalyses) * 100).toFixed(1) : 0}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">Normal Results</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{stats.normalResults}</div>
                          <div className="text-sm text-gray-600">
                            {stats.totalAnalyses > 0 ? ((stats.normalResults / stats.totalAnalyses) * 100).toFixed(1) : 0}%
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="relative w-32 h-32">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="3"
                            strokeDasharray={`${stats.totalAnalyses > 0 ? (stats.fractureDetected / stats.totalAnalyses) * 100 : 0}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{stats.totalAnalyses}</div>
                            <div className="text-xs text-gray-600">Total</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Average Confidence</h4>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {(stats.averageConfidence * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-600">Across all analyses</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Recent Activity</h4>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {stats.recentAnalyses}
                    </div>
                    <p className="text-sm text-gray-600">Analyses this week</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Detection Rate</h4>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {stats.totalAnalyses > 0 ? ((stats.fractureDetected / stats.totalAnalyses) * 100).toFixed(1) : 0}%
                    </div>
                    <p className="text-sm text-gray-600">Fracture detection rate</p>
                  </div>
                </div>
              </div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Patient Overview
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {getUniquePatients().map((patient, index) => (
                    <div key={patient.patientId} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 p-3 rounded-full">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                            <p className="text-sm text-gray-600">
                              ID: {patient.patientId} • Age: {patient.age} • {patient.sex}
                            </p>
                            <p className="text-xs text-gray-500">
                              Last analysis: {formatDate(patient.lastAnalysis)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{patient.analysisCount}</div>
                          <div className="text-sm text-gray-600">
                            {patient.analysisCount === 1 ? 'Analysis' : 'Analyses'}
                          </div>
                          <div className="flex space-x-1 mt-1">
                            {patient.diagnoses.map((diagnosis, i) => (
                              <span
                                key={i}
                                className={`inline-block w-2 h-2 rounded-full ${
                                  diagnosis === 'Fracture' ? 'bg-red-500' : 'bg-green-500'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && analyses.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No analyses found</h3>
            <p className="text-sm sm:text-base text-gray-600">
              {searchQuery || filterDiagnosis !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your search criteria or filters'
                : 'Start by performing your first radiological analysis'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisDashboard;