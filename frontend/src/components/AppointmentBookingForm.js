import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import API from "../api";
import { queueBus } from "../lib/eventBus";

function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await API.get('/facilities/doctors');
        if (!active) return;
        setDoctors((res.data.doctors || []).map(d => ({ id: d._id, name: d.name, specialty: d.specialization || d.email })));
      } catch (_) {}
    })();
    return () => { active = false; };
  }, []);
  return doctors;
}

function AppointmentBookingForm() {
	const [date, setDate] = useState("");
	const doctors = useDoctors();
	const [doctorId, setDoctorId] = useState("");
	const [reason, setReason] = useState("");
	const [loading, setLoading] = useState(false);
	const [bookingSuccess, setBookingSuccess] = useState(null);


	const selectedDoctor = useMemo(() => doctors.find(d => d.id === doctorId), [doctorId, doctors]);

	const submit = async (e) => {
		e.preventDefault();
		if (!date) { toast.error("Select date"); return; }
		if (!doctorId) { toast.error("Select a doctor"); return; }
		
		setLoading(true);
		try {
			const res = await API.post('/appointments', { doctorId, date, reason });
			setBookingSuccess({
				token: res.data.appointment.token,
				doctor: selectedDoctor?.name,
				date,
				bookedAtIST: res.data.appointmentTimeIST || res.data.appointment.time,
				status: res.data.appointment.status,
				waitingTime: res.data.waitingTime
			});
			toast.success(`Your appointment has been successfully booked at ${res.data.appointmentTimeIST || res.data.appointment.time} (IST)`);
			
			// Emit event to refresh appointments in other components
			queueBus.emit('appointmentBooked', res.data.appointment);
			
			// Reset form
			setDate("");
			setDoctorId("");
			setReason("");
		} catch (e) {
			console.error('Booking error:', e);
			toast.error('Failed to book appointment');
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		setBookingSuccess(null);
		setDate("");
		setDoctorId("");
		setReason("");
	};

	if (bookingSuccess) {
		return (
			<section className="appointment-section">
				<div className="card appointment-card">
					<div className="card-header">
						<h3 className="card-title">Booking Confirmed!</h3>
						<CheckCircle2 size={20} color="#10b981" />
					</div>
					<div style={{ padding: 16, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8 }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
							<CheckCircle2 size={16} color="#10b981" />
							<span style={{ fontWeight: 600, color: '#059669' }}>Appointment Booked Successfully</span>
						</div>
						<div style={{ display: 'grid', gap: 8 }}>
							<p><strong>Token:</strong> {bookingSuccess.token}</p>
							<p><strong>Doctor:</strong> {bookingSuccess.doctor}</p>
							<p><strong>Date:</strong> {bookingSuccess.date}</p>
							<p><strong>Booked At (IST):</strong> {bookingSuccess.bookedAtIST}</p>
							{typeof bookingSuccess.waitingTime === 'number' && (
								<p><strong>Estimated Waiting Time:</strong> {bookingSuccess.waitingTime} minutes</p>
							)}
							<p><strong>Status:</strong> {bookingSuccess.status}</p>
						</div>
						<button 
							className="btn btn-primary" 
							onClick={resetForm}
							style={{ marginTop: 12 }}
						>
							Book Another Appointment
						</button>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="appointment-section">
			<div className="card appointment-card">
				<div className="card-header">
					<h3 className="card-title">Book Appointment</h3>
					<CalendarDays size={20} color="#0f766e" />
				</div>
				<form onSubmit={submit} className="form-modern form-compact appointment-form">
				<div className="grid grid-2">
					<div className="form-field">
						<label className="label">Date *</label>
						<input 
							className="input" 
							type="date" 
							value={date} 
							onChange={(e) => setDate(e.target.value)}
							min={new Date().toISOString().split('T')[0]}
							required
						/>
					</div>
					<div className="form-field">
						<label className="label">Doctor *</label>
						<select 
							className="input" 
							value={doctorId} 
							onChange={(e) => setDoctorId(e.target.value)}
							required
						>
							<option value="">Select doctor</option>
							{doctors.map((d) => (
								<option key={d.id} value={d.id}>{d.name}</option>
							))}
						</select>
					</div>
				</div>
				<div className="form-field">
					<label className="label">Reason for Visit</label>
					<textarea 
						className="input" 
						rows={3} 
						placeholder="Brief reason for visit" 
						value={reason} 
						onChange={(e) => setReason(e.target.value)} 
					/>
				</div>
				<button 
					className="btn btn-primary" 
					type="submit" 
					disabled={!date || !doctorId || loading}
				>
					{loading ? (
						<>
							<div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div>
							Booking...
						</>
					) : (
						<>
							<CheckCircle2 size={16} />
							Confirm Booking
						</>
					)}
				</button>
				{selectedDoctor && (
					<p className="text-muted">
						Selected: {selectedDoctor.name} — {selectedDoctor.specialty}
					</p>
				)}
			</form>
			</div>
		</section>
	);
}

export default AppointmentBookingForm;



