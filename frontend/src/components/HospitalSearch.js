import React, { useEffect, useMemo, useState } from "react";
import { Map, List, Search, AlertTriangle } from "lucide-react";
import API from "../api";

function kmPlaceholder() {
	// until we have geolocation, show a pseudo distance
	return (Math.random() * 8 + 1).toFixed(1);
}

function HospitalSearch() {
	const [query, setQuery] = useState("");
	const [view, setView] = useState("list");
	const [maxDistance, setMaxDistance] = useState(10);
	const [specialization, setSpecialization] = useState("");
	const [minRating, setMinRating] = useState(0);
	const [onlyNonEmergency, setOnlyNonEmergency] = useState(false);
	const [facilities, setFacilities] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let active = true;
		(async () => {
			try {
				setLoading(true);
				const res = await API.get("/facilities", {
					params: {
						q: query || undefined,
						specialization: specialization || undefined,
						minRating: minRating || undefined,
						nonEmergency: onlyNonEmergency || undefined,
					},
				});
				if (!active) return;
				setFacilities(res.data.facilities || []);
			} catch (_) {
				// ignore
			} finally {
				setLoading(false);
			}
		})();
		return () => {
			active = false;
		};
	}, [query, specialization, minRating, onlyNonEmergency]);

	const filtered = useMemo(() => {
		return (facilities || []).map((f) => ({
			id: f._id,
			name: f.name,
			distanceKm: parseFloat(kmPlaceholder()),
			specialties: f.specialties || [],
			waitRating: f.ratingAvg || 0,
			emergency: !!f.emergency,
		})).filter((h) => h.distanceKm <= maxDistance);
	}, [facilities, maxDistance]);

	return (
		<div className="card">
			<div className="card-header">
				<h3 className="card-title">Find Hospitals & Clinics</h3>
				<div style={{ display: "inline-flex", gap: 8 }}>
					<button className={`btn ${view === "list" ? "btn-primary" : ""}`} onClick={() => setView("list")}><List size={16} /> List</button>
					<button className={`btn ${view === "map" ? "btn-primary" : ""}`} onClick={() => setView("map")}><Map size={16} /> Map</button>
				</div>
			</div>
			<div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 16 }}>
				<div className="card" style={{ display: "grid", gap: 12 }}>
					<div className="form-field">
						<label className="label">Search</label>
						<div style={{ position: "relative" }}>
							<input className="input" placeholder="Search hospitals, specialties..." value={query} onChange={(e) => setQuery(e.target.value)} />
							<Search size={16} style={{ position: "absolute", right: 15, top: 12, color: "#94a3b8" }} />
						</div>
					</div>
					<div className="grid grid-2">
						<div className="form-field">
							<label className="label">Max Distance (km)</label>
							<input className="input" type="number" value={maxDistance} onChange={(e) => setMaxDistance(parseInt(e.target.value || 0, 10))} />
						</div>
						<div className="form-field">
							<label className="label">Min Rating</label>
							<input className="input" type="number" step="0.1" value={minRating} onChange={(e) => setMinRating(parseFloat(e.target.value || 0))} />
						</div>
						<div className="form-field">
							<label className="label">Specialization</label>
							<input className="input" placeholder="e.g., Cardiology" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
						</div>
						<label className="form-field" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
							<input type="checkbox" checked={onlyNonEmergency} onChange={(e) => setOnlyNonEmergency(e.target.checked)} /> Hide emergency-only facilities
						</label>
					</div>
				</div>
				<div className="card">
					{view === "list" ? (
						<ul className="card-list">
							{(loading ? [] : filtered).map((h) => (
								<li key={h.id} className="list-item">
									<div>
										<p style={{ fontWeight: 600 }}>{h.name}</p>
										<p className="text-muted" style={{ fontSize: 14 }}>{h.distanceKm} km • {h.specialties.join(", ")} • Rating {h.waitRating.toFixed ? h.waitRating.toFixed(1) : h.waitRating}
										</p>
									</div>
									{h.emergency && (
										<span className="badge badge-red" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
											<AlertTriangle size={14} /> Emergency
										</span>
									)}
								</li>
							))}
						</ul>
					) : (
						<div style={{ height: 280, border: "1px dashed #cbd5e1", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
							<p className="text-muted">Map view placeholder</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default HospitalSearch;



