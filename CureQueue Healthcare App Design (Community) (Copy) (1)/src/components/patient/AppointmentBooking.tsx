import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useAppData } from '../shared/AppDataStore';
import { useAuth } from '../shared/AuthContext';
import { toast } from 'sonner@2.0.3';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Stethoscope,
  MapPin,
  Star,
  CheckCircle,
  AlertCircle,
  IndianRupee
} from 'lucide-react';

export function AppointmentBooking() {
  const { doctors, appointments, addAppointment } = useAppData();
  const { user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    patientPhone: user?.phone || '',
    symptoms: '',
    notes: ''
  });

  // Filter appointments for current user (if authenticated)
  const userAppointments = user 
    ? appointments.filter(apt => apt.userId === user.id || apt.patientPhone === user.phone)
    : appointments.slice(0, 3);

  const availableTimes = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM', '06:00 PM'
  ];

  const validateForm = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !formData.patientName || !formData.patientPhone) {
      toast.error('Please fill in all required fields');
      return false;
    }

    // Validate Indian phone number
    const cleanPhone = formData.patientPhone.replace(/\s+/g, '');
    if (!/^(\+91)?[6-9]\d{9}$/.test(cleanPhone)) {
      toast.error('Please enter a valid Indian phone number');
      return false;
    }

    return true;
  };

  const formatPhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.startsWith('+91')) {
      return cleanPhone.replace(/(\+91)(\d{5})(\d{5})/, '$1 $2 $3');
    } else if (cleanPhone.length === 10) {
      return `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
    }
    return phone;
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
    
    setFormData({ ...formData, patientPhone: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const doctor = doctors.find(d => d.id === selectedDoctor);
    if (!doctor) {
      toast.error('Selected doctor not found');
      return;
    }

    try {
      await addAppointment({
        patientName: formData.patientName,
        patientPhone: formatPhoneNumber(formData.patientPhone),
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        hospital: doctor.hospital,
        date: format(selectedDate!, 'yyyy-MM-dd'),
        time: selectedTime,
        symptoms: formData.symptoms,
        notes: formData.notes
      });

      // Reset form
      setSelectedDoctor('');
      setSelectedDate(undefined);
      setSelectedTime('');
      setFormData({
        patientName: user?.name || '',
        patientPhone: user?.phone || '',
        symptoms: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  const getStatusColor = (status: string) => {
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

  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <h2 className="text-2xl mb-2 text-gray-900">Book Appointment</h2>
        <p className="text-gray-600">Schedule your consultation with our healthcare professionals</p>
      </div>

      {/* Booking Form */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Schedule New Appointment</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <h4 className="text-gray-800">Patient Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  placeholder="Enter patient name"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="patientPhone">Phone Number *</Label>
                <Input
                  id="patientPhone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.patientPhone}
                  onChange={handlePhoneChange}
                  maxLength={17}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Enter Indian mobile number</p>
              </div>
            </div>
          </div>

          {/* Doctor Selection */}
          <div className="space-y-4">
            <h4 className="text-gray-800">Select Doctor</h4>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    <div className="flex items-center gap-2">
                      <span>{doctor.name} - {doctor.specialty}</span>
                      <span className="text-sm text-gray-500">({doctor.hospital})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedDoctorData && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-blue-900">{selectedDoctorData.name}</h5>
                    <p className="text-sm text-blue-700">{selectedDoctorData.specialty}</p>
                    <div className="flex items-center gap-4 text-sm text-blue-600 mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedDoctorData.hospital}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{selectedDoctorData.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-900 flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      <span>{selectedDoctorData.consultationFee.replace('₹', '')}</span>
                    </div>
                    <div className="text-sm text-blue-600">{selectedDoctorData.experience} exp</div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Date and Time Selection */}
          <div className="space-y-4">
            <h4 className="text-gray-800">Select Date & Time</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Appointment Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left ${!selectedDate && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Appointment Time *</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose time" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h4 className="text-gray-800">Additional Information</h4>
            <div>
              <Label htmlFor="symptoms">Symptoms/Reason for Visit</Label>
              <Textarea
                id="symptoms"
                placeholder="Please describe your symptoms or reason for the appointment"
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                className="min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special requests or additional information"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="min-h-20"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </form>
      </Card>

      {/* User's Appointments */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Your Appointments</h3>
        <div className="space-y-4">
          {userAppointments.length > 0 ? (
            userAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-gray-900">{appointment.doctorName}</h4>
                    <p className="text-sm text-blue-600">{appointment.specialty}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{appointment.hospital}</span>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{appointment.patientPhone}</span>
                  </div>
                </div>

                {appointment.symptoms && (
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Reason:</strong> {appointment.symptoms}
                  </p>
                )}

                {appointment.status === 'Confirmed' && appointment.waitTime && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirmed - Estimated wait time: {appointment.waitTime}</span>
                    </div>
                  </div>
                )}

                {appointment.status === 'Pending' && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-700">
                      <AlertCircle className="w-4 h-4" />
                      <span>Pending approval - You'll receive confirmation shortly</span>
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-500 mt-2">
                  Booked: {appointment.bookingTime}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No appointments booked yet</p>
              <p className="text-sm">Book your first appointment above</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}