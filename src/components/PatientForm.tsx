import React, { useState } from 'react';
import { Upload, User, FileText, Calendar, Users, ArrowLeft, Sparkles, Heart, AlertTriangle, Pill, UserCheck } from 'lucide-react';
import { PatientData } from '../types';

interface PatientFormProps {
  onSubmit: (data: PatientData) => void;
  onBackToHomepage: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, onBackToHomepage }) => {
  const [formData, setFormData] = useState({
    name: '',
    patientId: '',
    sex: '' as 'Male' | 'Female' | 'Other' | '',
    age: '',
    symptoms: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    clinicalNote: ''
  });
  const [xrayImage, setXrayImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (file: File) => {
    setXrayImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xrayImage) return;

    setIsSubmitting(true);
    
    const patientData: PatientData = {
      name: formData.name,
      patientId: formData.patientId,
      sex: formData.sex as 'Male' | 'Female' | 'Other',
      age: parseInt(formData.age),
      symptoms: formData.symptoms,
      medicalHistory: formData.medicalHistory,
      allergies: formData.allergies,
      currentMedications: formData.currentMedications,
      clinicalNote: formData.clinicalNote,
      xrayImage,
      xrayImageUrl: imagePreview
    };

    onSubmit(patientData);
  };

  const isFormValid = formData.name && formData.patientId && formData.sex && formData.age && xrayImage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <button
                onClick={onBackToHomepage}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                title="Back to Homepage"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-xl flex-shrink-0">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">Radiological Assessment Intake</h1>
                <div className="hidden sm:flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                  <button onClick={onBackToHomepage} className="hover:text-blue-600 transition-colors">RadiologyAI Platform</button>
                  <span>→</span>
                  <span className="font-medium text-gray-900">Patient Intake Form</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 flex-shrink-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm">1</div>
              <div className="w-8 sm:w-16 h-1 bg-gray-200 rounded"></div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm">2</div>
              <div className="w-8 sm:w-16 h-1 bg-gray-200 rounded"></div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm">3</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200">
            <div className="flex items-start sm:items-center mb-2">
              <div className="bg-blue-100 p-2 rounded-lg mr-3 flex-shrink-0">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Patient Demographics & Clinical History</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Required for comprehensive radiological assessment and orthopedic consultation</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Patient Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white text-sm sm:text-base"
                  placeholder="Last, First Middle"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Record Number (MRN)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">#</span>
                  <input
                    type="text"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    className="w-full pl-6 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white text-sm sm:text-base"
                    placeholder="Medical Record Number"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age (Years)
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white text-sm sm:text-base"
                  placeholder="Patient age in years"
                  min="0"
                  max="150"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biological Sex
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white appearance-none text-sm sm:text-base"
                  required
                >
                  <option value="">Select biological sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Intersex/Other</option>
                </select>
              </div>
            </div>

            {/* Symptoms & Chief Complaints */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chief Complaint & Present Illness
              </label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-gray-900 bg-white"
                placeholder="Primary presenting complaint, pain characteristics (location, quality, severity 1-10), onset, duration, aggravating/alleviating factors, associated symptoms..."
              />
              <div className="text-xs text-gray-500">{formData.symptoms.length}/1000 characters</div>
            </div>

            {/* Medical History */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Heart className="w-4 h-4 mr-2 text-gray-500" />
                Past Medical & Surgical History
              </label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-gray-900 bg-white"
                placeholder="Previous orthopedic injuries, fractures, surgeries, chronic musculoskeletal conditions, osteoporosis, arthritis, relevant family history of bone disorders..."
              />
              <div className="text-xs text-gray-500">{formData.medicalHistory.length}/2000 characters</div>
            </div>

            {/* Allergies */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-gray-500" />
                Drug Allergies & Adverse Reactions
              </label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-gray-900 bg-white"
                placeholder="Known drug allergies, contrast media reactions, latex sensitivity, specific reactions (rash, anaphylaxis, etc.). Enter NKDA if no known drug allergies..."
              />
              <div className="text-xs text-gray-500">{formData.allergies.length}/500 characters</div>
            </div>

            {/* Current Medications */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Pill className="w-4 h-4 mr-2 text-gray-500" />
                Current Medications & Supplements
              </label>
              <textarea
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-gray-900 bg-white"
                placeholder="Current prescription medications with dosages and frequency (e.g., Ibuprofen 600mg TID, Calcium 1000mg BID), OTC medications, herbal supplements, vitamins. Include anticoagulants, steroids, bisphosphonates..."
              />
              <div className="text-xs text-gray-500">{formData.currentMedications.length}/1000 characters</div>
            </div>

            {/* Clinical Notes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clinical Assessment & Physical Examination
              </label>
              <textarea
                name="clinicalNote"
                value={formData.clinicalNote}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-gray-900 bg-white"
                placeholder="Physical examination findings, range of motion limitations, deformity, swelling, tenderness, neurovascular status, mechanism of injury, clinical impression, differential diagnosis considerations..."
              />
              <div className="text-xs text-gray-500">{formData.clinicalNote.length}/2000 characters</div>
            </div>

            {/* X-ray Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 mb-3">
                <Upload className="inline w-5 h-5 mr-2 text-blue-600" />
                Radiographic Images (Required) *
              </label>
              <div 
                className={`border-3 border-dashed rounded-3xl p-8 transition-all duration-300 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : imagePreview 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="space-y-6">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="X-ray preview"
                        className="max-h-80 mx-auto rounded-2xl shadow-lg border-4 border-white"
                      />
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                        <span>✓</span>
                        <span>Ready</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-green-700 mb-2">Image uploaded successfully</p>
                      <p className="text-sm text-gray-600 mb-4">File: {xrayImage?.name}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setXrayImage(null);
                          setImagePreview('');
                        }}
                        className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors duration-200"
                      >
                        Choose different image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Upload className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Radiographic Study</h3>
                    <p className="text-gray-600 mb-6">Upload digital radiographs (X-ray images) for computer-assisted diagnostic analysis</p>
                    <label className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl cursor-pointer font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                      Browse Files
                      <input
                        type="file"
                        accept="image/*,.dcm"
                        onChange={handleFileInput}
                        className="hidden"
                        required
                      />
                    </label>
                    <div className="mt-6 grid grid-cols-3 gap-4 text-xs text-gray-500">
                      <div className="bg-white/50 rounded-lg p-3">
                        <div className="font-semibold text-gray-700">Formats</div>
                        <div>DICOM, JPG, PNG</div>
                      </div>
                      <div className="bg-white/50 rounded-lg p-3">
                        <div className="font-semibold text-gray-700">Resolution</div>
                        <div>Min 512x512 px</div>
                      </div>
                      <div className="bg-white/50 rounded-lg p-3">
                        <div className="font-semibold text-gray-700">File Size</div>
                        <div>Max 25MB</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 sm:pt-8 border-t border-gray-200">
              <div className="space-y-3 sm:space-y-4">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white py-4 sm:py-6 rounded-2xl font-bold text-base sm:text-lg lg:text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-blue-500/25 relative overflow-hidden"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <div className="animate-spin h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent rounded-full"></div>
                      <span className="text-sm sm:text-base">Processing Radiographic Analysis...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="text-sm sm:text-base">Submit for Radiological Assessment</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
                
                {/* Test button for direct doctor access */}
                {isFormValid && (
                  <button
                    type="button"
                    onClick={() => {
                      const testPatientData: PatientData = {
                        name: formData.name,
                        patientId: formData.patientId,
                        sex: formData.sex as 'Male' | 'Female' | 'Other',
                        age: parseInt(formData.age),
                        symptoms: formData.symptoms,
                        medicalHistory: formData.medicalHistory,
                        allergies: formData.allergies,
                        currentMedications: formData.currentMedications,
                        clinicalNote: formData.clinicalNote,
                        xrayImage: xrayImage!,
                        xrayImageUrl: imagePreview
                      };
                      console.log('Test: Navigating directly to doctors with data:', testPatientData);
                      onSubmit(testPatientData);
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg text-sm sm:text-base"
                  >
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Direct Orthopedic Referral (Skip Analysis)</span>
                    </div>
                  </button>
                )}
              </div>
              
              {!isFormValid && (
                <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 px-4">
                  Complete all required fields and upload radiographic images to proceed
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;