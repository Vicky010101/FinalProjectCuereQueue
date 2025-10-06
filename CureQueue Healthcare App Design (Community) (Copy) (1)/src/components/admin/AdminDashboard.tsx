import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useAppData } from '../shared/AppDataStore';
import {
  Users,
  Clock,
  Calendar,
  AlertTriangle,
  MapPin,
  Phone,
  User,
  Stethoscope,
  Home,
  CheckCircle,
  XCircle,
  Navigation,
  Timer,
  Activity,
  Settings,
  Eye,
  ArrowLeft,
  LogOut,
  Shield,
  FileText,
  Plus
} from 'lucide-react';

interface AdminDashboardProps {
  userRole: 'admin' | 'doctor';
  userData: any;
  onLogout: () => void;
  onBack: () => void;
}

export function AdminDashboard({ userRole, userData, onLogout, onBack }: AdminDashboardProps) {
  const {
    hospitals,
    updateHospitalWaitTime,
    doctors,
    updateDoctorLocation,
    homeVisitRequests,
    updateHomeVisitStatus,
    appointments,
    updateAppointmentWaitTime,
    updateAppointmentStatus,
    queuePatients,
    updateQueueStatus
  } = useAppData();

  const [selectedHospital, setSelectedHospital] = useState<string>('');
  const [newWaitTime, setNewWaitTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [doctorLocation, setDoctorLocation] = useState<string>('');
  const [estimatedArrival, setEstimatedArrival] = useState<string>('');

  // Stats calculations
  const totalPatients = queuePatients.length;
  const waitingPatients = queuePatients.filter(p => p.status === 'Waiting').length;
  const inConsultation = queuePatients.filter(p => p.status === 'In Consultation').length;
  const pendingHomeVisits = homeVisitRequests.filter(r => r.status === 'Pending').length;
  const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;
  const totalAppointments = appointments.length;

  const handleUpdateWaitTime = () => {
    if (selectedHospital && newWaitTime) {
      const waitTimeNum = parseInt(newWaitTime);
      let status: 'Low wait' | 'Moderate wait' | 'High wait' = 'Low wait';
      
      if (waitTimeNum > 30) status = 'High wait';
      else if (waitTimeNum > 15) status = 'Moderate wait';
      
      updateHospitalWaitTime(selectedHospital, `${newWaitTime} min`, status);
      setSelectedHospital('');
      setNewWaitTime('');
    }
  };

  const handleAcceptHomeVisit = (requestId: string) => {
    const availableDoctor = doctors.find(d => d.isAvailable);
    if (availableDoctor) {
      updateHomeVisitStatus(requestId, 'Accepted', availableDoctor, '30 minutes');
    }
  };

  const handleAssignAppointmentWaitTime = (appointmentId: string, waitTime: string) => {
    updateAppointmentWaitTime(appointmentId, waitTime);
    updateAppointmentStatus(appointmentId, 'Confirmed');
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                userRole === 'admin' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {userRole === 'admin' ? (
                  <Shield className={`w-5 h-5 ${userRole === 'admin' ? 'text-blue-600' : 'text-green-600'}`} />
                ) : (
                  <Stethoscope className={`w-5 h-5 ${userRole === 'admin' ? 'text-blue-600' : 'text-green-600'}`} />
                )}
              </div>
              <div>
                <h1 className="text-xl font-medium text-gray-900">
                  {userRole === 'admin' ? 'Admin Dashboard' : 'Doctor Dashboard'}
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {userData?.name || (userRole === 'admin' ? 'Administrator' : 'Doctor')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-green-600">
              <Activity className="w-4 h-4 mr-1" />
              Live Updates Active
            </Badge>
            <div className="h-6 w-px bg-gray-300"></div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Role-specific welcome message */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
          <div className="flex items-center gap-3 mb-2">
            {userRole === 'admin' ? (
              <Shield className="w-6 h-6 text-blue-600" />
            ) : (
              <Stethoscope className="w-6 h-6 text-green-600" />
            )}
            <h2 className="text-lg font-medium text-gray-900">
              {userRole === 'admin' ? 'Hospital Administration Center' : 'Medical Practice Dashboard'}
            </h2>
          </div>
          <p className="text-gray-600">
            {userRole === 'admin' 
              ? 'Manage hospital operations, patient flow, and healthcare staff coordination'
              : 'Track your patients, manage appointments, and coordinate medical care'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-xl text-gray-900">{totalPatients}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Waiting</p>
                <p className="text-xl text-gray-900">{waitingPatients}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Consultation</p>
                <p className="text-xl text-gray-900">{inConsultation}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Home Visits</p>
                <p className="text-xl text-gray-900">{pendingHomeVisits}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Hospital Wait Time Management - Show for admins only */}
        {userRole === 'admin' && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-900">Hospital Wait Time Management</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Update Wait Times */}
              <div className="space-y-4">
                <h4 className="text-gray-800">Update Wait Times</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Select Hospital</Label>
                    <Select value={selectedHospital} onValueChange={setSelectedHospital}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose hospital" />
                      </SelectTrigger>
                      <SelectContent>
                        {hospitals.map((hospital) => (
                          <SelectItem key={hospital.id} value={hospital.id}>
                            {hospital.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>New Wait Time (minutes)</Label>
                    <Input
                      type="number"
                      placeholder="Enter wait time in minutes"
                      value={newWaitTime}
                      onChange={(e) => setNewWaitTime(e.target.value)}
                    />
                  </div>
                  
                  <Button onClick={handleUpdateWaitTime} className="w-full">
                    <Timer className="w-4 h-4 mr-2" />
                    Update Wait Time
                  </Button>
                </div>
              </div>

              {/* Current Wait Times */}
              <div className="space-y-4">
                <h4 className="text-gray-800">Current Wait Times</h4>
                <div className="space-y-3">
                  {hospitals.map((hospital) => (
                    <div key={hospital.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-gray-900">{hospital.name}</p>
                        <p className="text-sm text-gray-600">{hospital.location}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm px-2 py-1 rounded-full ${
                          hospital.status === 'Low wait' 
                            ? 'bg-green-100 text-green-700' 
                            : hospital.status === 'Moderate wait'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {hospital.waitTime}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{hospital.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tabs for different sections */}
        <Tabs defaultValue="appointments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="appointments" className="relative">
              All Appointments ({totalAppointments})
              {pendingAppointments > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </TabsTrigger>
            <TabsTrigger value="homevisits">Home Visits ({pendingHomeVisits})</TabsTrigger>
            <TabsTrigger value="queue">Patient Queue ({totalPatients})</TabsTrigger>
            {userRole === 'admin' && (
              <TabsTrigger value="doctors">Doctor Tracking</TabsTrigger>
            )}
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-900">Appointment Management</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Total: {totalAppointments} | Pending: {pendingAppointments} | 
                    Confirmed: {appointments.filter(a => a.status === 'Confirmed').length}
                  </p>
                </div>
                <Badge variant="outline" className="text-blue-600">
                  <FileText className="w-4 h-4 mr-1" />
                  Live Updates
                </Badge>
              </div>

              <div className="space-y-4">
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                        appointment.status === 'Pending' ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-gray-900 font-medium">{appointment.patientName}</h4>
                          <p className="text-sm text-gray-600">{appointment.doctorName} - {appointment.specialty}</p>
                          <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getAppointmentStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </Badge>
                          {appointment.status === 'Pending' && (
                            <Badge variant="outline" className="text-xs text-orange-600">
                              Action Required
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{appointment.hospital}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{appointment.patientPhone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Booked: {appointment.bookingTime}</span>
                        </div>
                      </div>

                      {appointment.symptoms && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <p className="text-sm text-gray-700">
                            <strong>Symptoms/Reason:</strong> {appointment.symptoms}
                          </p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Notes:</strong> {appointment.notes}
                            </p>
                          )}
                        </div>
                      )}

                      {appointment.status === 'Pending' && (
                        <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <Input
                            placeholder="Set wait time (e.g., 15 min)"
                            className="w-40 bg-white"
                            onChange={(e) => {
                              const waitTime = e.target.value;
                              if (waitTime && waitTime.trim()) {
                                handleAssignAppointmentWaitTime(appointment.id, waitTime);
                              }
                            }}
                          />
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Confirm Appointment
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'Cancelled')}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      )}

                      {appointment.status === 'Confirmed' && appointment.waitTime && (
                        <div className="flex items-center gap-2 text-sm p-3 bg-green-50 rounded-lg border border-green-200">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span className="text-green-700">
                            ✓ Confirmed - Estimated wait time: {appointment.waitTime}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h4 className="text-gray-900 mb-2">No Appointments Yet</h4>
                    <p className="text-gray-600 mb-4">
                      New appointment requests from patients will appear here
                    </p>
                    <Badge variant="outline" className="text-blue-600">
                      <Activity className="w-4 h-4 mr-1" />
                      Waiting for patient bookings...
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Home Visits Tab */}
          <TabsContent value="homevisits">
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Home Visit Requests</h3>
              <div className="space-y-4">
                {homeVisitRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-gray-900">{request.patientName}</h4>
                        <p className="text-sm text-gray-600">{request.address}</p>
                        <p className="text-sm text-gray-500">Requested: {request.preferredTime}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          request.urgency === 'High' ? 'destructive' : 
                          request.urgency === 'Medium' ? 'default' : 'secondary'
                        }>
                          {request.urgency} Priority
                        </Badge>
                        <Badge variant={request.status === 'Accepted' ? 'default' : 'secondary'}>
                          {request.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Phone className="w-4 h-4" />
                      <span>{request.patientPhone}</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      <strong>Symptoms:</strong> {request.symptoms}
                    </p>

                    {request.assignedDoctor && (
                      <div className="bg-blue-50 p-3 rounded-lg mb-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <strong className="text-blue-900">{request.assignedDoctor.name}</strong>
                          <span className="text-blue-700">- {request.assignedDoctor.specialty}</span>
                        </div>
                        {request.estimatedArrival && (
                          <div className="flex items-center gap-2 mt-1">
                            <Navigation className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-700">ETA: {request.estimatedArrival}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {request.status === 'Pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAcceptHomeVisit(request.id)}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept & Assign Doctor
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateHomeVisitStatus(request.id, 'Cancelled')}>
                          <XCircle className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}

                    {request.status === 'Accepted' && (
                      <Button size="sm" variant="outline" onClick={() => updateHomeVisitStatus(request.id, 'In Transit')}>
                        <Navigation className="w-4 h-4 mr-1" />
                        Mark as In Transit
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Patient Queue Tab */}
          <TabsContent value="queue">
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Live Patient Queue</h3>
              <div className="space-y-3">
                {queuePatients.map((patient) => (
                  <div key={patient.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h4 className="text-gray-900">{patient.name}</h4>
                      <p className="text-sm text-gray-600">{patient.doctor} - {patient.appointmentTime}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        patient.urgency === 'High' ? 'destructive' : 
                        patient.urgency === 'Medium' ? 'default' : 'secondary'
                      }>
                        {patient.urgency}
                      </Badge>
                      <Badge variant={patient.status === 'Waiting' ? 'secondary' : 'default'}>
                        {patient.status}
                      </Badge>
                      <span className="text-sm text-gray-600">{patient.waitTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Doctor Tracking Tab - Admin only */}
          {userRole === 'admin' && (
            <TabsContent value="doctors">
              <Card className="p-6">
                <h3 className="text-gray-900 mb-4">Doctor Location Tracking</h3>
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <div key={doctor.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-gray-900">{doctor.name}</h4>
                          <p className="text-sm text-gray-600">{doctor.specialty} - {doctor.hospital}</p>
                        </div>
                        <Badge variant={doctor.isAvailable ? 'default' : 'secondary'}>
                          {doctor.isAvailable ? 'Available' : 'Busy'}
                        </Badge>
                      </div>

                      {doctor.currentLocation && (
                        <div className="bg-orange-50 p-3 rounded-lg mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-orange-600" />
                            <span className="text-orange-900">{doctor.currentLocation}</span>
                          </div>
                          {doctor.estimatedArrival && (
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-4 h-4 text-orange-600" />
                              <span className="text-orange-700">ETA: {doctor.estimatedArrival}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Input
                          placeholder="Update location..."
                          className="flex-1"
                          onChange={(e) => setDoctorLocation(e.target.value)}
                        />
                        <Input
                          placeholder="ETA (optional)"
                          className="w-32"
                          onChange={(e) => setEstimatedArrival(e.target.value)}
                        />
                        <Button size="sm" onClick={() => {
                          if (doctorLocation) {
                            updateDoctorLocation(doctor.id, doctorLocation, estimatedArrival || undefined);
                            setDoctorLocation('');
                            setEstimatedArrival('');
                          }
                        }}>
                          <Navigation className="w-4 h-4 mr-1" />
                          Update
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}