import React, { useMemo, useState } from "react";
import { Star } from "lucide-react";

const INITIAL = [
	{ id: 1, name: "Aarav", stars: 5, comment: "Quick service, friendly staff." },
	{ id: 2, name: "Diya", stars: 4, comment: "Clean and efficient." },
];

function StarRow({ stars }) {
	return (
		<div style={{ display: "inline-flex", gap: 2 }}>
			{Array.from({ length: 5 }).map((_, i) => (
				<Star key={i} size={16} color={i < stars ? "#0f766e" : "#cbd5e1"} fill={i < stars ? "#0f766e" : "transparent"} />
			))}
		</div>
	);
}

function ReviewsSection() {
	const [reviews, setReviews] = useState(INITIAL);
	const [stars, setStars] = useState(5);
	const [comment, setComment] = useState("");

	const avg = useMemo(() => {
		if (!reviews.length) return 0;
		return (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1);
	}, [reviews]);

	const add = (e) => {
		e.preventDefault();
		if (!comment.trim()) return;
		setReviews((r) => [{ id: Date.now(), name: "You", stars, comment }, ...r]);
		setComment("");
	};

	return (
		<div className="card">
			<div className="card-header">
				<h3 className="card-title">Patient Reviews</h3>
				<div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
					<StarRow stars={Math.round(avg)} />
					<span className="text-muted">Avg {avg}</span>
				</div>
			</div>
			<form onSubmit={add} style={{ display: "grid", gap: 12 }}>
				<div className="grid grid-2">
					<div className="form-field">
						<label className="label">Rating</label>
						<select className="input" value={stars} onChange={(e) => setStars(parseInt(e.target.value, 10))}>
							{[5,4,3,2,1].map((s) => <option key={s} value={s}>{s} stars</option>)}
						</select>
					</div>
					<div className="form-field">
						<label className="label">Comment</label>
						<input className="input" placeholder="Write your feedback" value={comment} onChange={(e) => setComment(e.target.value)} />
					</div>
				</div>
				<button className="btn btn-primary" type="submit">Submit Review</button>
			</form>
			<ul className="card-list">
				{reviews.map((r) => (
					<li key={r.id} className="list-item">
						<div>
							<p style={{ fontWeight: 600 }}>{r.name}</p>
							<p className="text-muted" style={{ fontSize: 14 }}>{r.comment}</p>
						</div>
						<StarRow stars={r.stars} />
					</li>
				))}
			</ul>
		</div>
	);
}

export default ReviewsSection;



