// This file documents the API routes that should be implemented in the Supabase Edge Function
// Place this in /supabase/functions/server/index.tsx

/*

Expected API Routes for CureQueue Healthcare App:

BASE URL: https://${projectId}.supabase.co/functions/v1/make-server-5010b16a

AUTHENTICATION ROUTES:
POST /auth/signup
- Body: { email, password, name, role, phone? }
- Response: { id, email, name, role, phone? }

POST /auth/signin  
- Body: { email, password }
- Response: { user: AuthUser, token: string }

POST /auth/signout
- Headers: Authorization Bearer token
- Response: 200 OK

GET /auth/me
- Headers: Authorization Bearer token
- Response: AuthUser | 401

APPOINTMENT ROUTES:
GET /appointments?userId={userId}
- Headers: Authorization Bearer token
- Response: Appointment[]

POST /appointments
- Headers: Authorization Bearer token
- Body: CreateAppointmentRequest
- Response: Appointment with generated ID

PUT /appointments/{appointmentId}
- Headers: Authorization Bearer token
- Body: UpdateAppointmentRequest
- Response: Updated Appointment

DELETE /appointments/{appointmentId}
- Headers: Authorization Bearer token
- Response: 200 OK

HOME VISIT ROUTES:
GET /home-visits?userId={userId}
- Headers: Authorization Bearer token
- Response: HomeVisitRequest[]

POST /home-visits
- Headers: Authorization Bearer token
- Body: CreateHomeVisitRequest
- Response: HomeVisitRequest with generated ID

PUT /home-visits/{visitId}
- Headers: Authorization Bearer token
- Body: UpdateHomeVisitRequest
- Response: Updated HomeVisitRequest

DELETE /home-visits/{visitId}
- Headers: Authorization Bearer token
- Response: 200 OK

HOSPITAL ROUTES:
GET /hospitals
- Response: Hospital[]

PUT /hospitals/{hospitalId}/wait-time
- Headers: Authorization Bearer token (admin only)
- Body: { waitTime: string, status: string }
- Response: Updated Hospital

DOCTOR ROUTES:
GET /doctors
- Response: Doctor[]

PUT /doctors/{doctorId}/location
- Headers: Authorization Bearer token (admin only)
- Body: { location: string, estimatedArrival?: string }
- Response: Updated Doctor

QUEUE ROUTES:
GET /queue
- Headers: Authorization Bearer token (admin only)
- Response: QueuePatient[]

PUT /queue/{patientId}
- Headers: Authorization Bearer token (admin only)
- Body: { status: string }
- Response: Updated QueuePatient

DATA STORAGE:
All data should be stored in the Supabase KV store with appropriate prefixes:
- users:{userId} - User authentication data
- appointments:{appointmentId} - Appointment records
- home_visits:{visitId} - Home visit requests
- hospitals:{hospitalId} - Hospital information
- doctors:{doctorId} - Doctor information
- queue:{patientId} - Queue status

AUTHENTICATION:
- Use Supabase Auth service for user management
- JWT tokens for API authentication
- Role-based access control (patient/admin/doctor)

ERROR HANDLING:
- Return appropriate HTTP status codes
- Include error messages in response body
- Log errors for debugging

CORS:
- Allow all origins for development
- Include proper CORS headers in responses

*/

export const API_ROUTES_DOCUMENTATION = `
CureQueue Healthcare App - API Routes Documentation

This file serves as documentation for the expected API routes that should be 
implemented in the Supabase Edge Function at /supabase/functions/server/index.tsx

The frontend expects these endpoints to be available for full functionality.
All data should be stored using the Supabase KV store utilities.
`;