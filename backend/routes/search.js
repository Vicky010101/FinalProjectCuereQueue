const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { auth } = require("../middleware/auth");

// Search patients and doctors by name
router.get("/", auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ results: [] });
    }

    const searchQuery = new RegExp(q.trim(), 'i');
    
    // Search for doctors
    const doctors = await User.find({
      role: 'doctor',
      name: searchQuery
    }).select('name email specialization hospital').limit(5);

    // Search for patients
    const patients = await User.find({
      role: 'patient',
      name: searchQuery
    }).select('name email').limit(5);

    const results = [
      ...doctors.map(d => ({
        type: 'doctor',
        name: d.name,
        specialization: d.specialization || 'General Medicine',
        hospital: d.hospital || 'General Hospital',
        email: d.email
      })),
      ...patients.map(p => ({
        type: 'patient',
        patientName: p.name,
        email: p.email
      }))
    ];

    res.json({ results });
  } catch (e) {
    console.error('Search error:', e);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;








