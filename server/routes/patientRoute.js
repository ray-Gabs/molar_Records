const express = require('express');
const multer = require('multer');
const processImage = require('../middleware/resizeImageMiddleware'); // Import the resizing middleware
const { createProfile, getProfile, deleteProfile } = require('../controllers/patientController'); // Assuming you have controllers set up

const router = express.Router();

// Multer setup for handling file uploads
const upload = multer({ dest: 'uploads/' });  // Adjust storage as needed

// Use the image processing middleware before the controller action
router.post('/create', upload.array('profileImages', 5), processImage, createProfile); // Handling multiple image uploads
router.get('/profile/:userId', getProfile);  // Route to get patient profile
router.delete('/profile/:userId', deleteProfile);  // Route to delete profile

module.exports = router;
