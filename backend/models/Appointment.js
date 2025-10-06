const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    facilityId: { type: mongoose.Schema.Types.ObjectId, ref: "Facility" },
    date: { type: String, required: true },
    time: { type: String, required: true },
    reason: { type: String },
    token: { type: Number },
    waitingTime: { type: Number, default: 0 },
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "confirmed" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);



