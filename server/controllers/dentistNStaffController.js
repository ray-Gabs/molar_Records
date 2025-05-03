const DentistRecords = require('../models/dentist.models');
const StaffRecords = require('../models/staff.models');
const User = require('../models/user.models');

// Dynamically resolve role-based model
function getRoleModel(baseUrl) {
  if (baseUrl.includes('/dentist')) return DentistRecords;
  if (baseUrl.includes('/staff')) return StaffRecords;
  throw new Error('Invalid role path');
}

// Create profile
exports.createProfile = async (req, res) => {
  const { userId, name, birthdate, address, contactNumber } = req.body;
  const profileImages = req.files; // Multer stores files in req.files, not req.body

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!profileImages || profileImages.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Process images using the middleware (resized images will be stored in profileImages)
    const processedImages = await processImages(profileImages); // Your image resizing logic

    // Create a new patient profile document
    const newProfile = new PatientRecords({
      userId: user.userId,
      name,
      birthdate,
      address,
      contactNumber,
      gmail: user.email,
      profileImages: processedImages, // Store resized images
    });

    await newProfile.save();
    res.status(201).json({ success: true, message: "Profile created successfully!" });
  } catch (err) {
    console.error("Error creating profile:", err);
    res.status(500).json({ message: "Error creating profile", error: err.message });
  }
};

// Get profile
exports.getProfile = async (req, res) => {
  const { userId } = req.params;
  const baseUrl = req.baseUrl;

  try {
    const RoleModel = getRoleModel(baseUrl);
    const profile = await RoleModel.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json({
      userId: profile.userId,
      name: profile.name,
      birthdate: profile.birthdate,
      address: profile.address,
      contactNumber: profile.contactNumber,
      profileImages: profile.profileImages,
    });
  } catch (err) {
    console.error("Error retrieving profile:", err);
    res.status(500).json({ message: "Error retrieving profile", error: err.message });
  }
};

// Delete profile
exports.deleteProfile = async (req, res) => {
  const { userId } = req.params;
  const baseUrl = req.baseUrl;

  try {
    const RoleModel = getRoleModel(baseUrl);
    const deleted = await RoleModel.findOneAndDelete({ userId });
    if (!deleted) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json({ success: true, message: "Profile deleted" });
  } catch (err) {
    console.error("Error deleting profile:", err);
    res.status(500).json({ message: "Error deleting profile", error: err.message });
  }
};
