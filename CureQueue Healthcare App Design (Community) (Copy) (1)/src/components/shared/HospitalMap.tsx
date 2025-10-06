import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  MapPin,
  Navigation,
  Clock,
  Users,
  Car,
  Utensils,
  Heart,
  Brain,
  Eye,
  Activity,
  Stethoscope,
  CreditCard,
  FileText,
  Zap,
  Phone,
  Info
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  floor: string;
  coordinates: { x: number; y: number };
  icon: React.ElementType;
  waitTime?: string;
  status: 'available' | 'busy' | 'closed';
  description: string;
}

const hospitalDepartments: Department[] = [
  // Ground Floor
  { 
    id: 'main-entrance', 
    name: 'Main Entrance', 
    floor: 'Ground Floor', 
    coordinates: { x: 50, y: 90 }, 
    icon: MapPin, 
    status: 'available',
    description: 'Main hospital entrance with reception and information desk'
  },
  { 
    id: 'emergency', 
    name: 'Emergency Department', 
    floor: 'Ground Floor', 
    coordinates: { x: 80, y: 70 }, 
    icon: Zap, 
    waitTime: '15 min',
    status: 'available',
    description: '24/7 emergency medical care'
  },
  { 
    id: 'registration', 
    name: 'Registration', 
    floor: 'Ground Floor', 
    coordinates: { x: 30, y: 80 }, 
    icon: FileText,
    waitTime: '5 min',
    status: 'available',
    description: 'Patient registration and admissions'
  },
  { 
    id: 'pharmacy', 
    name: 'Pharmacy', 
    floor: 'Ground Floor', 
    coordinates: { x: 20, y: 50 }, 
    icon: Activity,
    waitTime: '10 min',
    status: 'available',
    description: 'Prescription medications and medical supplies'
  },
  { 
    id: 'billing', 
    name: 'Billing Office', 
    floor: 'Ground Floor', 
    coordinates: { x: 70, y: 30 }, 
    icon: CreditCard,
    waitTime: '8 min',
    status: 'available',
    description: 'Payment processing and insurance inquiries'
  },
  { 
    id: 'laboratory', 
    name: 'Laboratory', 
    floor: 'Ground Floor', 
    coordinates: { x: 40, y: 20 }, 
    icon: FileText,
    waitTime: '20 min',
    status: 'busy',
    description: 'Blood tests, urine tests, and other laboratory services'
  },

  // 2nd Floor
  { 
    id: 'cardiology', 
    name: 'Cardiology', 
    floor: '2nd Floor', 
    coordinates: { x: 25, y: 70 }, 
    icon: Heart,
    waitTime: '30 min',
    status: 'available',
    description: 'Heart and cardiovascular care'
  },
  { 
    id: 'general-medicine', 
    name: 'General Medicine', 
    floor: '2nd Floor', 
    coordinates: { x: 60, y: 60 }, 
    icon: Stethoscope,
    waitTime: '25 min',
    status: 'available',
    description: 'General medical consultations and check-ups'
  },
  { 
    id: 'cafeteria', 
    name: 'Cafeteria', 
    floor: '2nd Floor', 
    coordinates: { x: 80, y: 40 }, 
    icon: Utensils,
    status: 'available',
    description: 'Food court and dining area'
  },

  // 3rd Floor
  { 
    id: 'neurology', 
    name: 'Neurology', 
    floor: '3rd Floor', 
    coordinates: { x: 30, y: 70 }, 
    icon: Brain,
    waitTime: '45 min',
    status: 'busy',
    description: 'Brain and nervous system care'
  },
  { 
    id: 'ophthalmology', 
    name: 'Ophthalmology', 
    floor: '3rd Floor', 
    coordinates: { x: 70, y: 50 }, 
    icon: Eye,
    waitTime: '35 min',
    status: 'available',
    description: 'Eye care and vision services'
  },

  // Basement
  { 
    id: 'radiology', 
    name: 'Radiology', 
    floor: 'Basement', 
    coordinates: { x: 50, y: 60 }, 
    icon: Activity,
    waitTime: '40 min',
    status: 'available',
    description: 'X-rays, CT scans, MRI, and medical imaging'
  },
  { 
    id: 'parking', 
    name: 'Parking Garage', 
    floor: 'Basement', 
    coordinates: { x: 20, y: 20 }, 
    icon: Car,
    status: 'available',
    description: 'Underground parking for patients and visitors'
  }
];

