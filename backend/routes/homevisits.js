const express = require("express");
const router = express.Router();
const HomeVisit = require("../models/HomeVisit");
const { auth, roleCheck } = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { address, preferredTime, notes } = req.body;
    const etaMinutes = 60 + Math.floor(Math.random() * 60);
    const hv = await HomeVisit.create({ patientId: req.user.id, address, preferredTime, notes, etaMinutes, status: "new" });
    res.status(201).json({ request: hv });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/", auth, roleCheck("admin"), async (_req, res) => {
  try {
    const list = await HomeVisit.find().sort({ createdAt: -1 });
    res.json({ requests: list });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/:id/status", auth, roleCheck("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await HomeVisit.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ request: updated });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;











