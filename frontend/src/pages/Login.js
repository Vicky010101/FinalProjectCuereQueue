import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [msg, setMsg] = useState("");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/login", form);

            // Save token + role
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.user.role);

            setMsg("Login successful! Redirecting...");

            // Redirect based on role
            if (res.data.user.role === "patient") {
                navigate("/patient-dashboard");
            } else if (res.data.user.role === "doctor") {
                navigate("/doctor-dashboard");
            } else if (res.data.user.role === "admin") {
                navigate("/manager-dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setMsg(err.response?.data?.msg || "Error occurred");
        }
    };

    return (
        <div className="container-responsive" style={{ paddingTop: 40, paddingBottom: 40 }}>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
                <h2 className="page-title" style={{ fontSize: 20 }}>Login</h2>
                <p className="page-subtitle">Welcome back. Enter your credentials to continue.</p>
                <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
                    <div className="form-field">
                        <label className="label">Email</label>
                        <input
                            className="input"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label className="label">Password</label>
                        <input
                            className="input"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 12 }}>
                        <LogIn size={16} />
                        Login
                    </button>
                </form>
                {msg && <p className="text-muted" style={{ marginTop: 12 }}>{msg}</p>}
            </motion.div>
        </div>
    );
}

export default Login;
