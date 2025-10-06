import React, { useState } from "react";
import { Home, Send, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import API from "../api";

function HomeVisitRequest() {
	const [address, setAddress] = useState("");
	const [preferredTime, setPreferredTime] = useState("");
	const [notes, setNotes] = useState("");
	const [loading, setLoading] = useState(false);
	const [requestStatus, setRequestStatus] = useState(null);

	const submit = async (e) => {
		e.preventDefault();
		if (!address.trim()) {
			toast.error("Please enter your address");
			return;
		}

		setLoading(true);
		try {
			const response = await API.post('/homevisits', {
				address: address.trim(),
				preferredTime: preferredTime || null,
				notes: notes.trim() || null
			});

			setRequestStatus({
				id: response.data.request._id,
				status: response.data.request.status,
				etaMinutes: response.data.request.etaMinutes
			});

			toast.success("Home visit request submitted successfully!");
			
			// Reset form
			setAddress("");
			setPreferredTime("");
			setNotes("");
		} catch (error) {
			console.error('Error submitting home visit request:', error);
			toast.error("Failed to submit request. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case 'approved':
				return <CheckCircle size={16} color="#10b981" />;
			case 'rejected':
				return <XCircle size={16} color="#ef4444" />;
			case 'completed':
				return <CheckCircle size={16} color="#059669" />;
			default:
				return <Clock size={16} color="#f59e0b" />;
		}
	};

	const getStatusText = (status) => {
		switch (status) {
			case 'new':
				return 'Request Submitted';
			case 'approved':
				return 'Request Approved';
			case 'rejected':
				return 'Request Rejected';
			case 'completed':
				return 'Visit Completed';
			default:
				return 'Processing';
		}
	};

	return (
		<div className="card">
			<div className="card-header">
				<h3 className="card-title">Doctor Home Visit</h3>
				<Home size={20} color="#0f766e" />
			</div>
			
			{requestStatus ? (
				<div style={{ padding: 16, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8 }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
						{getStatusIcon(requestStatus.status)}
						<span style={{ fontWeight: 600, color: '#059669' }}>
							{getStatusText(requestStatus.status)}
						</span>
					</div>
					<p className="text-muted" style={{ fontSize: 14, margin: '4px 0' }}>
						Request ID: {requestStatus.id}
					</p>
					{requestStatus.etaMinutes && (
						<p className="text-muted" style={{ fontSize: 14, margin: '4px 0' }}>
							Estimated arrival time: {requestStatus.etaMinutes} minutes
						</p>
					)}
					<button 
						className="btn btn-sm" 
						onClick={() => setRequestStatus(null)}
						style={{ marginTop: 8 }}
					>
						Submit Another Request
					</button>
				</div>
			) : (
				<form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
					<div className="form-field">
						<label className="label">Address *</label>
						<textarea 
							className="input" 
							rows={3} 
							value={address} 
							onChange={(e) => setAddress(e.target.value)} 
							placeholder="Your full address" 
							required
						/>
					</div>
					<div className="grid grid-2">
						<div className="form-field">
							<label className="label">Preferred Time</label>
							<input 
								className="input" 
								type="datetime-local" 
								value={preferredTime} 
								onChange={(e) => setPreferredTime(e.target.value)} 
							/>
						</div>
						<div className="form-field">
							<label className="label">Notes</label>
							<input 
								className="input" 
								value={notes} 
								onChange={(e) => setNotes(e.target.value)} 
								placeholder="Symptoms or special instructions" 
							/>
						</div>
					</div>
					<button 
						className="btn btn-primary" 
						type="submit" 
						disabled={loading || !address.trim()}
					>
						{loading ? (
							<>
								<div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div>
								Submitting...
							</>
						) : (
							<>
								<Send size={16} /> 
								Submit Request
							</>
						)}
					</button>
					<p className="text-muted" style={{ fontSize: 12 }}>
						* Required field. A doctor will be assigned based on availability and location.
					</p>
				</form>
			)}
		</div>
	);
}

export default HomeVisitRequest;



