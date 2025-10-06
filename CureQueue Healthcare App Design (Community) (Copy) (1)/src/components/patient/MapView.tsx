import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { HospitalMap, hospitalDepartments, Department } from '../shared/HospitalMap';
import { useAppData } from '../shared/AppDataStore';
import {
  Search,
  MapPin,
  Navigation,
  Clock,
  Star,
  Phone,
  Activity,
  AlertTriangle,
  Info,
  Route,
  Car,
  User,
  Bus
} from 'lucide-react';

export function MapView() {
  const { hospitals } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedHospital, setSelectedHospital] = useState<string>('');
  const [directions, setDirections] = useState<string>('');

  // Filter departments based on search
  const filteredDepartments = hospitalDepartments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department.id);
    generateDirections(department);
  };

  const generateDirections = (department: Department) => {
    const directionsText = `
🗺️ **Directions to ${department.name}**

📍 **Location:** ${department.floor}
⏱️ **Estimated walking time:** 3-5 minutes from main entrance

**Step-by-step directions:**
1. Enter through the Main Entrance
2. ${department.floor === 'Ground Floor' ? 'Stay on the ground floor' : `Take elevator to ${department.floor}`}
3. ${department.floor === 'Basement' ? 'Exit elevator and follow basement corridor' : 'Exit elevator and follow the corridor'}
4. Look for "${department.name}" signs
5. The department will be on your ${department.coordinates.x > 50 ? 'right' : 'left'}

${department.waitTime ? `⏰ **Current wait time:** ${department.waitTime}` : ''}
${department.status === 'busy' ? '🟡 **Status:** Currently busy, longer wait times expected' : ''}
${department.status === 'available' ? '🟢 **Status:** Available, normal wait times' : ''}

📞 **Need help?** Ask any staff member or use the intercom stations along the corridors.
    `.trim();

    setDirections(directionsText);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-700 bg-yellow-100';
      case 'closed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const selectedDept = hospitalDepartments.find(d => d.id === selectedDepartment);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <h2 className="text-2xl mb-2 text-gray-900">Hospital Navigation</h2>
        <p className="text-gray-600">Find your way around our healthcare facilities</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search departments, services, or facilities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 rounded-xl border-gray-200 bg-white shadow-sm"
        />
      </div>

      {/* Quick Access Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setSelectedDepartment('emergency');
            const emergencyDept = hospitalDepartments.find(d => d.id === 'emergency');
            if (emergencyDept) generateDirections(emergencyDept);
          }}
          className="h-16 flex-col gap-1 bg-red-50 border-red-200 hover:bg-red-100"
        >
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="text-xs text-red-700">Emergency</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {
            setSelectedDepartment('pharmacy');
            const pharmacyDept = hospitalDepartments.find(d => d.id === 'pharmacy');
            if (pharmacyDept) generateDirections(pharmacyDept);
          }}
          className="h-16 flex-col gap-1 bg-blue-50 border-blue-200 hover:bg-blue-100"
        >
          <Activity className="w-5 h-5 text-blue-600" />
          <span className="text-xs text-blue-700">Pharmacy</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {
            setSelectedDepartment('laboratory');
            const labDept = hospitalDepartments.find(d => d.id === 'laboratory');
            if (labDept) generateDirections(labDept);
          }}
          className="h-16 flex-col gap-1 bg-green-50 border-green-200 hover:bg-green-100"
        >
          <Activity className="w-5 h-5 text-green-600" />
          <span className="text-xs text-green-700">Lab</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {
            setSelectedDepartment('parking');
            const parkingDept = hospitalDepartments.find(d => d.id === 'parking');
            if (parkingDept) generateDirections(parkingDept);
          }}
          className="h-16 flex-col gap-1 bg-purple-50 border-purple-200 hover:bg-purple-100"
        >
          <Car className="w-5 h-5 text-purple-600" />
          <span className="text-xs text-purple-700">Parking</span>
        </Button>
      </div>

      {/* Hospital Map */}
      <HospitalMap
        selectedDepartment={selectedDepartment}
        onDepartmentSelect={handleDepartmentSelect}
      />

      {/* Directions Display */}
      {directions && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Route className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">Navigation Instructions</h3>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
              {directions}
            </pre>
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              Call Department
            </Button>
            <Button size="sm" variant="outline">
              <User className="w-4 h-4 mr-2" />
              Start Navigation
            </Button>
          </div>
        </Card>
      )}

      {/* Search Results */}
      {searchQuery && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Search Results</h3>
          {filteredDepartments.length > 0 ? (
            <div className="space-y-3">
              {filteredDepartments.map((department) => {
                const Icon = department.icon;
                return (
                  <div
                    key={department.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => handleDepartmentSelect(department)}
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{department.name}</h4>
                        <Badge className={`text-xs ${getStatusColor(department.status)}`}>
                          {department.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{department.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{department.floor}</span>
                        {department.waitTime && (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>{department.waitTime}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Navigation className="w-4 h-4 mr-1" />
                      Get Directions
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No departments found matching your search.</p>
            </div>
          )}
        </Card>
      )}

      {/* Nearby Hospitals */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">Nearby Healthcare Facilities</h3>
        </div>
        <div className="space-y-4">
          {hospitals.map((hospital) => (
            <div key={hospital.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{hospital.name}</h4>
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
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline">
                  <Navigation className="w-4 h-4 mr-1" />
                  Directions
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="outline">
                  <Info className="w-4 h-4 mr-1" />
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Transportation Options */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Car className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">Transportation Options</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <Car className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <h4 className="font-medium text-gray-900">Parking</h4>
            <p className="text-sm text-gray-600 mt-1">Underground garage</p>
            <p className="text-xs text-green-600 mt-1">Available spaces</p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <Bus className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <h4 className="font-medium text-gray-900">Public Transit</h4>
            <p className="text-sm text-gray-600 mt-1">Bus stop nearby</p>
            <p className="text-xs text-blue-600 mt-1">Route 15, 32</p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <User className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <h4 className="font-medium text-gray-900">Walking</h4>
            <p className="text-sm text-gray-600 mt-1">Main entrance</p>
            <p className="text-xs text-orange-600 mt-1">Wheelchair accessible</p>
          </div>
        </div>
      </Card>
    </div>
  );
}