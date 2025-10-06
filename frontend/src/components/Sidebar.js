import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, User, CalendarDays, Settings, Search, BookOpenText, Star, Shield, MapPin, Users } from "lucide-react";

function Sidebar({ isOpen, onClose }) {
	const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
	return (
		<aside className={`sidebar ${isOpen ? "open" : ""}`}>
			<nav>
				<NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
					<LayoutDashboard size={16} />
					Dashboard
				</NavLink>
				<NavLink to="/search" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
					<Search size={16} />
					Search
				</NavLink>
				{role === "patient" && (
					<NavLink to="/map" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
						<MapPin size={16} />
						Find Doctors
					</NavLink>
				)}
				<NavLink to="/book" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
					<BookOpenText size={16} />
					Book
				</NavLink>
				<NavLink to="/reviews" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
					<Star size={16} />
					Reviews
				</NavLink>
				<NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
					<User size={16} />
					Profile
				</NavLink>
				<NavLink to="/appointments" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
					<CalendarDays size={16} />
					Appointments
				</NavLink>
				<NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
					<Settings size={16} />
					Settings
				</NavLink>
				{role === "admin" && (
					<>
						<NavLink to="/manager-dashboard" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
							<Shield size={16} />
							Manager Dashboard
						</NavLink>
					</>
				)}
			</nav>
		</aside>
	);
}

export default Sidebar;


