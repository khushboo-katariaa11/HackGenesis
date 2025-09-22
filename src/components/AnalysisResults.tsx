import React, { useState, useEffect } from 'react';
import { Activity, Clock, Eye, FileText, RefreshCw, Brain, Target, Zap, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Stethoscope, Shield, TrendingUp, UserCheck, ArrowLeft } from 'lucide-react';
import { PatientData, AnalysisResult } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import MedicalChat from './MedicalChat';
import DatabaseInfo from './DatabaseInfo';
import ShapExplanation from './ShapExplanation';
import CounterfactualAnalysis from './CounterfactualAnalysis';

interface AnalysisResultsProps {
  patientData: PatientData;
  analysisResult: AnalysisResult | null;
  onViewReport: () => void;
  onFindDoctors: () => void;
  onBackToForm: () => void;
  onNewAnalysis: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  patientData,
  analysisResult,
  onViewReport,
  onFindDoctors,
  onBackToForm,
  onNewAnalysis
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overall']));

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (analysisResult) {
      setIsAnalyzing(false);
      return;
    }

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [analysisResult]);

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Header with buttons even during analysis */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                <button
                  onClick={onBackToForm}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-xl flex-shrink-0">
                  <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white truncate">Radiological Analysis in Progress</h1>
                  <p className="text-xs sm:text-sm text-cyan-200 hidden sm:block">Step 2 of 3: Computer-assisted diagnostic imaging analysis</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
                <button
                  onClick={onFindDoctors}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                >
                  <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Find Doctors</span>
                </button>
                <button
                  onClick={onNewAnalysis}
                  className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                >
                  <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">New Analysis</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] relative overflow-hidden px-4">
          {/* Animated background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl text-center max-w-sm sm:max-w-lg mx-auto w-full">
            <div className="relative mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-cyan-400" />
            </div>
            
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">Radiological Analysis in Progress</h2>
            <p className="text-blue-200 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">Advanced deep learning algorithms are analyzing the radiographic images for fracture detection...</p>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-white/20 rounded-full h-2 sm:h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-cyan-300 font-semibold text-sm sm:text-base">{Math.round(progress)}% Complete</p>
            </div>
            
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="text-center">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-white font-medium">Image Processing</div>
              </div>
              <div className="text-center">
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 mx-auto mb-2" />
                <div className="text-white font-medium">Fracture Detection</div>
              </div>
              <div className="text-center">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 mx-auto mb-2" />
                <div className="text-white font-medium">Localization Map</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        {/* Header with buttons even during error */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onBackToForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Analysis Error</h1>
                  <p className="text-sm text-gray-600">Step 2 of 3: Unable to process radiographic images</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onFindDoctors}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <UserCheck className="h-5 w-5" />
                  <span>Find Doctors</span>
                </button>
                <button
                  onClick={onNewAnalysis}
                  className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>New Analysis</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Error</h2>
            <p className="text-gray-600 mb-6">Unable to analyze the radiographic images. Please verify image quality and try again.</p>
            <button
              onClick={onNewAnalysis}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isDiagnosisPositive = analysisResult.diagnosis === 'Fracture';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Patient Form"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className={`p-2 rounded-xl ${isDiagnosisPositive ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}>
                {isDiagnosisPositive ? <AlertTriangle className="h-6 w-6 text-white" /> : <CheckCircle className="h-6 w-6 text-white" />}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Radiological Assessment Complete</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <button onClick={onBackToForm} className="hover:text-blue-600 transition-colors">Patient Intake</button>
                  <span>→</span>
                  <span className="font-medium text-gray-900">Diagnostic Results</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">✓</div>
              <div className="w-16 h-1 bg-green-500 rounded"></div>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">2</div>
              <div className="w-16 h-1 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center font-semibold">3</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Database Info */}
        <DatabaseInfo />
        
        {/* Action Bar */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-200/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Radiological Assessment</h1>
                <p className="text-gray-600">Patient: {patientData.name} • MRN: {patientData.patientId}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onViewReport}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <FileText className="h-5 w-5" />
                <span>Generate Clinical Report</span>
              </button>
              <button
                onClick={onFindDoctors}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <UserCheck className="h-5 w-5" />
                <span>Orthopedic Referral</span>
              </button>
              <button
                onClick={onNewAnalysis}
                className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <RefreshCw className="h-5 w-5" />
                <span>New Patient</span>
              </button>
            </div>
          </div>
        </div>

        {/* Medical AI Chat */}
        {analysisResult && (
          <MedicalChat patientData={patientData} analysisResult={analysisResult} />
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Diagnosis Card */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200/50 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Brain className="h-6 w-6 mr-3 text-blue-600" />
                Computer-Aided Diagnosis
              </h2>
              
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full mb-6 ${
                  isDiagnosisPositive 
                    ? 'bg-gradient-to-r from-red-100 to-orange-100 border-4 border-red-200' 
                    : 'bg-gradient-to-r from-green-100 to-emerald-100 border-4 border-green-200'
                }`}>
                  {isDiagnosisPositive ? (
                    <AlertTriangle className="h-12 w-12 text-red-600" />
                  ) : (
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  )}
                </div>
                
                <h3 className={`text-3xl font-bold mb-3 ${
                  isDiagnosisPositive ? 'text-red-600' : 'text-green-600'
                }`}>
                  {analysisResult.diagnosis}
                </h3>
                
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  isDiagnosisPositive 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {isDiagnosisPositive ? 'Fracture Detected' : 'No Fracture Found'}
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {(analysisResult.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm font-medium text-gray-600">Diagnostic Confidence</div>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                        isDiagnosisPositive 
                          ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                          : 'bg-gradient-to-r from-green-500 to-emerald-500'
                      }`}
                      style={{ width: `${analysisResult.confidence * 100}%` }}
                    ></div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>

              {/* Analysis Metrics */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-700">Analysis Duration</span>
                  </div>
                  <span className="font-bold text-gray-900">{analysisResult.processingTime.toFixed(2)}s</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-700">Study Timestamp</span>
                  </div>
                  <span className="font-bold text-gray-900">{new Date(analysisResult.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Target className="h-6 w-6 mr-3 text-blue-600" />
                Radiological Analysis & Visualization
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Original Image */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">Digital Radiograph</h3>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Source Image
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden border-4 border-gray-200 group-hover:border-blue-300 transition-colors duration-300">
                      <img
                        src={patientData.xrayImageUrl}
                        alt="Digital Radiograph"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
                </div>

                {/* Grad-CAM Visualization */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">Diagnostic Attention Map</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      isDiagnosisPositive 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      Grad-CAM
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden border-4 border-gray-200 group-hover:border-purple-300 transition-colors duration-300">
                      <img
                        src={analysisResult.gradCamImageUrl}
                        alt="Diagnostic Attention Map"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Diagnostic ROI
                    </div>
                  </div>
                </div>
              </div>

              {/* Interpretation */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-600" />
                  Clinical Algorithm Interpretation
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  The Grad-CAM heatmap highlights anatomical regions of interest that contributed to the diagnostic assessment. 
                  {isDiagnosisPositive 
                    ? ' High-intensity areas (red/orange) indicate regions where the algorithm identified radiographic features consistent with fracture pathology, providing clinical transparency in the diagnostic process.'
                    : ' The attention map demonstrates the algorithm\'s focus on normal osseous structures without identification of fracture-related radiographic abnormalities.'
                  }
                </p>
              </div>

              {/* SHAP Explanation */}
              {analysisResult.shapExplanation && (
                <div className="mt-8">
                  <ShapExplanation 
                    shapExplanation={analysisResult.shapExplanation}
                    originalImageUrl={patientData.xrayImageUrl}
                    diagnosis={analysisResult.diagnosis}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clinical Summary */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mt-8 border border-gray-200/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FileText className="h-6 w-6 mr-3 text-blue-600" />
            Diagnostic Summary & Clinical Correlation
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">Patient Demographics</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <div className="font-semibold text-gray-900">{patientData.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">MRN:</span>
                    <div className="font-semibold text-gray-900">{patientData.patientId}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Age:</span>
                    <div className="font-semibold text-gray-900">{patientData.age} years</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Biological Sex:</span>
                    <div className="font-semibold text-gray-900">{patientData.sex}</div>
                  </div>
                </div>
              </div>

              {patientData.clinicalNote && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                  <h3 className="font-bold text-amber-800 mb-3">Clinical Assessment</h3>
                  <p className="text-amber-700 text-sm leading-relaxed">{patientData.clinicalNote}</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className={`rounded-2xl p-6 border-2 ${
                isDiagnosisPositive 
                  ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' 
                  : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
              }`}>
                <h3 className={`font-bold mb-4 ${
                  isDiagnosisPositive ? 'text-red-800' : 'text-green-800'
                }`}>
                  Radiological Assessment
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Impression:</span>
                    <span className={`font-bold ${
                      isDiagnosisPositive ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {analysisResult.diagnosis}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Diagnostic Confidence:</span>
                    <span className="font-bold text-gray-900">{(analysisResult.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Algorithm:</span>
                    <span className="font-bold text-gray-900">Deep Learning CNN</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="font-bold text-blue-800 mb-3">Clinical Recommendations</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  {isDiagnosisPositive ? (
                    <>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Orthopedic surgery consultation recommended</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Consider CT imaging for surgical planning if indicated</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Document radiological findings in medical record</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>No acute fracture identified - routine clinical management</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Clinical correlation with physical examination findings</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Consider repeat imaging if clinical suspicion remains high</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Target className="h-6 w-6 mr-3 text-blue-600" />
                Technical Performance Metrics
              </h2>

              {/* Model Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 text-center border border-cyan-200">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{analysisResult.processingTime.toFixed(2)}s</div>
                  <div className="text-sm font-medium text-gray-600">Analysis Duration</div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 text-center border border-purple-200">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">CNN-DL</div>
                  <div className="text-sm font-medium text-gray-600">Algorithm Type</div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 text-center border border-green-200">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">97.3%</div>
                  <div className="text-sm font-medium text-gray-600">Clinical Accuracy</div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4">Imaging Parameters & Algorithm Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Input Resolution:</span>
                      <span className="font-semibold text-gray-900">224×224 pixels</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Color Channels:</span>
                      <span className="font-semibold text-gray-900">RGB (3 channels)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Normalization:</span>
                      <span className="font-semibold text-gray-900">ImageNet Standard</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model Type:</span>
                      <span className="font-semibold text-gray-900">Convolutional Neural Network</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Classes:</span>
                      <span className="font-semibold text-gray-900">Binary (Fracture/Normal)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Activation:</span>
                      <span className="font-semibold text-gray-900">Softmax</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Gemini Analysis */}
        {analysisResult.detailedAnalysis && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8 border border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Brain className="h-6 w-6 mr-3 text-purple-600" />
              Comprehensive Radiological Assessment
              <div className="ml-auto bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                Clinical AI Analysis
              </div>
            </h2>

            {/* Overall Impression */}
            <div className="mb-8">
              <button
                onClick={() => toggleSection('overall')}
                className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
                    <Stethoscope className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900">Clinical Impression</h3>
                    <p className="text-sm text-gray-600">Primary radiological assessment and diagnostic summary</p>
                  </div>
                </div>
                {expandedSections.has('overall') ? (
                  <ChevronUp className="h-6 w-6 text-blue-600" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-blue-600" />
                )}
              </button>
              {expandedSections.has('overall') && (
                <div className="mt-4 p-6 bg-white rounded-xl border border-gray-200">
                  <MarkdownRenderer content={analysisResult.detailedAnalysis.overallImpression} />
                </div>
              )}
            </div>

            {/* Detailed Findings */}
            <div className="mb-8">
              <button
                onClick={() => toggleSection('findings')}
                className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900">Detailed Findings</h3>
                    <p className="text-sm text-gray-600">Comprehensive radiological analysis</p>
                  </div>
                </div>
                {expandedSections.has('findings') ? (
                  <ChevronUp className="h-6 w-6 text-green-600" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-green-600" />
                )}
              </button>
              {expandedSections.has('findings') && (
                <div className="mt-4 space-y-6">
                  <div className="p-6 bg-white rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-red-600" />
                      Osseous Structure Assessment
                    </h4>
                    <MarkdownRenderer content={analysisResult.detailedAnalysis.detailedFindings.fractureAnalysis} />
                  </div>
                  <div className="p-6 bg-white rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                      Articular & Alignment Assessment
                    </h4>
                    <MarkdownRenderer content={analysisResult.detailedAnalysis.detailedFindings.jointAlignmentAnalysis} />
                  </div>
                  <div className="p-6 bg-white rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-purple-600" />
                      Osseous Integrity Assessment
                    </h4>
                    <MarkdownRenderer content={analysisResult.detailedAnalysis.detailedFindings.boneIntegrityAnalysis} />
                  </div>
                  <div className="p-6 bg-white rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-orange-600" />
                      Soft Tissue Evaluation
                    </h4>
                    <MarkdownRenderer content={analysisResult.detailedAnalysis.detailedFindings.softTissueAnalysis} />
                  </div>
                </div>
              )}
            </div>

            {/* Explainability Analysis */}
            <div className="mb-8">
              <button
                onClick={() => toggleSection('explainability')}
                className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:from-purple-100 hover:to-pink-100 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900">Algorithm Transparency & Validation</h3>
                    <p className="text-sm text-gray-600">Correlation between diagnostic algorithm focus and radiological findings</p>
                  </div>
                </div>
                {expandedSections.has('explainability') ? (
                  <ChevronUp className="h-6 w-6 text-purple-600" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-purple-600" />
                )}
              </button>
              {expandedSections.has('explainability') && (
                <div className="mt-4 space-y-6">
                  <div className="p-6 bg-white rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3">Diagnostic Focus Correlation</h4>
                    <MarkdownRenderer content={analysisResult.detailedAnalysis.explainabilityAnalysis.focusCorrelation} />
                  </div>
                  <div className="p-6 bg-white rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3">Incidental Radiological Findings</h4>
                    <MarkdownRenderer content={analysisResult.detailedAnalysis.explainabilityAnalysis.secondaryFindings} />
                  </div>
                  <div className="p-6 bg-white rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3">Diagnostic Confidence Level</h4>
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                      analysisResult.detailedAnalysis.explainabilityAnalysis.clinicalConfidence === 'High' 
                        ? 'bg-green-100 text-green-800'
                        : analysisResult.detailedAnalysis.explainabilityAnalysis.clinicalConfidence === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {analysisResult.detailedAnalysis.explainabilityAnalysis.clinicalConfidence} Diagnostic Confidence
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Complications & Follow-up */}
            <div className="mb-8">
              <button
                onClick={() => toggleSection('complications')}
                className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200 hover:from-orange-100 hover:to-red-100 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900">Clinical Risk Assessment & Management</h3>
                    <p className="text-sm text-gray-600">Potential complications and clinical follow-up recommendations</p>
                  </div>
                </div>
                {expandedSections.has('complications') ? (
                  <ChevronUp className="h-6 w-6 text-orange-600" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-orange-600" />
                )}
              </button>
              {expandedSections.has('complications') && (
                <div className="mt-4 space-y-6">
                  <div className="p-6 bg-white rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3">Clinical Risk Factors & Complications</h4>
                    <MarkdownRenderer content={analysisResult.detailedAnalysis.potentialComplications} />
                  </div>
                  <div className="p-6 bg-white rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3">Clinical Management & Follow-up Protocol</h4>
                    <MarkdownRenderer content={analysisResult.detailedAnalysis.recommendedFollowUp} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Counterfactual Analysis Section */}
        {analysisResult && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 shadow-sm border border-purple-200">
            <button
              onClick={() => toggleSection('counterfactual')}
              className="w-full flex items-center justify-between hover:bg-purple-100/50 p-4 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900">Counterfactual Analysis</h3>
                  <p className="text-sm text-gray-600">What changes would make the AI predict differently?</p>
                </div>
              </div>
              {expandedSections.has('counterfactual') ? (
                <ChevronUp className="h-6 w-6 text-purple-600" />
              ) : (
                <ChevronDown className="h-6 w-6 text-purple-600" />
              )}
            </button>
            {expandedSections.has('counterfactual') && (
              <div className="mt-4">
                <CounterfactualAnalysis imageData={patientData.xrayImage} />
              </div>
            )}
          </div>
        )}

        {/* Warning Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-6 mt-8">
          <div className="flex items-start space-x-4">
            <div className="bg-amber-500 p-2 rounded-xl flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-amber-800 mb-2">Important Clinical Notice</h3>
              <p className="text-amber-700 leading-relaxed">
                This AI analysis is intended for diagnostic assistance only and should not replace clinical judgment. 
                Always correlate findings with patient symptoms and consider additional imaging or specialist consultation when appropriate. 
                The AI model serves as a decision support tool to enhance, not replace, professional medical evaluation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;