import React, { useState } from "react";
import { queueBus } from "../lib/eventBus";

function QueueAdminPanel() {
	const [nowServing, setNowServing] = useState(10);
	const [eta, setEta] = useState(5);
	const [emergency, setEmergency] = useState(false);

	const publish = () => {
		queueBus.publishQueueUpdate({ nowServing, eta, emergency });
	};

	return (
		<div className="card" style={{ display: "grid", gap: 12 }}>
			<h3 className="card-title">Update Queue</h3>
			<div className="form-field">
				<label className="label">Now Serving</label>
				<input className="input" type="number" value={nowServing} onChange={(e) => setNowServing(parseInt(e.target.value || 0, 10))} />
			</div>
			<div className="form-field">
				<label className="label">Estimated Waiting Time (min)</label>
				<input className="input" type="number" value={eta} onChange={(e) => setEta(parseInt(e.target.value || 0, 10))} />
			</div>
			<label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
				<input type="checkbox" checked={emergency} onChange={(e) => setEmergency(e.target.checked)} /> Emergency overload
			</label>
			<button className="btn btn-primary" onClick={publish}>Publish Update</button>
		</div>
	);
}

export default QueueAdminPanel;



