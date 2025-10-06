import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useAppData } from '../shared/AppDataStore';
import { useAuth } from '../shared/AuthContext';
import { toast } from 'sonner@2.0.3';
import {
  Home,
  Phone,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Stethoscope,
  Navigation,
  IndianRupee
} from 'lucide-react';

export function HomeVisit() {
  const { homeVisitRequests, addHomeVisitRequest, doctors } = useAppData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    patientPhone: user?.phone || '',
    address: '',
    urgency: 'Medium' as 'Low' | 'Medium' | 'High',
    symptoms: '',
    preferredTime: '',
    notes: ''
  });

  // Filter home visit requests for current user (if authenticated)
  const userHomeVisits = user 
    ? homeVisitRequests.filter(req => req.userId === user.id || req.patientPhone === user.phone)
    : homeVisitRequests.slice(0, 3);

  const timeSlots = [
    'Today 9:00 AM - 12:00 PM',
    'Today 12:00 PM - 3:00 PM', 
    'Today 3:00 PM - 6:00 PM',
    'Today 6:00 PM - 9:00 PM',
    'Tomorrow 9:00 AM - 12:00 PM',
    'Tomorrow 12:00 PM - 3:00 PM',
    'Tomorrow 3:00 PM - 6:00 PM',
    'Tomorrow 6:00 PM - 9:00 PM'
  ];

  const validateForm = () => {
    if (!formData.patientName || !formData.patientPhone || !formData.address || !formData.symptoms || !formData.preferredTime) {
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

    try {
      await addHomeVisitRequest({
        patientName: formData.patientName,
        patientPhone: formatPhoneNumber(formData.patientPhone),
        address: formData.address,
        urgency: formData.urgency,
        symptoms: formData.symptoms,
        preferredTime: formData.preferredTime,
        notes: formData.notes
      });

      // Reset form
      setFormData({
        patientName: user?.name || '',
        patientPhone: user?.phone || '',
        address: '',
        urgency: 'Medium',
        symptoms: '',
        preferredTime: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error requesting home visit:', error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Accepted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'In Transit':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <h2 className="text-2xl mb-2 text-gray-900">Request Home Visit</h2>
        <p className="text-gray-600">Get healthcare services at your home with qualified doctors</p>
      </div>

      {/* Request Form */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Schedule Home Visit</h3>
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

          {/* Address */}
          <div>
            <Label htmlFor="address">Complete Address *</Label>
            <Textarea
              id="address"
              placeholder="Enter complete address with landmarks, pin code"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="min-h-20"
              required
            />
          </div>

          {/* Urgency and Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Urgency Level *</Label>
              <Select 
                value={formData.urgency} 
                onValueChange={(value) => setFormData({ ...formData, urgency: value as 'Low' | 'Medium' | 'High' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low - General consultation</SelectItem>
                  <SelectItem value="Medium">Medium - Moderate symptoms</SelectItem>
                  <SelectItem value="High">High - Urgent care needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Preferred Time *</Label>
              <Select 
                value={formData.preferredTime} 
                onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose preferred time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <Label htmlFor="symptoms">Symptoms/Health Concern *</Label>
            <Textarea
              id="symptoms"
              placeholder="Please describe the symptoms or health concerns"
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              className="min-h-24"
              required
            />
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions or additional information"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="min-h-20"
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            <Home className="w-4 h-4 mr-2" />
            Request Home Visit
          </Button>
        </form>
      </Card>

      {/* Service Information */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-blue-900 mb-4">Home Visit Service</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4" />
            <span><strong>Consultation Fee:</strong> ₹500 - ₹1200 (varies by doctor and urgency)</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span><strong>Response Time:</strong> 30 minutes to 2 hours based on urgency</span>
          </div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            <span><strong>Services:</strong> General consultation, basic diagnostics, prescription</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span><strong>Coverage:</strong> Delhi NCR, Mumbai, Bangalore, Hyderabad, Pune</span>
          </div>
        </div>
      </Card>

      {/* User's Home Visit Requests */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Your Home Visit Requests</h3>
        <div className="space-y-4">
          {userHomeVisits.length > 0 ? (
            userHomeVisits.map((request) => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-gray-900">{request.patientName}</h4>
                    <p className="text-sm text-gray-600">{request.address}</p>
                    <p className="text-sm text-gray-500">Requested: {request.preferredTime}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency} Priority
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(request.status)}`}>
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
                  <div className="bg-blue-50 p-3 rounded-lg mb-3 border border-blue-200">
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
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 text-yellow-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Request pending - Looking for available doctor</span>
                    </div>
                  </div>
                )}

                {request.status === 'Accepted' && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span>Request accepted - Doctor will arrive soon</span>
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-500 mt-2">
                  Requested: {request.requestTime}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Home className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No home visit requests yet</p>
              <p className="text-sm">Request your first home visit above</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}