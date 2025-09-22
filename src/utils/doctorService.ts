import { OrthopedicDoctor } from '../types';

// Mock API service for doctor search and appointment booking
export class DoctorService {
  private static mockDoctors: OrthopedicDoctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Orthopedic Trauma & Fracture Specialist',
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
      specialization: 'Hand & Wrist Surgery',
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
      specialization: 'Sports Medicine & Orthopedics',
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
      specialization: 'Orthopedic Surgery & Joint Replacement',
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
    },
    {
      id: '5',
      name: 'Dr. Amanda Foster',
      specialization: 'Pediatric Orthopedics',
      rating: 4.8,
      reviewCount: 97,
      experience: 10,
      hospital: 'Children\'s Medical Center',
      address: '555 Kids Health Blvd, Family District',
      distance: 5.5,
      phone: '+1 (555) 567-8901',
      email: 'amanda.foster@childrenmed.com',
      profileImage: 'https://images.unsplash.com/photo-1594824475317-8b7b0c8b8b8b?w=150&h=150&fit=crop&crop=face',
      qualifications: ['MD', 'Pediatric Orthopedics Fellowship', 'Board Certified'],
      languages: ['English', 'French'],
      consultationFee: 280,
      availableSlots: [
        { id: '10', date: '2024-01-16', time: '10:00', available: true },
        { id: '11', date: '2024-01-17', time: '14:30', available: true },
      ]
    }
  ];

  // Search doctors based on location and filters
  static async searchDoctors(params: {
    location?: { lat: number; lng: number };
    specialization?: string;
    maxDistance?: number;
    minRating?: number;
    sortBy?: 'rating' | 'distance' | 'experience' | 'fee';
  }): Promise<OrthopedicDoctor[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let doctors = [...this.mockDoctors];

    // Apply filters
    if (params.minRating) {
      doctors = doctors.filter(doc => doc.rating >= params.minRating!);
    }

    if (params.maxDistance) {
      doctors = doctors.filter(doc => doc.distance <= params.maxDistance!);
    }

    if (params.specialization) {
      doctors = doctors.filter(doc => 
        doc.specialization.toLowerCase().includes(params.specialization!.toLowerCase())
      );
    }

    // Sort results
    if (params.sortBy) {
      doctors.sort((a, b) => {
        switch (params.sortBy) {
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
    }

    return doctors;
  }

  // Get doctor by ID
  static async getDoctorById(id: string): Promise<OrthopedicDoctor | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockDoctors.find(doc => doc.id === id) || null;
  }

  // Book appointment
  static async bookAppointment(appointmentData: {
    doctorId: string;
    patientData: any;
    slotId: string;
    consultationType: 'in-person' | 'video' | 'phone';
    notes?: string;
    contactInfo: {
      phone: string;
      email: string;
      emergencyContact?: string;
    };
    insurance?: {
      provider: string;
      id: string;
    };
  }): Promise<{ success: boolean; bookingId?: string; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate success/failure
    const success = Math.random() > 0.1; // 90% success rate

    if (success) {
      const bookingId = `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return { success: true, bookingId };
    } else {
      return { success: false, error: 'Unable to book appointment. Please try again.' };
    }
  }

  // Get user's current location
  static async getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Return default location (New York City)
          resolve({ lat: 40.7128, lng: -74.0060 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Calculate distance between two points (simplified)
  static calculateDistance(
    lat1: number, 
    lng1: number, 
    lat2: number, 
    lng2: number
  ): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export default DoctorService;