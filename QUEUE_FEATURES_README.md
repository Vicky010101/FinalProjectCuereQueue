# Queue and Waiting Time Features

This document describes the new queue and waiting time tracking features implemented in the CureQueue Healthcare App.

## Overview

The patient dashboard now displays real-time queue information for all healthcare facilities, allowing patients to:
- View queue lengths and estimated waiting times for all facilities
- Track their personal queue status and position
- Monitor real-time updates every 15-30 seconds
- See emergency status notifications

## Features Implemented

### 1. Facility Queue Display (`FacilityQueueDisplay.js`)

**Location**: `frontend/src/components/FacilityQueueDisplay.js`

**Features**:
- Shows all healthcare facilities with their current queue status
- Displays queue length (number of patients waiting)
- Shows estimated waiting time in minutes/hours
- Indicates emergency status with visual alerts
- Auto-refreshes every 30 seconds
- Manual refresh button for immediate updates
- Responsive design for mobile and desktop

**Data Displayed**:
- Facility name and address
- Specialties and services
- Queue length (patients waiting)
- Estimated wait time
- Emergency status indicators
- Last updated timestamp

### 2. Personal Queue Status (`PatientQueueStatus.js`)

**Location**: `frontend/src/components/PatientQueueStatus.js`

**Features**:
- Shows current patient's queue position
- Displays appointment details (doctor, time, token)
- Real-time waiting time estimates
- Emergency case notifications
- Auto-refreshes every 15 seconds
- Visual status indicators

**Data Displayed**:
- Current appointment information
- Queue position/token number
- Estimated wait time
- Emergency status alerts
- Real-time updates

### 3. Backend API Endpoints

**New Endpoints**:
- `GET /facilities/with-queues` - Returns all facilities with their queue data
- `GET /queue/patient/:patientId/status` - Returns patient's personal queue status

**Enhanced Endpoints**:
- `GET /facilities` - Basic facility listing
- `GET /queue/:facilityId` - Individual facility queue data

### 4. Database Models

**Queue Model** (`backend/models/Queue.js`):
- `facilityId` - Reference to facility
- `doctorId` - Reference to doctor
- `nowServing` - Current patient being served
- `etaMinutes` - Estimated time for next patient
- `emergency` - Emergency status flag

**Facility Model** (`backend/models/Facility.js`):
- `name` - Facility name
- `address` - Location
- `specialties` - Medical specialties
- `ratingAvg` - Average rating
- `capacity` - Patient capacity
- `emergency` - Emergency services flag

## Installation and Setup

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the seed script to create test data:
   ```bash
   node seed.js
   ```

4. Start the server:
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

### For Patients

1. **Login** to the patient dashboard using test credentials:
   - Email: `patient@test.com`
   - Password: `password123`

2. **View Facility Queues**: The dashboard automatically displays queue information for all facilities

3. **Check Personal Status**: Your personal queue status is shown if you have appointments

4. **Real-time Updates**: Information refreshes automatically every 15-30 seconds

### For Administrators/Doctors

1. **Login** using admin credentials:
   - Email: `admin@test.com`
   - Password: `password123`

2. **Update Queue Data**: Use the queue management endpoints to update patient status

3. **Monitor Emergencies**: Set emergency flags when needed

## API Documentation

### Get Facilities with Queue Data

```http
GET /facilities/with-queues
```

**Response**:
```json
{
  "facilities": [
    {
      "_id": "facility_id",
      "name": "Apollo Hospitals",
      "address": "Mumbai",
      "specialties": ["Cardiology", "Neurology"],
      "ratingAvg": 4.6,
      "queue": {
        "nowServing": 15,
        "etaMinutes": 45,
        "emergency": false
      }
    }
  ]
}
```

### Get Patient Queue Status

```http
GET /queue/patient/:patientId/status
```

**Response**:
```json
{
  "inQueue": true,
  "appointments": [
    {
      "id": "appointment_id",
      "doctorName": "Dr. Sarah Smith",
      "time": "10:00",
      "token": "A15",
      "waitingTime": 30,
      "status": "confirmed"
    }
  ],
  "queueStatus": {
    "nowServing": 12,
    "etaMinutes": 25,
    "emergency": false
  }
}
```

## Technical Details

### Real-time Updates

- **Facility Queues**: Updates every 30 seconds
- **Personal Status**: Updates every 15 seconds
- **Manual Refresh**: Available for immediate updates

### Responsive Design

- Mobile-first approach
- Grid layouts adapt to screen size
- Touch-friendly interface elements

### Error Handling

- Graceful fallbacks for missing data
- User-friendly error messages
- Automatic retry mechanisms

### Performance

- Efficient API calls with single endpoints
- Optimized database queries
- Minimal re-renders with React optimization

## Customization

### Styling

The components use CSS variables defined in `frontend/src/index.css`:
- Primary color: `#0f766e`
- Success color: `#10b981`
- Warning color: `#f59e0b`
- Danger color: `#ef4444`

### Update Intervals

Modify the refresh intervals in the components:
- `FacilityQueueDisplay.js`: Line 108 (30000ms)
- `PatientQueueStatus.js`: Line 42 (15000ms)

### Queue Calculations

The wait time prediction algorithm is in `frontend/src/lib/predictWaitTime.js` and can be customized based on your facility's specific needs.

## Troubleshooting

### Common Issues

1. **No Queue Data Displayed**
   - Check if the backend server is running
   - Verify MongoDB connection
   - Run the seed script to create test data

2. **Real-time Updates Not Working**
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check network connectivity

3. **Styling Issues**
   - Ensure all CSS files are loaded
   - Check for CSS conflicts
   - Verify responsive breakpoints

### Debug Mode

Enable debug logging by checking the browser console and backend server logs for detailed error information.

## Future Enhancements

Potential improvements for future versions:
- WebSocket support for real-time updates
- Push notifications for queue changes
- Advanced wait time prediction algorithms
- Integration with external hospital systems
- Mobile app support
- Offline queue viewing capabilities

## Support

For technical support or feature requests, please refer to the main project documentation or contact the development team.



