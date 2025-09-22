import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, MapPin, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { OrthopedicDoctor, PatientData, AppointmentBooking as AppointmentBookingType, TimeSlot } from '../types';

interface AppointmentBookingProps {
  doctor: OrthopedicDoctor;
  patientData: PatientData;
  onBack: () => void;
  onBackToAnalysis?: () => void;
  onNewAnalysis: () => void;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  doctor,
  patientData,
  onBack,
  onBackToAnalysis,
  onNewAnalysis
}) => {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [consultationType, setConsultationType] = useState<'in-person' | 'video' | 'phone'>('in-person');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insuranceId, setInsuranceId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newBookingId = `APT-${Date.now()}`;
      setBookingId(newBookingId);
      setBookingComplete(true);
      setIsSubmitting(false);
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with back button */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-2 sm:mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Specialist Directory"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Consultation Confirmed</h1>
                <div className="hidden sm:flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                  <span>Patient Intake</span>
                  <span>→</span>
                  <span>Diagnostic Results</span>
                  <span>→</span>
                  <button onClick={onBack} className="hover:text-blue-600 transition-colors">Specialist Directory</button>
                  <span>→</span>
                  <span className="font-medium text-gray-900">Consultation Scheduled</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-4 sm:py-8 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Consultation Scheduled</h2>
          <p className="text-gray-600 mb-6">
            Your orthopedic consultation has been successfully scheduled with Dr. {doctor.name}.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Consultation Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-medium">{bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium">Dr. {doctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{selectedSlot && formatDate(selectedSlot.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{selectedSlot && formatTime(selectedSlot.time)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{consultationType.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Professional Fee:</span>
                <span className="font-medium">${doctor.consultationFee}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <h4 className="font-medium text-blue-900 mb-1">What's Next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• You'll receive a confirmation email shortly</li>
                  <li>• The doctor's office will call you within 24 hours</li>
                  <li>• Bring your X-ray images and medical records</li>
                  <li>• Arrive 15 minutes early for check-in</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onBack}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Specialists</span>
            </button>
            <button
              onClick={onNewAnalysis}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              New Patient
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-2 sm:mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Doctor Search"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Schedule Consultation</h1>
              <div className="hidden sm:flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                <span>Patient Intake</span>
                <span>→</span>
                <span>Diagnostic Results</span>
                <span>→</span>
                <button onClick={onBack} className="hover:text-blue-600 transition-colors">Specialist Directory</button>
                <span>→</span>
                <span className="font-medium text-gray-900">Schedule Consultation</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Doctor Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-8">
              <div className="text-center mb-6">
                <img
                  src={doctor.profileImage}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                <p className="text-gray-600 text-sm">{doctor.hospital}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">{doctor.address}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">{doctor.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">{doctor.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CreditCard className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">Professional Fee: ${doctor.consultationFee}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Qualifications</h4>
                <div className="space-y-2">
                  {doctor.qualifications.map((qual, index) => (
                    <div key={index} className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      {qual}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitBooking} className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Patient Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Patient Demographics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                    <input
                      type="text"
                      value={patientData.name}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
                    <input
                      type="text"
                      value={patientData.patientId}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="text"
                      value={`${patientData.age} years`}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <input
                      type="text"
                      value={patientData.sex}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="patient@email.com"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Name and phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Consultation Scheduling</h3>
                
                {/* Available Time Slots */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Available Consultation Times *</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {doctor.availableSlots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          selectedSlot?.id === slot.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="font-medium">{formatDate(slot.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{formatTime(slot.time)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Consultation Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Consultation Modality *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: 'in-person', label: 'In-Person Consultation', icon: User },
                      { value: 'video', label: 'Telemedicine (Video)', icon: Calendar },
                      { value: 'phone', label: 'Telephone Consultation', icon: Phone }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setConsultationType(value as any)}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          consultationType === value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-2" />
                        <div className="font-medium">{label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Appointment Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinical Notes & Concerns (Optional)
                  </label>
                  <textarea
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Specific orthopedic concerns, functional limitations, pain patterns, or questions for the specialist..."
                  />
                </div>
              </div>

              {/* Insurance Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Insurance & Billing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Insurance Carrier</label>
                    <input
                      type="text"
                      value={insuranceProvider}
                      onChange={(e) => setInsuranceProvider(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Aetna, BCBS, UnitedHealthcare"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Member ID Number</label>
                    <input
                      type="text"
                      value={insuranceId}
                      onChange={(e) => setInsuranceId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Insurance member identification number"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Professional Service Fee</h4>
                    <p className="text-2xl font-bold text-blue-600">${doctor.consultationFee}</p>
                  </div>
                  <button
                    type="submit"
                    disabled={!selectedSlot || !contactPhone || !contactEmail || isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Booking...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5 mr-2" />
                        Schedule Consultation
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;