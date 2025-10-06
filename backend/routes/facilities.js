const express = require("express");
const router = express.Router();
const Facility = require("../models/Facility");
const User = require("../models/User");
const Queue = require("../models/Queue");
const { auth, roleCheck } = require("../middleware/auth");

// List facilities with basic filters
router.get("/", async (req, res) => {
  try {
    const { q, specialization, minRating, nonEmergency } = req.query;
    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { specialties: { $elemMatch: { $regex: q, $options: "i" } } },
      ];
    }
    if (specialization) filter.specialties = specialization;
    if (minRating) filter.ratingAvg = { $gte: Number(minRating) };
    if (nonEmergency === "true") filter.emergency = false;
    const facilities = await Facility.find(filter).sort({ ratingAvg: -1 });
    res.json({ facilities });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Create facility (admin)
router.post("/", auth, roleCheck("admin"), async (req, res) => {
  try {
    const { name, address, specialties = [], capacity = 0 } = req.body;
    const f = await Facility.create({ name, address, specialties, capacity });
    res.status(201).json({ facility: f });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
});

// List doctors (basic directory) - only show users with doctor role
router.get("/doctors", auth, async (_req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("_id name email role");
    res.json({ doctors });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get facilities with queue data for patient dashboard
router.get("/with-queues", async (req, res) => {
  try {
    const facilities = await Facility.find().sort({ ratingAvg: -1 });
    
    // Get queue data for each facility
    const facilitiesWithQueues = await Promise.all(
      facilities.map(async (facility) => {
        try {
          const queue = await Queue.findOne({ facilityId: facility._id });
          return {
            ...facility.toObject(),
            queue: queue || null
          };
        } catch (error) {
          console.error(`Error fetching queue for facility ${facility._id}:`, error);
          return {
            ...facility.toObject(),
            queue: null
          };
        }
      })
    );
    
    res.json({ facilities: facilitiesWithQueues });
  } catch (e) {
    console.error('Error fetching facilities with queues:', e);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;






