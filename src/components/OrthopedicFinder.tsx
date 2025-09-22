import React, { useState, useEffect } from 'react';
import { MapPin, Star, Phone, Mail, Calendar, Clock, Filter, Search, Navigation, Award, Languages, DollarSign, ArrowLeft } from 'lucide-react';
import { PatientData, OrthopedicDoctor, AppointmentBooking } from '../types';
import AppointmentBookingComponent from './AppointmentBooking';

interface OrthopedicFinderProps {
  patientData: PatientData;
  onBackToAnalysis: () => void;
  onNewAnalysis: () => void;
}

const OrthopedicFinder: React.FC<OrthopedicFinderProps> = ({ patientData, onBackToAnalysis, onNewAnalysis }) => {
  const [doctors, setDoctors] = useState<OrthopedicDoctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<OrthopedicDoctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<OrthopedicDoctor | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'experience' | 'fee'>('rating');
  const [filterRating, setFilterRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState(50);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  console.log('OrthopedicFinder rendered with patient:', patientData.name);

  // Mock data for orthopedic doctors
  const mockDoctors: OrthopedicDoctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Orthopedic Trauma Surgery & Fracture Management',
      rating: 4.9,
      reviewCount: 156,
      experience: 15,
      hospital: 'City General Hospital',
      address: '123 Medical Center Dr, Downtown',
      distance: 2.3,
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@citygeneral.com',
      profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      qualifications: ['MD', 'FRCS', 'Fellowship in Trauma Surgery'],
      languages: ['English', 'Spanish'],
      consultationFee: 250,
      availableSlots: [
        { id: '1', date: '2024-01-15', time: '09:00', available: true },
        { id: '2', date: '2024-01-15', time: '10:30', available: true },
        { id: '3', date: '2024-01-16', time: '14:00', available: true },
      ]
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Hand & Upper Extremity Surgery',
      rating: 4.8,
      reviewCount: 203,
      experience: 12,
      hospital: 'Metropolitan Medical Center',
      address: '456 Health Plaza, Midtown',
      distance: 4.1,
      phone: '+1 (555) 234-5678',
      email: 'michael.chen@metromedical.com',
      profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      qualifications: ['MD', 'Fellowship in Hand Surgery', 'Board Certified'],
      languages: ['English', 'Mandarin'],
      consultationFee: 300,
      availableSlots: [
        { id: '4', date: '2024-01-15', time: '11:00', available: true },
        { id: '5', date: '2024-01-17', time: '09:30', available: true },
      ]
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialization: 'Sports Medicine & Arthroscopic Surgery',
      rating: 4.7,
      reviewCount: 89,
      experience: 8,
      hospital: 'Sports Medicine Institute',
      address: '789 Athletic Way, Sports District',
      distance: 6.8,
      phone: '+1 (555) 345-6789',
      email: 'emily.rodriguez@sportsmed.com',
      profileImage: 'https://images.unsplash.com/photo-1594824475317-8b7b0c8b8b8b?w=150&h=150&fit=crop&crop=face',
      qualifications: ['MD', 'Sports Medicine Fellowship', 'AOSSM Member'],
      languages: ['English', 'Spanish', 'Portuguese'],
      consultationFee: 275,
      availableSlots: [
        { id: '6', date: '2024-01-16', time: '08:00', available: true },
        { id: '7', date: '2024-01-16', time: '15:30', available: true },
      ]
    },
    {
      id: '4',
      name: 'Dr. Robert Thompson',
      specialization: 'Adult Reconstruction & Joint Replacement Surgery',
      rating: 4.6,
      reviewCount: 134,
      experience: 20,
      hospital: 'University Medical Center',
      address: '321 University Ave, Medical District',
      distance: 8.2,
      phone: '+1 (555) 456-7890',
      email: 'robert.thompson@umc.edu',
      profileImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      qualifications: ['MD', 'PhD', 'Fellowship in Joint Replacement'],
      languages: ['English'],
      consultationFee: 320,
      availableSlots: [
        { id: '8', date: '2024-01-17', time: '13:00', available: true },
        { id: '9', date: '2024-01-18', time: '10:00', available: true },
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading and get user location
    const loadDoctors = async () => {
      console.log('Loading doctors for patient:', patientData.name);
      setLoading(true);

      try {
        // Get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('Location obtained:', position.coords);
              setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
            },
            (error) => {
              console.log('Location access denied:', error);
              // Use default location (New York City)
              setUserLocation({ lat: 40.7128, lng: -74.0060 });
            }
          );
        } else {
          // Use default location if geolocation not supported
          setUserLocation({ lat: 40.7128, lng: -74.0060 });
        }

        // Simulate API call delay
        setTimeout(() => {
          console.log('Setting doctors data');
          setDoctors(mockDoctors);
          setFilteredDoctors(mockDoctors);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading doctors:', error);
        setLoading(false);
      }
    };

    loadDoctors();
  }, [patientData]);

  useEffect(() => {
    // Filter and sort doctors
    let filtered = doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRating = doctor.rating >= filterRating;
      const matchesDistance = doctor.distance <= maxDistance;

      return matchesSearch && matchesRating && matchesDistance;
    });

    // Sort doctors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return a.distance - b.distance;
        case 'experience':
          return b.experience - a.experience;
        case 'fee':
          return a.consultationFee - b.consultationFee;
        default:
          return 0;
      }
    });

    setFilteredDoctors(filtered);
  }, [doctors, searchQuery, sortBy, filterRating, maxDistance]);

  const handleBookAppointment = (doctor: OrthopedicDoctor) => {
    setSelectedDoctor(doctor);
    setShowBooking(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (showBooking && selectedDoctor) {
    return (
      <AppointmentBookingComponent
        doctor={selectedDoctor}
        patientData={patientData}
        onBack={() => setShowBooking(false)}
        onBackToAnalysis={onBackToAnalysis}
        onNewAnalysis={onNewAnalysis}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <button
                onClick={onBackToAnalysis}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                title="Back to Analysis Results"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Orthopedic Specialist Directory</h1>
                <div className="hidden sm:flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mt-1">
                  <span>Patient Intake</span>
                  <span>→</span>
                  <button onClick={onBackToAnalysis} className="hover:text-blue-600 transition-colors">Diagnostic Results</button>
                  <span>→</span>
                  <span className="font-medium text-gray-900">Specialist Referral</span>
                </div>
              </div>
            </div>
            <button
              onClick={onNewAnalysis}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base flex-shrink-0"
            >
              New Patient
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search doctors, specializations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="rating">Sort by Rating</option>
              <option value="distance">Sort by Distance</option>
              <option value="experience">Sort by Experience</option>
              <option value="fee">Sort by Fee</option>
            </select>

            {/* Rating Filter */}
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(Number(e.target.value))}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            >
              <option value={0}>All Ratings</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
              <option value={4.8}>4.8+ Stars</option>
            </select>

            {/* Distance Filter */}
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            >
              <option value={50}>Within 50 miles</option>
              <option value={25}>Within 25 miles</option>
              <option value={10}>Within 10 miles</option>
              <option value={5}>Within 5 miles</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Finding orthopedic specialists near you...</span>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {filteredDoctors.length} board-certified orthopedic specialists in your area
              </p>
              {userLocation && (
                <div className="flex items-center text-sm text-gray-500">
                  <Navigation className="w-4 h-4 mr-1" />
                  Location detected
                </div>
              )}
            </div>

            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <img
                      src={doctor.profileImage}
                      alt={doctor.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{doctor.name}</h3>
                      <p className="text-blue-600 font-medium text-sm sm:text-base">{doctor.specialization}</p>
                      <p className="text-gray-600 text-sm sm:text-base">{doctor.hospital}</p>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 space-y-1 sm:space-y-0">
                        <div className="flex items-center">
                          {renderStars(doctor.rating)}
                          <span className="ml-1 text-xs sm:text-sm text-gray-600">
                            {doctor.rating} ({doctor.reviewCount} reviews)
                          </span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {doctor.experience} years exp.
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {doctor.distance} miles away
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 space-y-1 sm:space-y-0">
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          ${doctor.consultationFee} consultation
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <Languages className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {doctor.languages.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleBookAppointment(doctor)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center text-sm sm:text-base"
                    >
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Schedule Consultation
                    </button>
                    <div className="flex space-x-2">
                      <a
                        href={`tel:${doctor.phone}`}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center text-sm sm:text-base"
                      >
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Call</span>
                      </a>
                      <a
                        href={`mailto:${doctor.email}`}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center text-sm sm:text-base"
                      >
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Email</span>
                      </a>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Qualifications</h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {doctor.qualifications.map((qual, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {qual}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Address</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{doctor.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrthopedicFinder;