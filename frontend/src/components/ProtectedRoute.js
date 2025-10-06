import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({ roles }) {
	const location = useLocation();
	const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
	const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

	if (!token) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	if (roles && Array.isArray(roles) && roles.length > 0) {
		if (!role || !roles.includes(role)) {
			return <Navigate to="/login" replace />;
		}
	}

	return <Outlet />;
}

export default ProtectedRoute;


