import React from "react";
import { predictWaitTime } from "../lib/predictWaitTime";
import { ListChecks } from "lucide-react";

function Row({ label, value, strong }) {
	return (
		<div>
			<p className="text-muted" style={{ fontSize: 14, margin: 0 }}>{label}</p>
			<p style={{ fontSize: strong ? 28 : 16, fontWeight: strong ? 700 : 600, color: strong ? "#0f766e" : undefined, marginTop: 2 }}>{value}</p>
		</div>
	);
}

function QueueStatusCard({ nowServing, yourNumber, doctorName, queueLength, doctorsOnDuty = 1, avgServiceMinutes = 7, emergency }) {
	const predicted = predictWaitTime({ queueLength, avgServiceMinutes, doctorsOnDuty });
	return (
		<div className="card">
			<div className="card-header">
				<h3 className="card-title">Queue Status</h3>
				<ListChecks size={20} color="#0f766e" />
			</div>
			<div className="card" style={{ background: "#f8fafc" }}>
				<Row label="Doctor" value={doctorName || "—"} />
				<div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginTop: 8 }}>
					<Row label="Now Serving" value={nowServing ?? "—"} />
					<Row label="Your Number" value={yourNumber ?? "—"} strong />
					<Row label="Predicted wait" value={`${isNaN(predicted) ? "—" : predicted + " min"}`} />
				</div>
				{typeof emergency === "boolean" && emergency && (
					<div style={{ marginTop: 12 }}>
						<span className="badge badge-red">Emergency overload - delays expected</span>
					</div>
				)}
			</div>
		</div>
	);
}

export default QueueStatusCard;



