import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Bell, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle,
  Navigation,
  Phone,
  Settings,
  X
} from 'lucide-react';

type NotificationType = 'appointment' | 'reminder' | 'delay' | 'redirect' | 'emergency' | 'update';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  urgent: boolean;
  actionable: boolean;
  metadata?: {
    appointmentId?: string;
    doctorName?: string;
    hospitalName?: string;
    newTime?: string;
    redirectHospital?: string;
  };
}

export function Notifications() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'reminder',
      title: 'Appointment Tomorrow',
      message: 'Your appointment with Dr. Sarah Johnson is scheduled for tomorrow at 2:30 PM at City General Hospital.',
      timestamp: '2 hours ago',
      isRead: false,
      urgent: false,
      actionable: true,
      metadata: {
        appointmentId: 'APT123',
        doctorName: 'Dr. Sarah Johnson',
        hospitalName: 'City General Hospital'
      }
    },
    {
      id: '2',
      type: 'delay',
      title: 'Appointment Delayed',
      message: 'Your appointment has been delayed by 30 minutes due to an emergency. New time: 3:00 PM.',
      timestamp: '45 minutes ago',
      isRead: false,
      urgent: true,
      actionable: true,
      metadata: {
        appointmentId: 'APT124',
        doctorName: 'Dr. Michael Chen',
        newTime: '3:00 PM'
      }
    },
    {
      id: '3',
      type: 'redirect',
      title: 'Alternative Clinic Available',
      message: 'Medicare Clinic has a shorter wait time (15 min). Would you like to be redirected?',
      timestamp: '1 hour ago',
      isRead: false,
      urgent: false,
      actionable: true,
      metadata: {
        redirectHospital: 'Medicare Clinic'
      }
    },
    {
      id: '4',
      type: 'appointment',
      title: 'Appointment Confirmed',
      message: 'Your home visit with Dr. Emma Wilson has been confirmed for today at 5:00 PM.',
      timestamp: '3 hours ago',
      isRead: true,
      urgent: false,
      actionable: false,
      metadata: {
        appointmentId: 'APT125',
        doctorName: 'Dr. Emma Wilson'
      }
    },
    {
      id: '5',
      type: 'update',
      title: 'Health Records Updated',
      message: 'Your recent blood test results have been added to your health records.',
      timestamp: '1 day ago',
      isRead: true,
      urgent: false,
      actionable: true
    },
    {
      id: '6',
      type: 'emergency',
      title: 'Emergency Alert',
      message: 'City General Hospital Emergency Department has immediate availability.',
      timestamp: '2 days ago',
      isRead: true,
      urgent: true,
      actionable: false
    }
  ]);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'reminder':
        return <Bell className="w-5 h-5 text-purple-600" />;
      case 'delay':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'redirect':
        return <Navigation className="w-5 h-5 text-green-600" />;
      case 'emergency':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'update':
        return <CheckCircle className="w-5 h-5 text-teal-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'appointment':
        return 'bg-blue-50 border-blue-200';
      case 'reminder':
        return 'bg-purple-50 border-purple-200';
      case 'delay':
        return 'bg-orange-50 border-orange-200';
      case 'redirect':
        return 'bg-green-50 border-green-200';
      case 'emergency':
        return 'bg-red-50 border-red-200';
      case 'update':
        return 'bg-teal-50 border-teal-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'urgent') return notif.urgent;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.urgent && !n.isRead).length;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl text-gray-900">Notifications</h2>
          <p className="text-gray-600">Stay updated with your healthcare</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
            filter === 'unread' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-white text-blue-600 text-xs">
              {unreadCount}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setFilter('urgent')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
            filter === 'urgent' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Urgent
          {urgentCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {urgentCount}
            </Badge>
          )}
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`p-4 transition-all ${
                !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
              } ${getNotificationColor(notification.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className={`text-gray-900 ${!notification.isRead ? 'font-medium' : ''}`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {notification.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                      <button 
                        onClick={() => removeNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{notification.timestamp}</span>
                    
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs"
                        >
                          Mark as read
                        </Button>
                      )}
                      
                      {notification.actionable && (
                        <div className="flex gap-2">
                          {notification.type === 'reminder' && (
                            <>
                              <Button size="sm" variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                Directions
                              </Button>
                              <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700">
                                <Calendar className="w-3 h-3 mr-1" />
                                Add to Calendar
                              </Button>
                            </>
                          )}
                          
                          {notification.type === 'delay' && (
                            <>
                              <Button size="sm" variant="outline" className="text-xs">
                                <Phone className="w-3 h-3 mr-1" />
                                Call
                              </Button>
                              <Button size="sm" className="text-xs bg-orange-600 hover:bg-orange-700">
                                Accept Change
                              </Button>
                            </>
                          )}
                          
                          {notification.type === 'redirect' && (
                            <>
                              <Button size="sm" variant="outline" className="text-xs">
                                Decline
                              </Button>
                              <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700">
                                Redirect Me
                              </Button>
                            </>
                          )}
                          
                          {notification.type === 'update' && (
                            <Button size="sm" className="text-xs bg-teal-600 hover:bg-teal-700">
                              View Records
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Mark All as Read */}
      {unreadCount > 0 && (
        <Button 
          variant="outline" 
          className="w-full mt-6"
          onClick={() => setNotifications(notifications.map(n => ({...n, isRead: true})))}
        >
          Mark All as Read ({unreadCount})
        </Button>
      )}
    </div>
  );
}