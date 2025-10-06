const Appointment = require("../models/Appointment");
const User = require("../models/User");
const nodemailer = require("nodemailer");

exports.bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, reason } = req.body;

    if (!patientId || !doctorId || !date) {
      return res.status(400).json({ msg: "Patient, doctor, and date are required" });
    }

    // Compute IST current date/time
    const nowUtc = new Date();
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
    const parts = Object.fromEntries(fmt.formatToParts(nowUtc).map(p => [p.type, p.value]));
    const istDate = `${parts.year}-${parts.month}-${parts.day}`;
    const istTime = `${parts.hour}:${parts.minute}`;

    // Calculate waiting time: number of appointments already booked with this doctor for today (IST)
    const todayCount = await Appointment.countDocuments({
      doctorId,
      date: istDate,
      status: { $in: ['confirmed', 'pending'] }
    });
    const waitingTime = todayCount * 5; // minutes

    // Save appointment with IST booking time
    const appointment = new Appointment({ patientId, doctorId, date, time: istTime, reason, status: 'confirmed', waitingTime });
    await appointment.save();

    // Fetch patient and doctor info
    const patient = await User.findById(patientId);
    const doctor = await User.findById(doctorId);

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patient?.email || "",
      subject: "Appointment Confirmation",
      text: `Dear ${patient?.name},\n\nYour appointment with Dr. ${doctor?.name} is booked at ${istTime} (IST) on ${date}.\nEstimated waiting time: ${waitingTime} minutes.\n\nThank you for using CureQueue!`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ msg: "Appointment booked successfully", appointment, appointmentTimeIST: istTime, waitingTime });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
