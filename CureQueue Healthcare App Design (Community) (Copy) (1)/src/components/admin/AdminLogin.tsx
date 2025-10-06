import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Shield, 
  Stethoscope, 
  User, 
  Lock, 
  Eye, 
  EyeOff,
  Building
} from 'lucide-react';

interface AdminLoginProps {
  onLogin: (role: 'admin' | 'doctor', userData: any) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'doctor' | ''>('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    hospital: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hospitals = [
    'City General Hospital',
    'Medicare Clinic', 
    'Health Plus Center',
    'CardioCare Clinic',
    'Central Medical Center'
  ];

  const handleLogin = async () => {
    if (!selectedRole || !credentials.email || !credentials.password) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const userData = {
        name: selectedRole === 'admin' ? 'Admin User' : 'Dr. Sarah Johnson',
        email: credentials.email,
        hospital: credentials.hospital || 'City General Hospital',
        role: selectedRole,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      onLogin(selectedRole, userData);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl mb-2 text-gray-900">Healthcare Provider Login</h2>
          <p className="text-gray-600">Access your dashboard and manage patient care</p>
        </div>

        <Card className="p-6 space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Select Your Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedRole === 'admin'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <div>Administrator</div>
                <div className="text-xs opacity-75">Manage system</div>
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedRole('doctor')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedRole === 'doctor'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Stethoscope className="w-8 h-8 mx-auto mb-2" />
                <div>Doctor</div>
                <div className="text-xs opacity-75">Patient care</div>
              </button>
            </div>
          </div>

          {/* Hospital Selection */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Hospital/Clinic</label>
            <Select value={credentials.hospital} onValueChange={(value) => setCredentials({...credentials, hospital: value})}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <SelectValue placeholder="Select your hospital..." />
                </div>
              </SelectTrigger>
              <SelectContent>
                {hospitals.map((hospital) => (
                  <SelectItem key={hospital} value={hospital}>
                    {hospital}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Enter your email..."
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="pl-10"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password..."
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="text-sm text-blue-900 mb-2">Demo Credentials</h4>
            <div className="text-xs text-blue-800 space-y-1">
              <div><strong>Admin:</strong> admin@hospital.com / admin123</div>
              <div><strong>Doctor:</strong> doctor@hospital.com / doctor123</div>
            </div>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={!selectedRole || !credentials.email || !credentials.password || isLoading}
            className="w-full bg-green-600 hover:bg-green-700 h-12"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </div>
            ) : (
              'Login to Dashboard'
            )}
          </Button>

          {/* Additional Links */}
          <div className="text-center space-y-2">
            <button className="text-sm text-blue-600 hover:text-blue-700">
              Forgot Password?
            </button>
            <div className="text-sm text-gray-500">
              Need access? Contact your IT administrator
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}