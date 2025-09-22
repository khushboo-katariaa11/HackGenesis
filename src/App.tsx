import React, { useState, useEffect } from 'react';
import Homepage from './components/Homepage';
import PatientForm from './components/PatientForm';
import AnalysisResults from './components/AnalysisResults';
import ClinicalReport from './components/ClinicalReport';
import OrthopedicFinder from './components/OrthopedicFinder';
import AnalysisHistoryComponent from './components/AnalysisHistory';
import AnalysisDashboard from './components/AnalysisDashboard';
import { NotificationProvider, useNotification } from './contexts/NotificationContext';
import { PatientData, AnalysisResult } from './types';
import { analyzeXray } from './utils/aiModel';
import { databaseService } from './utils/databaseService';
import { initializeApp } from './utils/initializeApp';

type AppStep = 'landing' | 'form' | 'analysis' | 'report' | 'doctors' | 'history' | 'dashboard';

function AppContent() {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { showNotification } = useNotification();

  // Initialize the app and database on startup
  useEffect(() => {
    initializeApp();
  }, []);

  console.log('App rendered with currentStep:', currentStep, 'patientData:', patientData?.name);

  const handleEnterApp = () => {
    setCurrentStep('form');
  };

  const handleFormSubmit = async (data: PatientData) => {
    console.log('Form submitted with data:', data.name);
    setPatientData(data);
    setCurrentStep('analysis');

    // AI analysis using your DenseNet121 model logic
    try {
      const result = await analyzeXray(data); // Pass complete patient data
      setAnalysisResult(result);
      
      // Store the analysis in the database
      try {
        const analysisId = await databaseService.storeAnalysis(data, result);
        console.log('Analysis stored with ID:', analysisId);
        showNotification({
          type: 'success',
          title: 'Analysis Saved',
          message: 'Your radiological analysis has been saved to your history.',
          duration: 4000
        });
      } catch (dbError) {
        console.error('Failed to store analysis in database:', dbError);
        showNotification({
          type: 'warning',
          title: 'Storage Warning',
          message: 'Analysis completed but could not be saved to history.',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      // Handle error - could fallback to mock analysis for demo
    }
  };

  const handleViewReport = () => {
    setCurrentStep('report');
  };

  const handleFindDoctors = () => {
    console.log('Find Doctors button clicked, navigating to doctors step');
    setCurrentStep('doctors');
  };

  const handleBackToAnalysis = () => {
    setCurrentStep('analysis');
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
  };

  const handleBackToHomepage = () => {
    setCurrentStep('landing');
    setPatientData(null);
    setAnalysisResult(null);
  };

  const handleNewAnalysis = () => {
    setCurrentStep('form');
    setPatientData(null);
    setAnalysisResult(null);
  };

  const handleViewHistory = () => {
    setCurrentStep('history');
  };

  const handleViewDashboard = () => {
    setCurrentStep('dashboard');
  };

  const handleViewStoredAnalysis = (patientData: PatientData, analysisResult: AnalysisResult) => {
    setPatientData(patientData);
    setAnalysisResult(analysisResult);
    setCurrentStep('analysis');
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {currentStep === 'landing' && (
        <Homepage onEnterApp={handleEnterApp} onViewHistory={handleViewHistory} onViewDashboard={handleViewDashboard} />
      )}

      {currentStep === 'form' && (
        <PatientForm
          onSubmit={handleFormSubmit}
          onBackToHomepage={handleBackToHomepage}
        />
      )}

      {currentStep === 'analysis' && patientData && (
        <AnalysisResults
          patientData={patientData}
          analysisResult={analysisResult}
          onViewReport={handleViewReport}
          onFindDoctors={handleFindDoctors}
          onBackToForm={handleBackToForm}
          onNewAnalysis={handleNewAnalysis}
        />
      )}

      {currentStep === 'report' && patientData && analysisResult && (
        <ClinicalReport
          patientData={patientData}
          analysisResult={analysisResult}
          onFindDoctors={handleFindDoctors}
          onBackToAnalysis={handleBackToAnalysis}
          onNewAnalysis={handleNewAnalysis}
        />
      )}

      {currentStep === 'doctors' && patientData && (
        <OrthopedicFinder
          patientData={patientData}
          onBackToAnalysis={handleBackToAnalysis}
          onNewAnalysis={handleNewAnalysis}
        />
      )}

      {currentStep === 'history' && (
        <AnalysisHistoryComponent
          onBackToHome={handleBackToHomepage}
          onViewAnalysis={handleViewStoredAnalysis}
        />
      )}

      {currentStep === 'dashboard' && (
        <AnalysisDashboard
          onBackToHome={handleBackToHomepage}
          onViewAnalysis={handleViewStoredAnalysis}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;