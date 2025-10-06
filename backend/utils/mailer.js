
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

function sendAppointmentConfirmation({ to, patientName, doctorName, appointmentTimeIST, waitingTime }) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Appointment Confirmation',
        html: `<p>Dear ${patientName},</p>
               <p>Your appointment has been successfully booked.</p>
               <p><strong>Doctor:</strong> ${doctorName}</p>
               <p><strong>Appointment Time (IST):</strong> ${appointmentTimeIST}</p>
               <p><strong>Estimated Waiting Time:</strong> ${waitingTime} minutes</p>
               <p>Thank you for using CureQueue!</p>`
    };
    return transporter.sendMail(mailOptions);
}

function sendAppointmentCancellationByDoctor({ to, patientName, doctorName, date, time }) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Your Appointment Has Been Cancelled',
        html: `<p>Hello ${patientName},</p>
               <p>We regret to inform you that your appointment with Dr. ${doctorName} on ${date} at ${time} has been cancelled by the doctor.</p>
               <p>If needed, please book a new appointment at your convenience.</p>
               <p>Thank you for using CureQueue.</p>
               <p>Best regards,<br/>CureQueue Team</p>`
    };
    return transporter.sendMail(mailOptions);
}

function sendAppointmentCancellationByPatient({ to, patientName, doctorName, date, time }) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Your Appointment Has Been Successfully Cancelled',
        html: `<p>Hello ${patientName},</p>
               <p>This is to confirm that your appointment with Dr. ${doctorName} on ${date} at ${time} has been successfully cancelled as per your request.</p>
               <p>If you wish, you can book a new appointment anytime through CureQueue.</p>
               <p>Thank you,<br/>CureQueue Team</p>`
    };
    return transporter.sendMail(mailOptions);
}

function sendAppointmentWaitingTimeUpdate({ to, patientName, doctorName, status, waitingTime }) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Your Appointment Has Been Updated',
        html: `<p>Dear ${patientName},</p>
               <p>Your appointment with Dr. ${doctorName} has been updated.</p>
               <p><strong>Status:</strong> ${status}</p>
               <p><strong>Estimated Wait Time:</strong> ${waitingTime} minutes</p>
               <p>Thank you for using CureQueue.</p>`
    };
    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendAppointmentConfirmation,
    sendAppointmentCancellationByDoctor,
    sendAppointmentCancellationByPatient,
    sendAppointmentWaitingTimeUpdate
};
