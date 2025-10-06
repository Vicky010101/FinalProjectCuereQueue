import React, { useState } from "react";
import QueueAdminPanel from "../components/QueueAdminPanel";

function AdminPortal() {
	const [form, setForm] = useState({ name: "", address: "", specialties: "", capacity: 0 });

	const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

	const submit = (e) => {
		e.preventDefault();
		alert("Hospital registered (mock)");
	};

	return (
		<div className="container-responsive" style={{ paddingTop: 24, paddingBottom: 24 }}>
			<h1 className="page-title">Hospital/Clinic Registration</h1>
			<p className="page-subtitle">Create your facility record to access the admin dashboard.</p>
			<div className="grid grid-2" style={{ marginTop: 16 }}>
				<form onSubmit={submit} className="card" style={{ display: "grid", gap: 12 }}>
					<div className="form-field">
						<label className="label">Name</label>
						<input className="input" name="name" value={form.name} onChange={update} />
					</div>
					<div className="form-field">
						<label className="label">Address</label>
						<textarea className="input" rows={3} name="address" value={form.address} onChange={update} />
					</div>
					<div className="grid grid-2">
						<div className="form-field">
							<label className="label">Specialties (comma-separated)</label>
							<input className="input" name="specialties" value={form.specialties} onChange={update} />
						</div>
						<div className="form-field">
							<label className="label">Capacity</label>
							<input className="input" type="number" name="capacity" value={form.capacity} onChange={update} />
						</div>
					</div>
					<button className="btn btn-primary" type="submit">Register Facility</button>
				</form>

				<div className="card">
					<h2 className="card-title">Admin Queue Controls</h2>
					<p className="text-muted">Update live queue info for patients.</p>
					<div style={{ marginTop: 12 }}>
						<QueueAdminPanel />
					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminPortal;



