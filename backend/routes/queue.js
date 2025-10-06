const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Queue = require("../models/Queue");
const Appointment = require("../models/Appointment");
const { auth, roleCheck } = require("../middleware/auth");

// Read queue by facility
router.get("/:facilityId", async (req, res) => {
  try {
    const q = await Queue.findOne({ facilityId: req.params.facilityId });
    res.json({ queue: q || null });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update queue (admin/doctor)
router.post("/:facilityId", auth, roleCheck("admin", "doctor"), async (req, res) => {
  try {
    const { nowServing, etaMinutes, emergency } = req.body;
    const q = await Queue.findOneAndUpdate(
      { facilityId: req.params.facilityId },
      { $set: { nowServing, etaMinutes, emergency } },
      { new: true, upsert: true }
    );
    res.json({ queue: q });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update individual patient waiting time (admin only)
router.post("/patient/:patientId/waiting-time", auth, roleCheck("admin"), async (req, res) => {
  try {
    const { waitingTime } = req.body;
    const { patientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ msg: "Invalid patient id" });
    }

    if (waitingTime < 0) {
      return res.status(400).json({ msg: "Waiting time cannot be negative" });
    }

    // Update all active appointments for this patient
    const updated = await Appointment.updateMany(
      { 
        patientId, 
        status: { $in: ['confirmed', 'pending'] },
        date: { $gte: new Date().toISOString().split('T')[0] } // Today and future dates
      },
      { waitingTime: parseInt(waitingTime) || 0 }
    );

    res.json({ 
      message: "Waiting time updated",
      updatedCount: updated.modifiedCount 
    });
  } catch (e) {
    console.error('Patient waiting time update error:', e);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get patient queue status
router.get("/patient/:patientId/status", auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Get today's appointments for the patient
    const today = new Date().toISOString().split('T')[0];
    const appointments = await Appointment.find({
      patientId,
      date: today,
      status: { $in: ['confirmed', 'pending'] }
    }).populate('doctorId', 'name');

    if (appointments.length === 0) {
      return res.json({ 
        inQueue: false, 
        message: "No appointments for today" 
      });
    }

    // Get queue status for the facility
    const queue = await Queue.findOne({ facilityId: appointments[0].facilityId });
    
    res.json({
      inQueue: true,
      appointments: appointments.map(apt => ({
        id: apt._id,
        doctorName: apt.doctorId?.name,
        time: apt.time,
        token: apt.token,
        waitingTime: apt.waitingTime || 0,
        status: apt.status
      })),
      queueStatus: queue ? {
        nowServing: queue.nowServing,
        etaMinutes: queue.etaMinutes,
        emergency: queue.emergency
      } : null
    });
  } catch (e) {
    console.error('Get patient queue status error:', e);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;



