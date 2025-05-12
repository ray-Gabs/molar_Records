// controllers/patientController.js
const PatientRecords = require('../models/patient.models');
const fs = require('fs');

// Create new patient profile
exports.createProfile = async (req, res) => {
  try {
    const { userId, name, birthdate, contactNumber, address, profileImages } = req.body;

    let profileImagePath = null;

    // Handle base64 image and save to file
    if (profileImages && profileImages.length > 0) {
      const base64Data = profileImages[0].replace(/^data:image\/\w+;base64,/, ''); // Strip prefix
      const buffer = Buffer.from(base64Data, 'base64');
      profileImagePath = `uploads/profile_${Date.now()}.png`;
      fs.writeFileSync(profileImagePath, buffer);
    }

    // Create profile data
    const newProfile = new PatientRecords({
      userId,
      name,
      birthdate,
      contactNumber,
      address,
      profileImage: profileImagePath,
    });

    await newProfile.save();

    // Convert saved image to base64 for frontend response
    let base64Image = null;
    if (newProfile.profileImage && fs.existsSync(newProfile.profileImage)) {
      const imageBuffer = fs.readFileSync(newProfile.profileImage);
      base64Image = imageBuffer.toString("base64");
    }

    res.status(200).json({
      userId: newProfile.userId,
      name: newProfile.name,
      birthdate: newProfile.birthdate,
      address: newProfile.address,
      contactNumber: newProfile.contactNumber,
      profileImages: base64Image ? `data:image/png;base64,${base64Image}` : null,
    });

  } catch (err) {
    console.error("Error creating profile:", err);
    res.status(500).json({ message: "Error creating profile", error: err.message });
  }
};

// Get patient profile by userId
exports.getProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await PatientRecords.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    let base64Image = null;
    if (profile.profileImage && fs.existsSync(profile.profileImage)) {
      const imageBuffer = fs.readFileSync(profile.profileImage);
      base64Image = imageBuffer.toString("base64");
    }

    res.status(200).json({
      patientId: profile.patient_Id, 
      userId: profile.userId,
      name: profile.name,
      birthdate: profile.birthdate,
      address: profile.address,
      contactNumber: profile.contactNumber,
      profileImage: base64Image ? `data:image/png;base64,${base64Image}` : null,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};


// Edit profile by userId
exports.editProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, birthdate, address, contactNumber, profileImages } = req.body;

  try {
    const existingProfile = await PatientRecords.findOne({ userId });
    if (!existingProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    let profileImagePath = existingProfile.profileImage;

    // Handle new image upload if provided as base64 in profileImages[0]
    if (
      Array.isArray(profileImages) &&
      profileImages.length > 0 &&
      profileImages[0].startsWith('data:image')
    ) {
      if (profileImagePath && fs.existsSync(profileImagePath)) {
        fs.unlinkSync(profileImagePath);
      }

      const base64Data = profileImages[0].replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      profileImagePath = `uploads/profile_${Date.now()}.png`;
      fs.writeFileSync(profileImagePath, buffer);
    }

    // Update the profile
    const updatedProfile = await PatientRecords.findOneAndUpdate(
      { userId },
      {
        name,
        birthdate,
        address,
        contactNumber,
        profileImage: profileImagePath,
      },
      { new: true }
    );

    // Convert saved image to base64 to send back to frontend
    let base64Image = null;
    if (updatedProfile.profileImage && fs.existsSync(updatedProfile.profileImage)) {
      const imageBuffer = fs.readFileSync(updatedProfile.profileImage);
      base64Image = imageBuffer.toString('base64');
    }

    res.status(200).json({
      userId: updatedProfile.userId,
      name: updatedProfile.name,
      birthdate: updatedProfile.birthdate,
      address: updatedProfile.address,
      contactNumber: updatedProfile.contactNumber,
      profileImage: base64Image ? `data:image/png;base64,${base64Image}` : null,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};


// Delete profile
exports.deleteProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const deleted = await PatientRecords.findOneAndDelete({ userId });

    if (!deleted) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ success: true, message: "Profile deleted successfully" });
  } catch (err) {
    console.error("Error deleting profile:", err);
    res.status(500).json({ message: "Error deleting profile", error: err.message });
  }
};
