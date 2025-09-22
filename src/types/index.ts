export interface PatientData {
  name: string;
  patientId: string;
  sex: 'Male' | 'Female' | 'Other';
  age: number;
  symptoms: string;
  medicalHistory: string;
  allergies: string;
  currentMedications: string;
  clinicalNote: string;
  xrayImage: File;
  xrayImageUrl: string;
}

export interface AnalysisResult {
  diagnosis: 'Fracture' | 'Normal';
  confidence: number;
  gradCamImageUrl: string;
  processingTime: number;
  timestamp: string;
  detailedAnalysis?: DetailedAnalysisResult;
  shapExplanation?: ShapExplanation;
}

export interface ShapExplanation {
  available: boolean;
  image?: string;
  topFeatures: ShapFeature[];
  description: string;
}

export interface ShapFeature {
  position: {
    row: number;
    col: number;
  };
  importance: number;
  region: string;
}

export interface DetailedAnalysisResult {
  overallImpression: string;
  detailedFindings: {
    fractureAnalysis: string;
    jointAlignmentAnalysis: string;
    boneIntegrityAnalysis: string;
    softTissueAnalysis: string;
  };
  explainabilityAnalysis: {
    focusCorrelation: string;
    secondaryFindings: string;
    clinicalConfidence: 'Low' | 'Medium' | 'High';
  };
  potentialComplications: string;
  recommendedFollowUp: string;
  fullAnalysis: string;
}

export interface OrthopedicDoctor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  experience: number;
  hospital: string;
  address: string;
  distance: number;
  phone: string;
  email: string;
  availableSlots: TimeSlot[];
  profileImage: string;
  qualifications: string[];
  languages: string[];
  consultationFee: number;
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

export interface AppointmentBooking {
  id: string;
  doctorId: string;
  patientData: PatientData;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: 'in-person' | 'video' | 'phone';
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface StoredAnalysis {
  id: string;
  patientData: Omit<PatientData, 'xrayImage'> & { xrayImageData?: string };
  analysisResult: AnalysisResult;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  notes?: string;
  status: 'completed' | 'in-progress' | 'failed';
}

export interface AnalysisHistory {
  analyses: StoredAnalysis[];
  totalCount: number;
  lastUpdated: string;
}

export interface DatabaseStats {
  totalAnalyses: number;
  fractureDetected: number;
  normalResults: number;
  averageConfidence: number;
  recentAnalyses: number;
}