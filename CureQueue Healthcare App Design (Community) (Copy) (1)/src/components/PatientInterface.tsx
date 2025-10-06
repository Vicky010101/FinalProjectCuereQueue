import React, { useState } from 'react';
import { PatientHome } from './patient/PatientHome';
import { AppointmentBooking } from './patient/AppointmentBooking';
import { HomeVisit } from './patient/HomeVisit';
import { MapView } from './patient/MapView';
import { Reviews } from './patient/Reviews';
import { Notifications } from './patient/Notifications';
import { ChatBot } from './shared/ChatBot';
import { Button } from './ui/button';
import { ArrowLeft, Home, Calendar, MapPin, Star, Bell, UserCheck, MessageCircle } from 'lucide-react';

interface PatientInterfaceProps {
  onBack: () => void;
}

export function PatientInterface({ onBack }: PatientInterfaceProps) {
  const [currentView, setCurrentView] = useState<'home' | 'appointments' | 'homevisit' | 'map' | 'reviews' | 'notifications'>('home');
  const [isChatBotMinimized, setIsChatBotMinimized] = useState(true);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <PatientHome />;
      case 'appointments':
        return <AppointmentBooking />;
      case 'homevisit':
        return <HomeVisit />;
      case 'map':
        return <MapView />;
      case 'reviews':
        return <Reviews />;
      case 'notifications':
        return <Notifications />;
      default:
        return <PatientHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-medium text-gray-900">CureQueue</h1>
              <p className="text-sm text-gray-600">Patient Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isChatBotMinimized ? "outline" : "default"}
              size="sm"
              onClick={() => setIsChatBotMinimized(!isChatBotMinimized)}
              className="relative"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              AI Assistant
              {isChatBotMinimized && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {renderCurrentView()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-6 gap-1 p-2">
          <Button
            variant={currentView === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('home')}
            className="flex-col h-16 gap-1"
          >
            <Home className="w-4 h-4" />
            <span className="text-xs">Home</span>
          </Button>
          
          <Button
            variant={currentView === 'appointments' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('appointments')}
            className="flex-col h-16 gap-1"
          >
            <Calendar className="w-4 h-4" />
            <span className="text-xs">Appointments</span>
          </Button>
          
          <Button
            variant={currentView === 'homevisit' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('homevisit')}
            className="flex-col h-16 gap-1"
          >
            <UserCheck className="w-4 h-4" />
            <span className="text-xs">Home Visit</span>
          </Button>
          
          <Button
            variant={currentView === 'map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('map')}
            className="flex-col h-16 gap-1"
          >
            <MapPin className="w-4 h-4" />
            <span className="text-xs">Map</span>
          </Button>
          
          <Button
            variant={currentView === 'reviews' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('reviews')}
            className="flex-col h-16 gap-1"
          >
            <Star className="w-4 h-4" />
            <span className="text-xs">Reviews</span>
          </Button>
          
          <Button
            variant={currentView === 'notifications' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('notifications')}
            className="flex-col h-16 gap-1 relative"
          >
            <Bell className="w-4 h-4" />
            <span className="text-xs">Alerts</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>

      {/* Smart Hospital Chat Bot */}
      <ChatBot
        isMinimized={isChatBotMinimized}
        onToggleMinimize={() => setIsChatBotMinimized(!isChatBotMinimized)}
      />
    </div>
  );
}