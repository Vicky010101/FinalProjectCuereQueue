import React, { useState } from "react";
import { PatientInterface } from "./components/PatientInterface";
import { AdminInterface } from "./components/AdminInterface";
import {
  AppDataProvider,
  useAppData,
} from "./components/shared/AppDataStore";
import {
  AuthProvider,
  useAuth,
} from "./components/shared/AuthContext";
import { AuthForm } from "./components/shared/AuthForm";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Alert, AlertDescription } from "./components/ui/alert";
import {
  Stethoscope,
  Users,
  LogOut,
  User,
  Shield,
  Wifi,
  WifiOff,
  RefreshCw,
  Info,
  AlertTriangle,
} from "lucide-react";

function ConnectionStatus() {
  const { isOfflineMode, lastSyncTime, retryConnection } =
    useAppData();
  const { isOfflineMode: authOffline } = useAuth();

  if (!isOfflineMode && !authOffline) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <Wifi className="w-3 h-3 mr-1" />
          Online
          {lastSyncTime && (
            <span className="ml-1 text-xs opacity-75">
              • Synced {lastSyncTime}
            </span>
          )}
        </Badge>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Alert className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Demo Mode</div>
              <div className="text-xs mt-1">
                Backend services unavailable
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={retryConnection}
              className="ml-2 h-6 px-2 text-xs"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

function DemoModeHelper() {
  const { isOfflineMode } = useAuth();

  if (!isOfflineMode) return null;

  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <div className="font-medium mb-1">Demo Mode Active</div>
        <div className="text-sm">
          Try these demo credentials:
        </div>
        <div className="text-xs mt-2 space-y-1 font-mono">
          <div>
            <strong>Patient:</strong> patient@demo.com / demo123
          </div>
          <div>
            <strong>Admin:</strong> admin@demo.com / demo123
          </div>
          <div>
            <strong>Doctor:</strong> doctor@demo.com / demo123
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}

function AppContent() {
  const {
    user,
    isAuthenticated,
    signOut,
    loading,
    loginAsDemo,
    isOfflineMode: authOffline,
  } = useAuth();
  const [userType, setUserType] = useState<
    "patient" | "admin" | null
  >(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authRole, setAuthRole] = useState<
    "patient" | "admin" | "doctor"
  >("patient");

  // If authenticated, determine interface based on user role
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin" || user.role === "doctor") {
        setUserType("admin");
      } else {
        setUserType("patient");
      }
      setShowAuth(false);
    }
  }, [isAuthenticated, user]);

  const handleUserTypeSelect = (type: "patient" | "admin") => {
    setUserType(type);

    if (isAuthenticated) {
      // User is already authenticated, go directly to interface
      return;
    }

    // Not authenticated, show auth form
    setAuthRole(type === "admin" ? "admin" : "patient");
    setShowAuth(true);
  };

  const handleQuickDemo = (
    role: "patient" | "admin" | "doctor",
  ) => {
    loginAsDemo(role);
    setUserType(role === "patient" ? "patient" : "admin");
    setShowAuth(false);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    // userType will be set by useEffect when user is authenticated
  };

  const handleSignOut = async () => {
    await signOut();
    setUserType(null);
    setShowAuth(false);
  };

  const handleBack = () => {
    if (showAuth) {
      setShowAuth(false);
      setUserType(null);
    } else {
      setUserType(null);
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 animate-pulse">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl text-gray-900 mb-2">
            CureQueue
          </h1>
          <p className="text-gray-600">
            Loading your healthcare companion...
          </p>
        </div>
      </div>
    );
  }

  // Show authentication form
  if (showAuth) {
    return (
      <div>
        <ConnectionStatus />
        <AuthForm
          onBack={handleBack}
          defaultRole={authRole}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  // Show user type selection or authenticated interface
  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <ConnectionStatus />

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl mb-2 text-gray-900">
              CureQueue
            </h1>
            <p className="text-gray-600">
              Your smart healthcare companion
            </p>
          </div>

          {/* Demo mode helper */}
          <DemoModeHelper />

          {/* Authentication status */}
          {isAuthenticated && user && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      user.role === "admin" ||
                      user.role === "doctor"
                        ? "bg-green-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {user.role === "admin" ? (
                      <Shield className="w-5 h-5 text-green-600" />
                    ) : user.role === "doctor" ? (
                      <Stethoscope className="w-5 h-5 text-green-600" />
                    ) : (
                      <User className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 font-medium">
                        {user.name}
                      </p>
                      {authOffline && (
                        <Badge
                          variant="outline"
                          className="text-xs text-amber-600"
                        >
                          Demo
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {user.role === "admin"
                        ? "Administrator"
                        : user.role === "doctor"
                          ? "Healthcare Provider"
                          : "Patient"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Interface selection */}
          <div className="space-y-4">
            <Button
              onClick={() => handleUserTypeSelect("patient")}
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-3"
            >
              <Users className="w-6 h-6" />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span>I'm a Patient</span>
                  {isAuthenticated &&
                    user?.role === "patient" && (
                      <Badge
                        variant="secondary"
                        className="text-xs"
                      >
                        Signed In
                      </Badge>
                    )}
                </div>
                <div className="text-sm opacity-90">
                  Find doctors & book appointments
                </div>
              </div>
            </Button>

            <Button
              onClick={() => handleUserTypeSelect("admin")}
              className="w-full h-16 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center gap-3"
            >
              <Stethoscope className="w-6 h-6" />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span>Healthcare Provider</span>
                  {isAuthenticated &&
                    (user?.role === "admin" ||
                      user?.role === "doctor") && (
                      <Badge
                        variant="secondary"
                        className="text-xs"
                      >
                        Signed In
                      </Badge>
                    )}
                </div>
                <div className="text-sm opacity-90">
                  Manage patients & appointments
                </div>
              </div>
            </Button>
          </div>

          {/* Quick demo access */}
          {!isAuthenticated && authOffline && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3 text-center">
                Quick Demo Access:
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDemo("patient")}
                  className="flex-1 text-xs"
                >
                  <User className="w-3 h-3 mr-1" />
                  Patient Demo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDemo("admin")}
                  className="flex-1 text-xs"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Admin Demo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDemo("doctor")}
                  className="flex-1 text-xs"
                >
                  <Stethoscope className="w-3 h-3 mr-1" />
                  Doctor Demo
                </Button>
              </div>
            </div>
          )}

          {/* Additional info */}
          {!isAuthenticated && !authOffline && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New to CureQueue? You'll be able to create an
                account on the next step.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show the selected interface
  return (
    <div className="min-h-screen bg-gray-50">
      <ConnectionStatus />
      {userType === "patient" ? (
        <PatientInterface onBack={handleBack} />
      ) : (
        <AdminInterface onBack={handleBack} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <AppContent />
      </AppDataProvider>
    </AuthProvider>
  );
}