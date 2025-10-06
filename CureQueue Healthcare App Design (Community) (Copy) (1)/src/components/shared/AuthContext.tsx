import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseService, AuthUser } from '../../utils/supabase/supabase-service';
import { toast } from 'sonner@2.0.3';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isOfflineMode: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string, role: 'patient' | 'admin' | 'doctor', phone?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  loginAsDemo: (role: 'patient' | 'admin' | 'doctor') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user data for offline mode with Indian names and phone numbers
const DEMO_USERS = {
  patient: {
    id: 'demo-patient-1',
    email: 'patient@demo.com',
    name: 'Arjun Singh',
    role: 'patient' as const,
    phone: '+91 98765 43210'
  },
  admin: {
    id: 'demo-admin-1',
    email: 'admin@demo.com',
    name: 'Dr. Aditi Sharma (Administrator)',
    role: 'admin' as const,
    phone: '+91 87654 32109'
  },
  doctor: {
    id: 'demo-doctor-1',
    email: 'doctor@demo.com',
    name: 'Dr. Vikram Patel',
    role: 'doctor' as const,
    phone: '+91 76543 21098'
  }
};

// Check if backend is likely available (simple connectivity test)
const isBackendLikelyAvailable = async (): Promise<boolean> => {
  try {
    // Quick connectivity test - don't wait too long
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
    
    const response = await fetch('https://httpbin.org/status/200', {
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(true); // Start in offline mode by default

  // Check for existing session on mount - prioritize local storage
  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      setLoading(true);
      
      // First, check for demo session in localStorage
      const demoSession = localStorage.getItem('curequeue_demo_user');
      if (demoSession) {
        try {
          const demoUser = JSON.parse(demoSession);
          setUser(demoUser);
          setIsOfflineMode(true);
          console.log('Restored demo session from localStorage');
          return;
        } catch (e) {
          localStorage.removeItem('curequeue_demo_user');
        }
      }

      // Only try API if backend might be available
      const backendAvailable = await isBackendLikelyAvailable();
      if (!backendAvailable) {
        console.log('Backend appears to be unavailable, staying in offline mode');
        setIsOfflineMode(true);
        return;
      }

      // Try to get current user from API
      try {
        const currentUser = await supabaseService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsOfflineMode(false);
          console.log('Successfully authenticated with backend');
        } else {
          setIsOfflineMode(true);
        }
      } catch (error: any) {
        // Silently handle API errors - expected when backend is not ready
        console.log('Auth API not available, using offline mode');
        setIsOfflineMode(true);
      }
      
    } catch (error) {
      console.log('Authentication check failed, using offline mode');
      setIsOfflineMode(true);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Check for demo credentials first
      if (email === 'patient@demo.com' && password === 'demo123') {
        setUser(DEMO_USERS.patient);
        setIsOfflineMode(true);
        localStorage.setItem('curequeue_demo_user', JSON.stringify(DEMO_USERS.patient));
        toast.success(`Welcome to demo mode, ${DEMO_USERS.patient.name}!`);
        return true;
      } else if (email === 'admin@demo.com' && password === 'demo123') {
        setUser(DEMO_USERS.admin);
        setIsOfflineMode(true);
        localStorage.setItem('curequeue_demo_user', JSON.stringify(DEMO_USERS.admin));
        toast.success(`Welcome to demo mode, ${DEMO_USERS.admin.name}!`);
        return true;
      } else if (email === 'doctor@demo.com' && password === 'demo123') {
        setUser(DEMO_USERS.doctor);
        setIsOfflineMode(true);
        localStorage.setItem('curequeue_demo_user', JSON.stringify(DEMO_USERS.doctor));
        toast.success(`Welcome to demo mode, ${DEMO_USERS.doctor.name}!`);
        return true;
      }

      // Try real authentication only if backend might be available
      const backendAvailable = await isBackendLikelyAvailable();
      if (backendAvailable) {
        try {
          const result = await supabaseService.signIn(email, password);
          setUser(result.user);
          setIsOfflineMode(false);
          toast.success(`Welcome back, ${result.user.name}!`);
          
          // Clear any demo session
          localStorage.removeItem('curequeue_demo_user');
          return true;
        } catch (error: any) {
          console.log('Real authentication failed:', error.message);
          // Fall through to suggest demo credentials
        }
      }
      
      // Suggest demo credentials
      toast.error(
        'Authentication service unavailable. Try demo credentials:\n' +
        'Patient: patient@demo.com / demo123\n' +
        'Admin: admin@demo.com / demo123\n' +
        'Doctor: doctor@demo.com / demo123'
      );
      
      return false;
    } catch (error: any) {
      console.log('Sign in error:', error);
      toast.error('Sign in failed. Please try demo credentials or check your connection.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    name: string, 
    role: 'patient' | 'admin' | 'doctor',
    phone?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Check if backend is available for real signup
      const backendAvailable = await isBackendLikelyAvailable();
      if (backendAvailable) {
        try {
          // Try real sign up
          const newUser = await supabaseService.signUp(email, password, name, role, phone);
          
          // Automatically sign in after successful registration
          const signInResult = await supabaseService.signIn(email, password);
          setUser(signInResult.user);
          setIsOfflineMode(false);
          
          toast.success(`Account created successfully! Welcome, ${newUser.name}!`);
          
          // Clear any demo session
          localStorage.removeItem('curequeue_demo_user');
          return true;
        } catch (error: any) {
          console.log('Real sign up failed:', error.message);
          // Fall through to create demo account
        }
      }
      
      // Create a demo user for offline mode
      const demoUser: AuthUser = {
        id: `demo-${role}-${Date.now()}`,
        email,
        name,
        role,
        phone: phone || `+91 ${Math.floor(Math.random() * 90000) + 10000} ${Math.floor(Math.random() * 90000) + 10000}`
      };
      
      setUser(demoUser);
      setIsOfflineMode(true);
      localStorage.setItem('curequeue_demo_user', JSON.stringify(demoUser));
      
      toast.success(
        `Welcome to CureQueue, ${name}! ` +
        `You're in demo mode - your data will be saved locally.`
      );
      
      return true;
    } catch (error: any) {
      console.log('Sign up error:', error);
      toast.error('Failed to create account. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Only try API sign out if not in offline mode
      if (!isOfflineMode) {
        try {
          await supabaseService.signOut();
        } catch (error) {
          console.log('API sign out failed (expected in offline mode)');
        }
      }
      
      setUser(null);
      setIsOfflineMode(true); // Reset to offline mode after signout
      localStorage.removeItem('curequeue_demo_user');
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.log('Sign out error:', error);
      
      // Force logout locally
      setUser(null);
      setIsOfflineMode(true);
      localStorage.removeItem('curequeue_demo_user');
      toast.success('Signed out locally');
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = (role: 'patient' | 'admin' | 'doctor') => {
    const demoUser = DEMO_USERS[role];
    setUser(demoUser);
    setIsOfflineMode(true);
    localStorage.setItem('curequeue_demo_user', JSON.stringify(demoUser));
    toast.success(`Welcome to demo mode, ${demoUser.name}!`);
  };

  const value: AuthContextType = {
    user,
    loading,
    isOfflineMode,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    loginAsDemo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}