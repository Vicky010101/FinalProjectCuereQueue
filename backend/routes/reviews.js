const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Facility = require("../models/Facility");
const { auth } = require("../middleware/auth");

router.get("/:facilityId", async (req, res) => {
  try {
    const reviews = await Review.find({ facilityId: req.params.facilityId }).sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/:facilityId", auth, async (req, res) => {
  try {
    const { stars, comment } = req.body;
    const r = await Review.create({ facilityId: req.params.facilityId, userId: req.user.id, stars, comment });
    // update facility average
    const agg = await Review.aggregate([
      { $match: { facilityId: r.facilityId } },
      { $group: { _id: "$facilityId", avg: { $avg: "$stars" }, count: { $sum: 1 } } }
    ]);
    if (agg.length) {
      await Facility.findByIdAndUpdate(r.facilityId, { ratingAvg: agg[0].avg, ratingCount: agg[0].count });
    }
    res.status(201).json({ review: r });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;











