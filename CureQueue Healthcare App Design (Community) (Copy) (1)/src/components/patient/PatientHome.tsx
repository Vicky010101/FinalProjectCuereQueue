import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAppData } from '../shared/AppDataStore';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Calendar,
  UserCheck,
  Phone,
  Heart,
  Brain,
  Eye,
  Thermometer,
  User,
  Stethoscope,
  Activity
} from 'lucide-react';

export function PatientHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const { hospitals, doctors } = useAppData();

  const quickActions = [
    { icon: Calendar, label: 'Book Appointment', color: 'bg-blue-500' },
    { icon: UserCheck, label: 'Home Visit', color: 'bg-green-500' },
    { icon: Phone, label: 'Emergency', color: 'bg-red-500' },
    { icon: MapPin, label: 'Find Nearby', color: 'bg-purple-500' },
  ];

  const specialties = [
    { icon: Heart, label: 'Cardiology', available: doctors.filter(d => d.specialty === 'Cardiology').length },
    { icon: Brain, label: 'Neurology', available: doctors.filter(d => d.specialty === 'Neurology').length },
    { icon: Eye, label: 'Ophthalmology', available: doctors.filter(d => d.specialty === 'Ophthalmology').length },
    { icon: Thermometer, label: 'General Medicine', available: doctors.filter(d => d.specialty === 'General Medicine').length },
  ];

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show search results only if there's a search query
  const showSearchResults = searchQuery.length > 0;

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-4">
        <h2 className="text-2xl mb-2 text-gray-900">Welcome back, Sarah</h2>
        <p className="text-gray-600">Find the healthcare you need, when you need it</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search doctors, hospitals, or specialties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 rounded-xl border-gray-200 bg-white shadow-sm"
        />
      </div>

      {/* Search Results */}
      {showSearchResults && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-900">Search Results</h3>
            <span className="text-sm text-gray-500">{filteredDoctors.length} doctors found</span>
          </div>
          
          {filteredDoctors.length > 0 ? (
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="p-4 border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex gap-4">
                    {/* Doctor Avatar */}
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    
                    {/* Doctor Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-gray-900 font-medium">{doctor.name}</h4>
                          <p className="text-sm text-blue-600">{doctor.specialty}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-gray-700">{doctor.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{doctor.hospital} • {doctor.distance}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Stethoscope className="w-4 h-4" />
                          <span>{doctor.experience} exp</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{doctor.nextAvailable}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {doctor.consultationFee}
                          </Badge>
                          {doctor.isAvailable ? (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                              {doctor.currentLocation || 'Busy'}
                            </Badge>
                          )}
                          {doctor.estimatedArrival && (
                            <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                              ETA: {doctor.estimatedArrival}
                            </Badge>
                          )}
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-gray-900 mb-2">No doctors found</h4>
              <p className="text-gray-500 text-sm">
                Try searching for different specialties, doctor names, or hospitals
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Show default content when not searching */}
      {!showSearchResults && (
        <>
          {/* Quick Actions */}
          <div>
            <h3 className="mb-3 text-gray-900">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map(({ icon: Icon, label, color }) => (
                <Button
                  key={label}
                  variant="outline"
                  className="h-20 flex-col gap-2 bg-white border-gray-200 hover:bg-gray-50"
                >
                  <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Medical Specialties */}
          <div>
            <h3 className="mb-3 text-gray-900">Find Specialists</h3>
            <div className="grid grid-cols-2 gap-3">
              {specialties.map(({ icon: Icon, label, available }) => (
                <Card key={label} className="p-4 border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-gray-900">{label}</div>
                      <div className="text-sm text-gray-500">{available} available</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Nearby Hospitals - Now using real-time data from admin */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-gray-900">Nearby Healthcare</h3>
              <Badge variant="outline" className="text-xs text-green-600">
                <Activity className="w-3 h-3 mr-1" />
                Live Updates
              </Badge>
            </div>
            <div className="space-y-3">
              {hospitals.map((hospital) => (
                <Card key={hospital.id} className="p-4 border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-gray-900">{hospital.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {hospital.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {hospital.rating}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm px-2 py-1 rounded-full ${
                        hospital.status === 'Low wait' 
                          ? 'bg-green-100 text-green-700' 
                          : hospital.status === 'Moderate wait'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {hospital.status}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {hospital.waitTime}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}