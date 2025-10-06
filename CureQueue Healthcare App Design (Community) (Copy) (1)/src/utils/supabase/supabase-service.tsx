import { projectId, publicAnonKey } from './info';

// Types for our API requests/responses
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'admin' | 'doctor';
  phone?: string;
}

export interface CreateAppointmentRequest {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  symptoms?: string;
  notes?: string;
  userId?: string;
}

export interface CreateHomeVisitRequest {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  address: string;
  urgency: 'Low' | 'Medium' | 'High';
  symptoms: string;
  preferredTime: string;
  notes?: string;
  userId?: string;
}

export interface UpdateAppointmentRequest {
  appointmentId: string;
  status?: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  waitTime?: string;
  estimatedWaitTime?: string;
  adminNotes?: string;
}

export interface UpdateHomeVisitRequest {
  visitId: string;
  status?: 'Pending' | 'Accepted' | 'In Transit' | 'Completed' | 'Cancelled';
  assignedDoctorId?: string;
  estimatedArrival?: string;
  adminNotes?: string;
}

class SupabaseService {
  private baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-5010b16a`;
  private headers: Record<string, string>;

  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    };
  }

  // Update headers with user token for authenticated requests
  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}, suppressLog = false): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(`HTTP ${response.status}: ${errorText}`);
        
        // Only log unexpected errors (not 404s for missing endpoints)
        if (response.status !== 404 && !suppressLog) {
          console.error(`Supabase API Error (${endpoint}):`, error);
        }
        
        throw error;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text() as T;
    } catch (error: any) {
      // Only log network errors, not 404s which are expected
      if (!error.message?.includes('404') && !suppressLog) {
        console.error(`Supabase API Error (${endpoint}):`, error);
      }
      throw error;
    }
  }

  // Authentication APIs
  async signUp(email: string, password: string, name: string, role: 'patient' | 'admin' | 'doctor', phone?: string): Promise<AuthUser> {
    return this.makeRequest<AuthUser>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role, phone }),
    });
  }

  async signIn(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
    const result = await this.makeRequest<{ user: AuthUser; token: string }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Update headers with new token
    this.setAuthToken(result.token);
    return result;
  }

  async signOut(): Promise<void> {
    await this.makeRequest('/auth/signout', { method: 'POST' }, true);
    // Reset headers to use public key
    this.headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      return await this.makeRequest<AuthUser>('/auth/me', {}, true);
    } catch (error: any) {
      // Expected when backend is not available or user is not authenticated
      return null;
    }
  }

  // Appointment APIs
  async createAppointment(appointment: CreateAppointmentRequest): Promise<any> {
    return this.makeRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  }

  async getAppointments(userId?: string): Promise<any[]> {
    const query = userId ? `?userId=${userId}` : '';
    return this.makeRequest<any[]>(`/appointments${query}`, {}, true);
  }

  async updateAppointment(update: UpdateAppointmentRequest): Promise<any> {
    return this.makeRequest(`/appointments/${update.appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(update),
    });
  }

  async deleteAppointment(appointmentId: string): Promise<void> {
    await this.makeRequest(`/appointments/${appointmentId}`, {
      method: 'DELETE',
    });
  }

  // Home Visit APIs
  async createHomeVisit(homeVisit: CreateHomeVisitRequest): Promise<any> {
    return this.makeRequest('/home-visits', {
      method: 'POST',
      body: JSON.stringify(homeVisit),
    });
  }

  async getHomeVisits(userId?: string): Promise<any[]> {
    const query = userId ? `?userId=${userId}` : '';
    return this.makeRequest<any[]>(`/home-visits${query}`, {}, true);
  }

  async updateHomeVisit(update: UpdateHomeVisitRequest): Promise<any> {
    return this.makeRequest(`/home-visits/${update.visitId}`, {
      method: 'PUT',
      body: JSON.stringify(update),
    });
  }

  async deleteHomeVisit(visitId: string): Promise<void> {
    await this.makeRequest(`/home-visits/${visitId}`, {
      method: 'DELETE',
    });
  }

  // Hospital Data APIs
  async getHospitals(): Promise<any[]> {
    return this.makeRequest<any[]>('/hospitals', {}, true);
  }

  async updateHospitalWaitTime(hospitalId: string, waitTime: string, status: string): Promise<any> {
    return this.makeRequest(`/hospitals/${hospitalId}/wait-time`, {
      method: 'PUT',
      body: JSON.stringify({ waitTime, status }),
    });
  }

  // Doctor APIs
  async getDoctors(): Promise<any[]> {
    return this.makeRequest<any[]>('/doctors', {}, true);
  }

  async updateDoctorLocation(doctorId: string, location: string, estimatedArrival?: string): Promise<any> {
    return this.makeRequest(`/doctors/${doctorId}/location`, {
      method: 'PUT',
      body: JSON.stringify({ location, estimatedArrival }),
    });
  }

  // Queue Management APIs
  async getPatientQueue(): Promise<any[]> {
    return this.makeRequest<any[]>('/queue', {}, true);
  }

  async updateQueueStatus(patientId: string, status: string): Promise<any> {
    return this.makeRequest(`/queue/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();