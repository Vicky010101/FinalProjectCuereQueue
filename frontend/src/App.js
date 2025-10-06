import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PatientDashboard from "./pages/PatientDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import React from "react";
import HospitalSearch from "./components/HospitalSearch";
import AppointmentBookingForm from "./components/AppointmentBookingForm";
import ReviewsSection from "./components/ReviewsSection";
import Profile from "./pages/Profile";
import Appointments from "./pages/Appointments";
import Settings from "./pages/Settings";
import MapView from "./pages/MapView";
function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <div className="flex-1 w-full">
          <div className="relative">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className={`main-shift ${sidebarOpen ? 'sidebar-open' : ''}`}>
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute roles={["patient", "doctor", "admin"]} />}> 
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>
                <Route path="/search" element={<HospitalSearch />} />
                <Route path="/reviews" element={<ReviewsSection />} />
                <Route element={<ProtectedRoute roles={["patient"]} />}> 
                  <Route path="/book" element={<AppointmentBookingForm />} />
                </Route>
                <Route element={<ProtectedRoute roles={["patient", "doctor", "admin"]} />}> 
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                <Route element={<ProtectedRoute roles={["patient"]} />}> 
                  <Route path="/patient-dashboard" element={<PatientDashboard />} />
                  <Route path="/map" element={<MapView />} />
                </Route>
                <Route element={<ProtectedRoute roles={["doctor"]} />}> 
                  <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                </Route>
                <Route element={<ProtectedRoute roles={["admin"]} />}> 
                  <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                </Route>
              </Routes>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
