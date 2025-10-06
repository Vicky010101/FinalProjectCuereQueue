import React, { useState } from 'react';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { ArrowLeft } from 'lucide-react';

interface AdminInterfaceProps {
  onBack: () => void;
}

type UserRole = 'admin' | 'doctor' | null;

export function AdminInterface({ onBack }: AdminInterfaceProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userData, setUserData] = useState<any>(null);

  const handleLogin = (role: UserRole, data: any) => {
    setUserRole(role);
    setUserData(data);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserData(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl text-gray-900 ml-4">Healthcare Provider Portal</h1>
        </header>
        <AdminLogin onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard 
        userRole={userRole!} 
        userData={userData} 
        onLogout={handleLogout}
        onBack={onBack}
      />
    </div>
  );
}