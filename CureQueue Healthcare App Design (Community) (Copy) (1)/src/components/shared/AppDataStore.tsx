import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { supabaseService } from '../../utils/supabase/supabase-service';
import { useAuth } from './AuthContext';
import { toast } from 'sonner@2.0.3';

// Types (keeping existing interface)
export interface Hospital {
  id: string;
  name: string;
  distance: string;
  waitTime: string;
  rating: number;
  status: 'Low wait' | 'Moderate wait' | 'High wait';
  location: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  experience: string;
  distance: string;
  nextAvailable: string;
  consultationFee: string;
  isAvailable: boolean;
  currentLocation?: string;
  estimatedArrival?: string;
}

export interface HomeVisitRequest {
  id: string;
  patientName: string;
  patientPhone: string;
  address: string;
  urgency: 'Low' | 'Medium' | 'High';
  symptoms: string;
  preferredTime: string;
  status: 'Pending' | 'Accepted' | 'In Transit' | 'Completed' | 'Cancelled';
  assignedDoctor?: Doctor;
  requestTime: string;
  estimatedArrival?: string;
  notes?: string;
  userId?: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  waitTime?: string;
  estimatedWaitTime?: string;
  bookingTime: string;
  symptoms?: string;
  notes?: string;
  userId?: string;
}

export interface QueuePatient {
  id: string;
  name: string;
  appointmentTime: string;
  doctor: string;
  status: 'Waiting' | 'In Consultation' | 'Completed';
  waitTime: string;
  urgency: 'Low' | 'Medium' | 'High';
}

interface AppDataContextType {
  // Loading and connection states
  loading: boolean;
  isOfflineMode: boolean;
  lastSyncTime: string | null;
  
  // Hospitals & Wait Times
  hospitals: Hospital[];
  updateHospitalWaitTime: (hospitalId: string, waitTime: string, status: Hospital['status']) => Promise<void>;
  
  // Doctors
  doctors: Doctor[];
  updateDoctorLocation: (doctorId: string, location: string, estimatedArrival?: string) => Promise<void>;
  
