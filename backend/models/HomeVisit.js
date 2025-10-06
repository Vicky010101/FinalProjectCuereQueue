const mongoose = require("mongoose");

const HomeVisitSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    address: { type: String, required: true },
    preferredTime: { type: Date },
    notes: { type: String },
    etaMinutes: { type: Number },
    status: { type: String, enum: ["new", "approved", "rejected", "completed"], default: "new" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeVisit", HomeVisitSchema);