const floors = ['Ground Floor', '2nd Floor', '3rd Floor', 'Basement'];

interface HospitalMapProps {
  selectedDepartment?: string;
  onDepartmentSelect?: (department: Department) => void;
}

export function HospitalMap({ selectedDepartment, onDepartmentSelect }: HospitalMapProps) {
  const [currentFloor, setCurrentFloor] = useState('Ground Floor');
  const [hoveredDepartment, setHoveredDepartment] = useState<string | null>(null);

  const currentFloorDepartments = hospitalDepartments.filter(dept => dept.floor === currentFloor);

  const getStatusColor = (status: Department['status']) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'closed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Department['status']) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'closed': return 'Closed';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-4">
      {/* Floor Selection */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Hospital Floor Plan</h3>
        <Select value={currentFloor} onValueChange={setCurrentFloor}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {floors.map(floor => (
              <SelectItem key={floor} value={floor}>{floor}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Map Display */}
      <Card className="p-6">
        <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden">
          {/* Floor Layout Background */}
          <div className="absolute inset-4 border-2 border-gray-300 rounded-lg bg-white/50">
            {/* Corridors */}
            <div className="absolute top-1/2 left-0 right-0 h-8 bg-gray-200/50 transform -translate-y-1/2"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-8 bg-gray-200/50 transform -translate-x-1/2"></div>
          </div>

          {/* Department Markers */}
          {currentFloorDepartments.map((department) => {
            const Icon = department.icon;
            const isSelected = selectedDepartment === department.id;
            const isHovered = hoveredDepartment === department.id;

            return (
              <div
                key={department.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                  isSelected || isHovered ? 'scale-110 z-10' : 'z-0'
                }`}
                style={{
                  left: `${department.coordinates.x}%`,
                  top: `${department.coordinates.y}%`
                }}
                onClick={() => onDepartmentSelect?.(department)}
                onMouseEnter={() => setHoveredDepartment(department.id)}
                onMouseLeave={() => setHoveredDepartment(null)}
              >
                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                  isSelected ? 'bg-blue-600 text-white ring-4 ring-blue-200' : 
                  isHovered ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border-2 border-gray-300'
                }`}>
                  <Icon className="w-5 h-5" />
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(department.status)}`}></div>
                </div>

                {/* Department Label */}
                <div className={`absolute top-14 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap transition-opacity ${
                  isHovered || isSelected ? 'opacity-100' : 'opacity-0'
                }`}>
                  {department.name}
                  {department.waitTime && (
                    <div className="text-xs opacity-80">Wait: {department.waitTime}</div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Floor Label */}
          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg shadow-md">
            <span className="font-medium text-gray-900">{currentFloor}</span>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md">
            <div className="text-xs font-medium text-gray-900 mb-2">Status</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span>Busy</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Department List */}
      <Card className="p-4">
        <h4 className="font-medium text-gray-900 mb-3">{currentFloor} Departments</h4>
        <div className="grid gap-3">
          {currentFloorDepartments.map((department) => {
            const Icon = department.icon;
            return (
              <div
                key={department.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedDepartment === department.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => onDepartmentSelect?.(department)}
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center relative">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(department.status)}`}></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium text-gray-900">{department.name}</h5>
                    <Badge variant={department.status === 'available' ? 'default' : department.status === 'busy' ? 'secondary' : 'destructive'}>
                      {getStatusText(department.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{department.description}</p>
                  {department.waitTime && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Wait time: {department.waitTime}</span>
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  <Navigation className="w-4 h-4 mr-1" />
                  Directions
                </Button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export { hospitalDepartments };
export type { Department };