  // Home Visit Requests
  homeVisitRequests: HomeVisitRequest[];
  addHomeVisitRequest: (request: Omit<HomeVisitRequest, 'id' | 'status' | 'requestTime'>) => Promise<void>;
  updateHomeVisitStatus: (requestId: string, status: HomeVisitRequest['status'], assignedDoctor?: Doctor, estimatedArrival?: string) => Promise<void>;
  
  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'bookingTime'>) => Promise<void>;
  updateAppointmentWaitTime: (appointmentId: string, waitTime: string) => Promise<void>;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => Promise<void>;
  
  // Queue Management
  queuePatients: QueuePatient[];
  addToQueue: (patient: Omit<QueuePatient, 'id'>) => void;
  updateQueueStatus: (patientId: string, status: QueuePatient['status']) => Promise<void>;
  removeFromQueue: (patientId: string) => void;

  // Data refresh
  refreshData: () => Promise<void>;
  retryConnection: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isOfflineMode: authOfflineMode } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Local state with Indian-specific demo data
  const [hospitals, setHospitals] = useState<Hospital[]>([
    {
      id: '1',
      name: 'Apollo Hospital',
      distance: '0.8 km',
      waitTime: '15 min',
      rating: 4.5,
      status: 'Low wait',
      location: 'Connaught Place, New Delhi'
    },
    {
      id: '2',
      name: 'Fortis Healthcare',
      distance: '1.2 km',
      waitTime: '25 min',
      rating: 4.2,
      status: 'Moderate wait',
      location: 'Vasant Kunj, New Delhi'
    },
    {
      id: '3',
      name: 'Max Super Speciality Hospital',
      distance: '2.1 km',
      waitTime: '10 min',
      rating: 4.7,
      status: 'Low wait',
      location: 'Saket, New Delhi'
    },
    {
      id: '4',
      name: 'AIIMS',
      distance: '3.5 km',
      waitTime: '45 min',
      rating: 4.8,
      status: 'High wait',
      location: 'Ansari Nagar, New Delhi'
    },
    {
      id: '5',
      name: 'Sir Ganga Ram Hospital',
      distance: '2.8 km',
      waitTime: '20 min',
      rating: 4.6,
      status: 'Moderate wait',
      location: 'Rajinder Nagar, New Delhi'
    }
  ]);

  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      specialty: 'Cardiology',
      hospital: 'Apollo Hospital',
      rating: 4.8,
      experience: '12 years',
      distance: '0.8 km',
      nextAvailable: 'Today 2:30 PM',
      consultationFee: '₹800',
      isAvailable: true
    },
    {
      id: '2',
      name: 'Dr. Rajesh Kumar',
      specialty: 'Neurology',
      hospital: 'Fortis Healthcare',
      rating: 4.6,
      experience: '15 years',
      distance: '1.2 km',
      nextAvailable: 'Tomorrow 10:00 AM',
      consultationFee: '₹1200',
      isAvailable: true
    },
    {
      id: '3',
      name: 'Dr. Sunita Agarwal',
      specialty: 'General Medicine',
      hospital: 'Max Super Speciality Hospital',
      rating: 4.9,
      experience: '8 years',
      distance: '2.1 km',
      nextAvailable: 'Today 4:00 PM',
      consultationFee: '₹600',
      isAvailable: true
    },
    {
      id: '4',
      name: 'Dr. Amit Gupta',
      specialty: 'Ophthalmology',
      hospital: 'AIIMS',
      rating: 4.7,
      experience: '20 years',
      distance: '3.5 km',
      nextAvailable: 'Tomorrow 2:00 PM',
      consultationFee: '₹500',
      isAvailable: true
    },
    {
      id: '5',
      name: 'Dr. Kavita Singh',
      specialty: 'Pediatrics',
      hospital: 'Sir Ganga Ram Hospital',
      rating: 4.8,
      experience: '10 years',
      distance: '2.8 km',
      nextAvailable: 'Today 6:00 PM',
      consultationFee: '₹700',
      isAvailable: false,
      currentLocation: 'En route to patient',
      estimatedArrival: '25 minutes'
    },
    {
      id: '6',
      name: 'Dr. Vikram Malhotra',
      specialty: 'Dermatology',
      hospital: 'Apollo Hospital',
      rating: 4.5,
      experience: '14 years',
      distance: '0.8 km',
      nextAvailable: 'Tomorrow 11:30 AM',
      consultationFee: '₹900',
      isAvailable: true
    },
    {
      id: '7',
      name: 'Dr. Neha Jain',
      specialty: 'Gynecology',
      hospital: 'Fortis Healthcare',
      rating: 4.7,
      experience: '11 years',
      distance: '1.2 km',
      nextAvailable: 'Today 5:30 PM',
      consultationFee: '₹800',
      isAvailable: true
    },
    {
      id: '8',
      name: 'Dr. Arjun Mehta',
      specialty: 'Orthopedics',
      hospital: 'Max Super Speciality Hospital',
      rating: 4.6,
      experience: '16 years',
      distance: '2.1 km',
      nextAvailable: 'Tomorrow 9:00 AM',
      consultationFee: '₹1000',
      isAvailable: true
    }
  ]);

  const [homeVisitRequests, setHomeVisitRequests] = useState<HomeVisitRequest[]>([
    {
      id: 'demo-1',
      patientName: 'Rohit Sharma',
      patientPhone: '+91 98765 43210',
      address: '123, Lajpat Nagar, New Delhi - 110024',
      urgency: 'Medium',
      symptoms: 'Fever and headache for 2 days',
      preferredTime: 'Today 3:00 PM',
      status: 'Accepted',
      assignedDoctor: doctors[4], // Dr. Kavita Singh
      requestTime: '15 Jan 2024, 10:30 AM',
      estimatedArrival: '25 minutes',
      notes: 'Patient requested home visit due to mobility issues'
    }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'demo-1',
      patientName: 'Anita Verma',
      patientPhone: '+91 87654 32109',
      doctorId: '1',
      doctorName: 'Dr. Priya Sharma',
      specialty: 'Cardiology',
      hospital: 'Apollo Hospital',
      date: '2024-01-15',
      time: '2:30 PM',
      status: 'Confirmed',
      waitTime: '15 min',
      estimatedWaitTime: '10-20 minutes',
      bookingTime: '14 Jan 2024, 09:15 AM',
      symptoms: 'Chest pain and shortness of breath',
      notes: 'Follow-up appointment for cardiac checkup'
    }
  ]);

  const [queuePatients, setQueuePatients] = useState<QueuePatient[]>([
    {
      id: '1',
      name: 'Anita Verma',
      appointmentTime: '2:30 PM',
      doctor: 'Dr. Priya Sharma',
      status: 'Waiting',
      waitTime: '15 min',
      urgency: 'Medium'
    },
    {
      id: '2',
      name: 'Suresh Gupta',
      appointmentTime: '3:00 PM',
      doctor: 'Dr. Rajesh Kumar',
      status: 'In Consultation',
      waitTime: '5 min',
      urgency: 'High'
    }
  ]);

  // Sync offline mode with auth context
  useEffect(() => {
    setIsOfflineMode(authOfflineMode);
  }, [authOfflineMode]);

  // Load data with proper error handling
  const loadData = async (showToast = false) => {
    // Don't try to load data if we're in offline mode
    if (authOfflineMode) {
      if (showToast) {
        toast.info('Working in offline mode with demo data');
      }
      return;
    }

    try {
      setLoading(true);
      
      // Try to load real data from backend
      const results = await Promise.allSettled([
        supabaseService.getAppointments(user?.id),
        supabaseService.getHomeVisits(user?.id),
        supabaseService.getHospitals(),
        supabaseService.getDoctors(),
        supabaseService.getPatientQueue()
      ]);

      let hasErrors = false;

      // Handle appointments
      if (results[0].status === 'fulfilled' && results[0].value) {
        setAppointments(results[0].value);
      } else {
        hasErrors = true;
      }

      // Handle home visits
      if (results[1].status === 'fulfilled' && results[1].value) {
        setHomeVisitRequests(results[1].value);
      } else {
        hasErrors = true;
      }

      // Handle hospitals (keep demo data if API fails)
      if (results[2].status === 'fulfilled' && results[2].value?.length > 0) {
        setHospitals(results[2].value);
      }

      // Handle doctors (keep demo data if API fails)
      if (results[3].status === 'fulfilled' && results[3].value?.length > 0) {
        setDoctors(results[3].value);
      }

      // Handle queue (keep demo data if API fails)
      if (results[4].status === 'fulfilled' && results[4].value?.length > 0) {
        setQueuePatients(results[4].value);
      }

      if (hasErrors) {
        setIsOfflineMode(true);
        if (showToast) {
          toast.warning('Some features may not work - backend not fully ready');
        }
      } else {
        setIsOfflineMode(false);
        setLastSyncTime(new Date().toLocaleString());
        if (showToast) {
          toast.success('Successfully connected to server');
        }
      }
      
    } catch (error) {
      console.log('Backend not available, using offline mode');
      setIsOfflineMode(true);
      if (showToast) {
        toast.info('Working in offline mode with demo data');
      }
    } finally {
      setLoading(false);
    }
  };

  // Only load data when not in offline mode
  useEffect(() => {
    if (!authOfflineMode) {
      loadData();
    }
  }, [user, authOfflineMode]);

  const refreshData = async () => {
    await loadData(true);
  };

  const retryConnection = async () => {
    await loadData(true);
  };

  // Hospital functions
  const updateHospitalWaitTime = useCallback(async (hospitalId: string, waitTime: string, status: Hospital['status']) => {
    try {
      if (!isOfflineMode) {
        await supabaseService.updateHospitalWaitTime(hospitalId, waitTime, status);
        toast.success('Hospital wait time updated successfully');
      } else {
        toast.info('Updated locally - will sync when online');
      }
      
      setHospitals(prev => prev.map(hospital => 
        hospital.id === hospitalId 
          ? { ...hospital, waitTime, status }
          : hospital
      ));
    } catch (error) {
      console.error('Error updating hospital wait time:', error);
      toast.error('Failed to update wait time, updated locally');
      
      // Update locally as fallback
      setHospitals(prev => prev.map(hospital => 
        hospital.id === hospitalId 
          ? { ...hospital, waitTime, status }
          : hospital
      ));
    }
  }, [isOfflineMode]);

  // Doctor functions
  const updateDoctorLocation = useCallback(async (doctorId: string, location: string, estimatedArrival?: string) => {
    try {
      if (!isOfflineMode) {
        await supabaseService.updateDoctorLocation(doctorId, location, estimatedArrival);
        toast.success('Doctor location updated successfully');
      } else {
        toast.info('Updated locally - will sync when online');
      }
      
      setDoctors(prev => prev.map(doctor => 
        doctor.id === doctorId 
          ? { ...doctor, currentLocation: location, estimatedArrival, isAvailable: !estimatedArrival }
          : doctor
      ));
    } catch (error) {
      console.error('Error updating doctor location:', error);
      toast.error('Failed to update doctor location, updated locally');
      
      // Update locally as fallback
      setDoctors(prev => prev.map(doctor => 
        doctor.id === doctorId 
          ? { ...doctor, currentLocation: location, estimatedArrival, isAvailable: !estimatedArrival }
          : doctor
      ));
    }
  }, [isOfflineMode]);

  // Home visit functions
  const addHomeVisitRequest = useCallback(async (request: Omit<HomeVisitRequest, 'id' | 'status' | 'requestTime'>) => {
    const formattedRequest: HomeVisitRequest = {
      ...request,
      id: Date.now().toString(),
      status: 'Pending',
      requestTime: new Date().toLocaleString('en-IN'),
      userId: user?.id
    };

    try {
      if (!isOfflineMode) {
        const homeVisitData = {
          patientName: request.patientName,
          patientPhone: request.patientPhone,
          patientEmail: user?.email,
          address: request.address,
          urgency: request.urgency,
          symptoms: request.symptoms,
          preferredTime: request.preferredTime,
          notes: request.notes,
          userId: user?.id,
        };

        const newHomeVisit = await supabaseService.createHomeVisit(homeVisitData);
        formattedRequest.id = newHomeVisit.id || formattedRequest.id;
        toast.success('Home visit request submitted successfully');
      } else {
        toast.success('Home visit request saved successfully');
      }
      
      setHomeVisitRequests(prev => [formattedRequest, ...prev]);
    } catch (error) {
      console.error('Error creating home visit request:', error);
      toast.success('Home visit request saved locally');
      setHomeVisitRequests(prev => [formattedRequest, ...prev]);
    }
  }, [user, isOfflineMode]);

  const updateHomeVisitStatus = useCallback(async (
    requestId: string, 
    status: HomeVisitRequest['status'], 
    assignedDoctor?: Doctor, 
    estimatedArrival?: string
  ) => {
    try {
      if (!isOfflineMode) {
        const updateData = {
          visitId: requestId,
          status,
          assignedDoctorId: assignedDoctor?.id,
          estimatedArrival,
        };

        await supabaseService.updateHomeVisit(updateData);
        toast.success(`Home visit request ${status.toLowerCase()} successfully`);
      } else {
        toast.success(`Home visit request ${status.toLowerCase()} successfully`);
      }
      
      setHomeVisitRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, status, assignedDoctor, estimatedArrival }
          : request
      ));

      // Update doctor location if assigned
      if (assignedDoctor && status === 'Accepted') {
        updateDoctorLocation(assignedDoctor.id, 'En route to patient', estimatedArrival);
      }
    } catch (error) {
      console.error('Error updating home visit status:', error);
      toast.success(`Home visit request ${status.toLowerCase()} locally`);
      
      setHomeVisitRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, status, assignedDoctor, estimatedArrival }
          : request
      ));
    }
  }, [isOfflineMode, updateDoctorLocation]);

  // Appointment functions
  const addAppointment = useCallback(async (appointment: Omit<Appointment, 'id' | 'status' | 'bookingTime'>) => {
    const formattedAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      status: 'Pending',
      bookingTime: new Date().toLocaleString('en-IN'),
      userId: user?.id
    };

    try {
      if (!isOfflineMode) {
        const appointmentData = {
          patientName: appointment.patientName,
          patientPhone: appointment.patientPhone,
          patientEmail: user?.email,
          doctorId: appointment.doctorId,
          doctorName: appointment.doctorName,
          specialty: appointment.specialty,
          hospital: appointment.hospital,
          date: appointment.date,
          time: appointment.time,
          symptoms: appointment.symptoms,
          notes: appointment.notes,
          userId: user?.id,
        };

        const newAppointment = await supabaseService.createAppointment(appointmentData);
        formattedAppointment.id = newAppointment.id || formattedAppointment.id;
        toast.success('Appointment booked successfully! Waiting for confirmation.');
      } else {
        toast.success('Appointment booked successfully! Waiting for confirmation.');
      }
      
      setAppointments(prev => [formattedAppointment, ...prev]);
      
      // Add to queue
      addToQueue({
        name: appointment.patientName,
        appointmentTime: appointment.time,
        doctor: appointment.doctorName,
        status: 'Waiting',
        waitTime: '0 min',
        urgency: 'Medium'
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.success('Appointment booked locally - will submit when online');
      setAppointments(prev => [formattedAppointment, ...prev]);
    }
  }, [user, isOfflineMode]);

  const updateAppointmentWaitTime = useCallback(async (appointmentId: string, waitTime: string) => {
    try {
      if (!isOfflineMode) {
        await supabaseService.updateAppointment({
          appointmentId,
          waitTime,
          estimatedWaitTime: waitTime
        });
      }

      setAppointments(prev => prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, waitTime, estimatedWaitTime: waitTime }
          : appointment
      ));
    } catch (error) {
      console.error('Error updating appointment wait time:', error);
      setAppointments(prev => prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, waitTime, estimatedWaitTime: waitTime }
          : appointment
      ));
    }
  }, [isOfflineMode]);

  const updateAppointmentStatus = useCallback(async (appointmentId: string, status: Appointment['status']) => {
    try {
      if (!isOfflineMode) {
        await supabaseService.updateAppointment({
          appointmentId,
          status
        });
      }

      setAppointments(prev => prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status }
          : appointment
      ));
      
      if (status === 'Confirmed') {
        toast.success('Appointment confirmed successfully!');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      setAppointments(prev => prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status }
          : appointment
      ));
    }
  }, [isOfflineMode]);

  // Queue functions (mostly local for now)
  const addToQueue = useCallback((patient: Omit<QueuePatient, 'id'>) => {
    const newPatient: QueuePatient = {
      ...patient,
      id: Date.now().toString()
    };
    setQueuePatients(prev => [newPatient, ...prev]);
  }, []);

  const updateQueueStatus = useCallback(async (patientId: string, status: QueuePatient['status']) => {
    try {
      if (!isOfflineMode) {
        await supabaseService.updateQueueStatus(patientId, status);
      }
      
      setQueuePatients(prev => prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, status }
          : patient
      ));
    } catch (error) {
      console.error('Error updating queue status:', error);
      setQueuePatients(prev => prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, status }
          : patient
      ));
    }
  }, [isOfflineMode]);

  const removeFromQueue = useCallback((patientId: string) => {
    setQueuePatients(prev => prev.filter(patient => patient.id !== patientId));
  }, []);

  const value: AppDataContextType = {
    loading,
    isOfflineMode,
    lastSyncTime,
    hospitals,
    updateHospitalWaitTime,
    doctors,
    updateDoctorLocation,
    homeVisitRequests,
    addHomeVisitRequest,
    updateHomeVisitStatus,
    appointments,
    addAppointment,
    updateAppointmentWaitTime,
    updateAppointmentStatus,
    queuePatients,
    addToQueue,
    updateQueueStatus,
    removeFromQueue,
    refreshData,
    retryConnection
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}