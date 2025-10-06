const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // ✅ import bcrypt
const jwt = require("jsonwebtoken"); // ✅ import jwt
const User = require("../models/User");
const { auth } = require("../middleware/auth");

// Escape regex special characters in a string
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        const normalizedEmail = (email || "").toLowerCase().trim();

        const existingUser = await User.findOne({
            email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: "i" }
        });
        if (existingUser)
            return res.status(400).json({ msg: "Email already registered" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            phone,
            role: role || "patient", // default patient
        });

        await newUser.save();
        res.status(201).json({ 
            msg: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
                createdAt: newUser.createdAt
            }
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = (email || "").toLowerCase().trim();
        const user = await User.findOne({
            email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: "i" }
        });
        if (!user) {
            if (process.env.NODE_ENV !== "production") {
                console.log("[LOGIN] User not found for email:", normalizedEmail);
                return res.status(400).json({ msg: "Invalid credentials", code: "USER_NOT_FOUND" });
            }
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            if (process.env.NODE_ENV !== "production") {
                console.log("[LOGIN] Password mismatch for email:", normalizedEmail);
                return res.status(400).json({ msg: "Invalid credentials", code: "BAD_PASSWORD" });
            }
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const jwtSecret = process.env.JWT_SECRET || "dev_jwt_secret_change_me";
        const token = jwt.sign(
            { id: user._id, role: user.role },
            jwtSecret,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Current user endpoint
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.json({ user });
    } catch (e) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        
        // Check if email is being changed and if it's already taken
        if (email) {
            const normalizedEmail = (email || "").toLowerCase().trim();
            const existingUser = await User.findOne({
                email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: "i" },
                _id: { $ne: req.user.id }
            });
            if (existingUser) {
                return res.status(400).json({ msg: "Email already in use" });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, email, phone, address },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ user: updatedUser });
    } catch (e) {
        console.error("Profile update error:", e);
        res.status(500).json({ msg: "Server error" });
    }
});

// Admin routes - Get all users
router.get("/users", auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied. Admin only." });
        }

        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        res.json({ users });
    } catch (e) {
        console.error("Get users error:", e);
        res.status(500).json({ msg: "Server error" });
    }
});

// Admin routes - Update user
router.put("/users/:id", auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied. Admin only." });
        }

        const { name, email, phone, role } = req.body;
        
        // Check if email is being changed and if it's already taken
        if (email) {
            const normalizedEmail = (email || "").toLowerCase().trim();
            const existingUser = await User.findOne({
                email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: "i" },
                _id: { $ne: req.params.id }
            });
            if (existingUser) {
                return res.status(400).json({ msg: "Email already in use" });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, role },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ user: updatedUser });
    } catch (e) {
        console.error("Update user error:", e);
        res.status(500).json({ msg: "Server error" });
    }
});

// Admin routes - Delete user
router.delete("/users/:id", auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied. Admin only." });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ msg: "User deleted successfully" });
    } catch (e) {
        console.error("Delete user error:", e);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
