import React, { useEffect, useMemo, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";
import { CalendarDays, CheckCircle, XCircle, Pencil, Clock, Search } from "lucide-react";
import { toast } from "sonner";

function ManagerDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editWaiting, setEditWaiting] = useState(0);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadAllAppointments = async () => {
    try {
      const res = await API.get('/appointments/admin');
      setAppointments(res.data.appointments || []);
    } catch (e) {
      console.error('Load appointments error:', e);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAllAppointments(); }, []);

  const completeAppointment = async (id) => {
    if (!window.confirm('Mark this appointment as completed?')) return;
    try {
      await API.patch(`/appointments/${id}/complete`);
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'completed' } : a));
      toast.success('Appointment marked as completed');
    } catch (e) {
      console.error('Complete error:', e);
      toast.error('Failed to complete');
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await API.patch(`/appointments/${id}/cancel`);
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'cancelled' } : a));
      toast.success('Appointment cancelled');
    } catch (e) {
      console.error('Cancel error:', e);
      toast.error('Failed to cancel');
    }
  };

  const openEdit = (apt) => {
    setEditingId(apt._id);
    setEditWaiting(parseInt(apt.waitingTime || 0, 10));
  };

  const saveEdit = async () => {
    try {
      await API.post(`/appointments/${editingId}/waiting-time`, { waitingTime: parseInt(editWaiting) || 0 });
      // Reload to reflect server-side recalculation and sorting
      await loadAllAppointments();
      toast.success('Waiting time updated');
      setEditingId(null);
    } catch (e) {
      console.error('Update error:', e);
      toast.error('Failed to update waiting time');
    }
  };

  const statusBadgeClass = (status) => {
    if (status === 'completed') return 'badge badge-green';
    if (status === 'cancelled') return 'badge badge-red';
    return 'badge badge-blue';
  };

  const todayStr = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const filteredAppointments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return appointments.filter(a => {
      const matchesSearch = !q || (a.patientName || '').toLowerCase().includes(q) || (a.doctorName || '').toLowerCase().includes(q);
      let matchesFilter = true;
      if (filter === 'today') matchesFilter = a.date === todayStr;
      if (filter === 'pending') matchesFilter = a.status === 'confirmed';
      if (filter === 'completed') matchesFilter = a.status === 'completed';
      if (filter === 'cancelled') matchesFilter = a.status === 'cancelled';
      return matchesSearch && matchesFilter;
    });
  }, [appointments, filter, searchQuery, todayStr]);

  return (
    <div className="container-responsive" style={{ paddingTop: 24, paddingBottom: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <h1 className="page-title">Manager Dashboard</h1>
        <p className="page-subtitle">Manage the patient queue: update, complete, or cancel appointments.</p>
      </div>

      <motion.div layout className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <h2 className="card-title">Appointments Queue</h2>
          <CalendarDays size={20} color="#0f766e" />
        </div>

        {/* Toolbar: search + filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', margin: '8px 0 12px 0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Search size={14} color="#6b7280" />
            <input
              className="input"
              placeholder="Search patient or doctor"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 220 }}
            />
          </div>
          <div style={{ display: 'inline-flex', gap: 6, flexWrap: 'wrap' }}>
            <button className={`btn ${filter === 'all' ? 'btn-primary btn-pill' : 'btn-outline btn-pill'}`} onClick={() => setFilter('all')}>All</button>
            <button className={`btn ${filter === 'today' ? 'btn-primary btn-pill' : 'btn-outline btn-pill'}`} onClick={() => setFilter('today')}>Today</button>
            <button className={`btn ${filter === 'pending' ? 'btn-primary btn-pill' : 'btn-outline btn-pill'}`} onClick={() => setFilter('pending')}>Pending</button>
            <button className={`btn ${filter === 'completed' ? 'btn-primary btn-pill' : 'btn-outline btn-pill'}`} onClick={() => setFilter('completed')}>Completed</button>
            <button className={`btn ${filter === 'cancelled' ? 'btn-primary btn-pill' : 'btn-outline btn-pill'}`} onClick={() => setFilter('cancelled')}>Cancelled</button>
          </div>
        </div>

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : (
          <div className="table-modern">
            <div className="table-row table-header">
              <div className="table-cell">Patient</div>
              <div className="table-cell">Doctor</div>
              <div className="table-cell">Date</div>
              <div className="table-cell">Time (IST)</div>
              <div className="table-cell">Status</div>
              <div className="table-cell">Waiting</div>
              <div className="table-cell" style={{ textAlign: 'right' }}>Actions</div>
            </div>
            {[...filteredAppointments].sort((a,b) => (a.waitingTime||0) - (b.waitingTime||0)).map((a) => (
              <div key={a._id} className="table-row">
                <div className="table-cell">{a.patientName || 'Patient'}</div>
                <div className="table-cell">{a.doctorName || 'Doctor'}</div>
                <div className="table-cell">{a.date}</div>
                <div className="table-cell">{a.time}</div>
                <div className="table-cell">
                  <span className={statusBadgeClass(a.status)}>{a.status}</span>
                </div>
                <div className="table-cell" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} color="#6b7280" /> {a.waitingTime || 0} min
                </div>
                <div className="table-cell" style={{ textAlign: 'right' }}>
                  {editingId === a._id ? (
                    <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                      <input 
                        className="input" 
                        type="number" 
                        style={{ width: 80 }} 
                        value={editWaiting} 
                        onChange={(e) => setEditWaiting(e.target.value)}
                      />
                      <button className="btn btn-primary btn-sm" onClick={saveEdit}>Save</button>
                      <button className="btn btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm" title="Update waiting time" onClick={() => openEdit(a)}><Pencil size={12} /> Update</button>
                      {a.status !== 'completed' && (
                        <button className="btn btn-outline btn-sm" title="Complete" onClick={() => completeAppointment(a._id)}>
                          <CheckCircle size={12} /> Complete
                        </button>
                      )}
                      {a.status !== 'cancelled' && (
                        <button className="btn btn-outline btn-sm" title="Cancel" onClick={() => cancelAppointment(a._id)}>
                          <XCircle size={12} /> Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ManagerDashboard;
