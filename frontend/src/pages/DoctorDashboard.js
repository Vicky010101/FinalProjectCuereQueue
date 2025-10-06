import React, { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";
import { ClipboardList, CalendarDays, X, User, Clock, FileText, CheckCircle, History, AlertCircle, Hash } from "lucide-react";
import { toast } from "sonner";
import { queueBus } from "../lib/eventBus";

function DoctorDashboard() {
	const [todayAppointments, setTodayAppointments] = useState([]);
	const [pastAppointments, setPastAppointments] = useState([]);
	const [cancelledAppointments, setCancelledAppointments] = useState([]);
	const [allAppointments, setAllAppointments] = useState([]);
	const [me, setMe] = useState(null);
	const [activeTab, setActiveTab] = useState('today');

	useEffect(() => {
		let isMounted = true;
		(async () => {
			try {
				const meRes = await API.get("/auth/me");
				if (!isMounted) return;
				setMe(meRes.data.user);
				// Load doctor's appointments
				const apptRes = await API.get('/doctor/appointments');
				if (!isMounted) return;
				const todayLocal = new Date();
				const yyyy = todayLocal.getFullYear();
				const mm = String(todayLocal.getMonth() + 1).padStart(2, '0');
				const dd = String(todayLocal.getDate()).padStart(2, '0');
				const todayStr = `${yyyy}-${mm}-${dd}`;
				const allAppts = (apptRes.data.appointments || []).map(a => ({ 
					id: a._id, patient: a.patientName, time: a.time, date: a.date, status: a.status, reason: a.reason, token: a.token
				}));
				const today = allAppts.filter(a => a.date === todayStr && a.status === 'confirmed');
				const past = allAppts.filter(a => a.date < todayStr && a.status === 'completed');
				const cancelled = allAppts.filter(a => a.status === 'cancelled');
				setTodayAppointments(today);
				setPastAppointments(past);
				setCancelledAppointments(cancelled);
				setAllAppointments(allAppts);
			} catch (e) {
				toast.error('Failed to load doctor data');
			}
		})();
		return () => { isMounted = false; };
	}, []);

	useEffect(() => {
		const handleNewAppointment = (appointment) => {
			const todayLocal = new Date();
			const yyyy = todayLocal.getFullYear();
			const mm = String(todayLocal.getMonth() + 1).padStart(2, '0');
			const dd = String(todayLocal.getDate()).padStart(2, '0');
			const todayStr = `${yyyy}-${mm}-${dd}`;
			if (appointment.date === todayStr) {
				const newAppt = { id: appointment._id, patient: appointment.patientName, time: appointment.time, date: appointment.date, status: appointment.status, reason: appointment.reason, token: appointment.token };
				setTodayAppointments(prev => [...prev, newAppt]);
				setAllAppointments(prev => [...prev, newAppt]);
			}
		};
		const unsubscribe = queueBus.subscribe('appointmentBooked', handleNewAppointment);
		return () => unsubscribe();
	}, []);

	const handleCancelAppointment = async (appointmentId) => {
		if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
		try {
			await API.patch(`/appointments/${appointmentId}/cancel`);
			toast.success('Appointment cancelled successfully');
			updateAppointmentStatus(appointmentId, 'cancelled');
			queueBus.emit('appointmentUpdated', { _id: appointmentId, status: 'cancelled' });
		} catch (error) {
			console.error('Cancel appointment error:', error);
			toast.error('Failed to cancel appointment');
		}
	};

	const handleCompleteAppointment = async (appointmentId) => {
		if (!window.confirm('Mark this appointment as completed?')) return;
		try {
			await API.patch(`/appointments/${appointmentId}/complete`);
			toast.success('Appointment marked as completed');
			updateAppointmentStatus(appointmentId, 'completed');
			queueBus.emit('appointmentUpdated', { _id: appointmentId, status: 'completed' });
		} catch (error) {
			console.error('Complete appointment error:', error);
			toast.error('Failed to complete appointment');
		}
	};

	const updateAppointmentStatus = (appointmentId, newStatus) => {
		const appointment = allAppointments.find(apt => apt.id === appointmentId);
		if (!appointment) return;
		const updated = { ...appointment, status: newStatus };
		setAllAppointments(prev => prev.map(apt => apt.id === appointmentId ? updated : apt));
		setTodayAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
		if (newStatus === 'completed') setPastAppointments(prev => [...prev, updated]);
		if (newStatus === 'cancelled') setCancelledAppointments(prev => [...prev, updated]);
	};

	const renderAppointmentList = (appointments, emptyMessage) => {
		if (appointments.length === 0) {
			return (<li className="list-item"><span className="text-muted">{emptyMessage}</span></li>);
		}
		return appointments.map((a) => (
			<li key={a.id} className="list-item">
				<div style={{ flex: 1 }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
						<User size={16} color="#0f766e" />
						<span style={{ fontWeight: 600 }}>{a.patient}</span>
						<span className="badge" style={{ fontSize: '12px' }}>Token: {a.token}</span>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
						<Clock size={14} color="#6b7280" />
						<span className="text-muted" style={{ fontSize: 14 }}>{a.date} • {a.time}</span>
					</div>
					{a.reason && (
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<FileText size={14} color="#6b7280" />
							<span className="text-muted" style={{ fontSize: 12 }}>{a.reason}</span>
						</div>
					)}
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
					<span className={`badge ${a.status === 'confirmed' ? 'badge-green' : a.status === 'cancelled' ? 'badge-red' : a.status === 'completed' ? 'badge-blue' : 'badge-blue'}`}>{a.status}</span>
					{a.status === 'confirmed' && (
						<div style={{ display: 'flex', gap: 4 }}>
							<button className="btn btn-outline btn-sm" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleCompleteAppointment(a.id)} title="Mark as completed"><CheckCircle size={12} />Complete</button>
							<button className="btn btn-outline btn-sm" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleCancelAppointment(a.id)} title="Cancel appointment"><X size={12} />Cancel</button>
						</div>
					)}
				</div>
			</li>
		));
	};

	return (
		<div className="container-responsive" style={{ paddingTop: 24, paddingBottom: 24 }}>
			<div style={{ marginBottom: 24 }}>
				<h1 className="page-title">{me ? `Welcome, Dr. ${me.name}` : "Doctor Dashboard"}</h1>
				<p className="page-subtitle">Your schedule and current queue at a glance.</p>
			</div>

			{/* Appointments Section */}
			<motion.div layout className="card" style={{ marginBottom: 24 }}>
				<div className="card-header">
					<h2 className="card-title">Appointments</h2>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<CalendarDays size={20} color="#0f766e" />
					</div>
				</div>

				{/* Tab Navigation */}
				<div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
					<button className={`btn ${activeTab === 'today' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('today')} style={{ padding: '6px 12px', fontSize: '14px' }}>Today's ({todayAppointments.length})</button>
					<button className={`btn ${activeTab === 'past' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('past')} style={{ padding: '6px 12px', fontSize: '14px' }}><History size={14} />Past ({pastAppointments.length})</button>
					<button className={`btn ${activeTab === 'cancelled' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('cancelled')} style={{ padding: '6px 12px', fontSize: '14px' }}><AlertCircle size={14} />Cancelled ({cancelledAppointments.length})</button>
					<button className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('all')} style={{ padding: '6px 12px', fontSize: '14px' }}>All ({allAppointments.length})</button>
				</div>

				{/* Tab Content */}
				<ul className="card-list">
					{activeTab === 'today' && renderAppointmentList(todayAppointments, 'No appointments scheduled for today')}
					{activeTab === 'past' && renderAppointmentList(pastAppointments, 'No completed appointments found')}
					{activeTab === 'cancelled' && renderAppointmentList(cancelledAppointments, 'No cancelled appointments found')}
					{activeTab === 'all' && renderAppointmentList(allAppointments, 'No appointments found')}
				</ul>
			</motion.div>

			{/* Current Queue section now shows today's appointments with tokens */}
			<motion.div layout className="card">
				<div className="card-header">
					<h2 className="card-title">Current Queue</h2>
					<ClipboardList size={20} color="#0f766e" />
				</div>
				<ul className="card-list">
					{todayAppointments.length > 0 ? (
						todayAppointments
							.sort((a,b) => (a.token||0) - (b.token||0))
							.map((a) => (
								<li key={a.id} className="list-item">
									<span style={{ fontWeight: 600 }}>{a.patient}</span>
									<span className="badge">Token: {a.token ?? '-'}</span>
								</li>
							))
					) : (
						<li className="list-item"><span className="text-muted">No patients in queue</span></li>
					)}
				</ul>
			</motion.div>
		</div>
	);
}

export default DoctorDashboard;
