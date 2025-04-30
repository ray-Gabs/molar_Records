// controllers/patientController.js
const PatientRecords = require('../models/patient.models');
const User = require('../models/user.models');

// Create patient profile with image upload
exports.createProfile = async (req, res) => {
  const { userId, name, birthdate, address, contactNumber } = req.body;
  const profileImages = req.body.profileImages;  // Resized images from middleware

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!profileImages || profileImages.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Create a new patient profile document
    const newProfile = new PatientRecords({
      userId: user.userId,
      name,
      birthdate,
      address,
      contactNumber,
      gmail: user.email,
      profileImages, // Store resized base64 images
    });

    await newProfile.save();
    res.status(201).json({ success: true, message: "Profile created successfully!" });
  } catch (err) {
    console.error("Error creating profile:", err);
    res.status(500).json({ message: "Error creating profile", error: err.message });
  }
};

// Get profile by userId
exports.getProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const patientProfile = await PatientRecords.findOne({ userId });

    if (!patientProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      patient_Id: patientProfile.patient_Id,
      userId: patientProfile.userId,
      name: patientProfile.name,
      birthdate: patientProfile.birthdate,
      address: patientProfile.address,
      contactNumber: patientProfile.contactNumber,
      gmail: patientProfile.gmail,
      profileImages: patientProfile.profileImages,  // Send back resized images
    });
  } catch (err) {
    console.error("Error retrieving profile:", err);
    res.status(500).json({ message: "Error retrieving profile", error: err.message });
  }
};
