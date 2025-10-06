const mongoose = require("mongoose");

const QueueSchema = new mongoose.Schema(
  {
    facilityId: { type: mongoose.Schema.Types.ObjectId, ref: "Facility", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    nowServing: { type: Number, default: 0 },
    etaMinutes: { type: Number, default: 0 },
    emergency: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Queue", QueueSchema);











