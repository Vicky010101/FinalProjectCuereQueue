const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Facility = require("./models/Facility");
const Queue = require("./models/Queue");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/curequeue", {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => console.log("✅ MongoDB Connected for seeding"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Facility.deleteMany({});
        await Queue.deleteMany({});
        console.log("🗑️  Cleared existing data");

        // Create test users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        const testUsers = [
            {
                name: "John Patient",
                email: "patient@test.com",
                password: hashedPassword,
                phone: "+1234567890",
                address: "123 Main St, City, State",
                role: "patient"
            },
            {
                name: "Dr. Sarah Smith",
                email: "doctor@test.com",
                password: hashedPassword,
                phone: "+1234567891",
                address: "456 Oak Ave, City, State",
                role: "doctor",
                specialization: "Cardiology"
            },
            {
                name: "Admin User",
                email: "admin@test.com",
                password: hashedPassword,
                phone: "+1234567892",
                address: "789 Pine Rd, City, State",
                role: "admin"
            }
        ];

        const users = await User.insertMany(testUsers);
        console.log("✅ Test users created successfully");


        // Create test facilities
        const testFacilities = [
            {
                name: "Apollo Hospitals",
                address: "Apollo Hospitals Enterprise Ltd, Mumbai",
                specialties: ["Cardiology", "Neurology", "Oncology", "Orthopedics", "Pediatrics"],
                ratingAvg: 4.6,
                capacity: 500,
                emergency: false
            },
            {
                name: "Fortis Hospital",
                address: "Fortis Hospital, Mulund West, Mumbai",
                specialties: ["Cardiology", "Neurology", "Orthopedics", "General Surgery"],
                ratingAvg: 4.4,
                capacity: 300,
                emergency: false
            },
            {
                name: "Kokilaben Dhirubhai Ambani Hospital",
                address: "Kokilaben Dhirubhai Ambani Hospital, Andheri West",
                specialties: ["Cardiology", "Neurology", "Oncology", "Pediatrics", "Transplant"],
                ratingAvg: 4.7,
                capacity: 750,
                emergency: true
            },
            {
                name: "Lilavati Hospital",
                address: "Lilavati Hospital, Bandra West, Mumbai",
                specialties: ["Cardiology", "Neurology", "Orthopedics", "General Medicine"],
                ratingAvg: 4.5,
                capacity: 400,
                emergency: false
            },
            {
                name: "Tata Memorial Hospital",
                address: "Tata Memorial Hospital, Parel, Mumbai",
                specialties: ["Medical Oncology", "Surgical Oncology", "Radiation Oncology", "Palliative Care"],
                ratingAvg: 4.8,
                capacity: 600,
                emergency: true
            }
        ];

        const facilities = await Facility.insertMany(testFacilities);
        console.log("✅ Test facilities created successfully");

        // Create test queue data
        const testQueues = [
            {
                facilityId: facilities[0]._id, // Apollo Hospitals
                doctorId: users.find(u => u.role === "doctor")._id,
                nowServing: 15,
                etaMinutes: 45,
                emergency: false
            },
            {
                facilityId: facilities[1]._id, // Fortis Hospital
                doctorId: users.find(u => u.role === "doctor")._id,
                nowServing: 8,
                etaMinutes: 25,
                emergency: false
            },
            {
                facilityId: facilities[2]._id, // Kokilaben Hospital
                doctorId: users.find(u => u.role === "doctor")._id,
                nowServing: 22,
                etaMinutes: 60,
                emergency: true
            },
            {
                facilityId: facilities[3]._id, // Lilavati Hospital
                doctorId: users.find(u => u.role === "doctor")._id,
                nowServing: 12,
                etaMinutes: 35,
                emergency: false
            },
            {
                facilityId: facilities[4]._id, // Tata Memorial Hospital
                doctorId: users.find(u => u.role === "doctor")._id,
                nowServing: 18,
                etaMinutes: 50,
                emergency: true
            }
        ];

        await Queue.insertMany(testQueues);
        console.log("✅ Test queue data created successfully");

        console.log("📧 Test credentials:");
        console.log("Patient: patient@test.com / password123");
        console.log("Doctor: doctor@test.com / password123");
        console.log("Admin: admin@test.com / password123");
        console.log("🏥 Created 5 test facilities with queue data");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding data:", error);
        process.exit(1);
    }
};

seedData();





