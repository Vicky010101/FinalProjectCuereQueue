import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from './AuthContext';
import { ArrowLeft, User, Mail, Phone, Lock, UserPlus, LogIn, Loader2, Info, Wifi, WifiOff } from 'lucide-react';

interface AuthFormProps {
  onBack: () => void;
  defaultRole?: 'patient' | 'admin' | 'doctor';
  onSuccess?: () => void;
}

export function AuthForm({ onBack, defaultRole = 'patient', onSuccess }: AuthFormProps) {
  const { signIn, signUp, loading, isOfflineMode } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: defaultRole
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateSignIn = () => {
    const newErrors: Record<string, string> = {};
    
    if (!signInData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signInData.email)) newErrors.email = 'Email is invalid';
    
    if (!signInData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignUp = () => {
    const newErrors: Record<string, string> = {};
    
    if (!signUpData.name) newErrors.name = 'Name is required';
    if (!signUpData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signUpData.email)) newErrors.email = 'Email is invalid';
    
    if (!signUpData.password) newErrors.password = 'Password is required';
    else if (signUpData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!signUpData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (signUpData.password !== signUpData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Indian phone number validation
    if (signUpData.phone) {
      // Remove all spaces and formatting
      const cleanPhone = signUpData.phone.replace(/\s+/g, '');
      
      // Check for Indian phone number format: +91 followed by 10 digits or just 10 digits
      if (!/^(\+91)?[6-9]\d{9}$/.test(cleanPhone)) {
        newErrors.phone = 'Please enter a valid Indian phone number (+91 XXXXX XXXXX)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignIn()) return;
    
    const success = await signIn(signInData.email, signInData.password);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUp()) return;
    
    // Format phone number for storage
    let formattedPhone = signUpData.phone;
    if (formattedPhone) {
      const cleanPhone = formattedPhone.replace(/\s+/g, '');
      if (cleanPhone.startsWith('+91')) {
        // Already has country code
        formattedPhone = cleanPhone.replace(/(\+91)(\d{5})(\d{5})/, '$1 $2 $3');
      } else if (cleanPhone.length === 10) {
        // Add country code and format
        formattedPhone = `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
      }
    }
    
    const success = await signUp(
      signUpData.email,
      signUpData.password,
      signUpData.name,
      signUpData.role as 'patient' | 'admin' | 'doctor',
      formattedPhone || undefined
    );
    
    if (success && onSuccess) {
      onSuccess();
    }
  };

  const handleDemoFill = (role: 'patient' | 'admin' | 'doctor') => {
    const demoCredentials = {
      patient: { email: 'patient@demo.com', password: 'demo123' },
      admin: { email: 'admin@demo.com', password: 'demo123' },
      doctor: { email: 'doctor@demo.com', password: 'demo123' }
    };
    
    setSignInData(demoCredentials[role]);
    setActiveTab('signin');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove all non-digits except + at the start
    value = value.replace(/[^\d+]/g, '');
    
    // If user starts typing without +91, add it
    if (value.length > 0 && !value.startsWith('+91')) {
      if (value.length <= 10) {
        // Format as user types: +91 XXXXX XXXXX
        if (value.length <= 5) {
          value = `+91 ${value}`;
        } else {
          value = `+91 ${value.slice(0, 5)} ${value.slice(5, 10)}`;
        }
      }
    } else if (value.startsWith('+91')) {
      // Format existing +91 number
      const digits = value.slice(3); // Remove +91
      if (digits.length <= 5) {
        value = `+91 ${digits}`;
      } else {
        value = `+91 ${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
      }
    }
    
    setSignUpData({ ...signUpData, phone: value });
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'patient': return 'Patient';
      case 'admin': return 'Administrator';
      case 'doctor': return 'Doctor';
      default: return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl text-gray-900">Welcome to CureQueue</h1>
              {isOfflineMode && <WifiOff className="w-5 h-5 text-amber-500" />}
            </div>
            <p className="text-gray-600">{getRoleName(defaultRole)} Portal</p>
          </div>
        </div>

        {/* Demo mode alert */}
        {isOfflineMode && (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <div className="font-medium mb-2">Demo Mode Active</div>
              <div className="text-sm space-y-1">
                <p>Backend services are unavailable. Use these demo credentials:</p>
                <div className="space-y-1 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span>Patient: patient@demo.com / demo123</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDemoFill('patient')}
                      className="h-6 px-2 text-xs"
                    >
                      Fill
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Admin: admin@demo.com / demo123</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDemoFill('admin')}
                      className="h-6 px-2 text-xs"
                    >
                      Fill
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Doctor: doctor@demo.com / demo123</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDemoFill('doctor')}
                      className="h-6 px-2 text-xs"
                    >
                      Fill
                    </Button>
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Sign In Tab */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    />
                  </div>
                  {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                    />
                  </div>
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="signup-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="signup-phone">Phone Number (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="pl-10"
                      value={signUpData.phone}
                      onChange={handlePhoneChange}
                      maxLength={17} // +91 XXXXX XXXXX = 17 characters
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                  <p className="text-xs text-gray-500 mt-1">Enter Indian mobile number with or without +91</p>
                </div>

                <div>
                  <Label htmlFor="signup-role">Account Type</Label>
                  <Select 
                    value={signUpData.role} 
                    onValueChange={(value) => setSignUpData({ ...signUpData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient - Book appointments & manage health</SelectItem>
                      <SelectItem value="doctor">Doctor - Manage patients & appointments</SelectItem>
                      <SelectItem value="admin">Administrator - Full system access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password (min. 6 characters)"
                      className="pl-10"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    />
                  </div>
                  {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                </div>

                <div>
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              {isOfflineMode ? (
                'Demo mode: Your data will be saved locally until the backend is available.'
              ) : (
                'By creating an account, you agree to our Terms of Service and Privacy Policy. Your health information is encrypted and secure.'
              )}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}