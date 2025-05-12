// routes/staffroute.js
const express = require('express');
const multer = require('multer');
const processImage = require('../middleware/resizeImageMiddleware');
const { createProfile, getProfile, deleteProfile, editProfile, getAllDentists,getDentistByDentistId} = require('../controllers/dentistController');
const router = express.Router();

// Multer setup for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Get all dentists
router.get('/profile', getAllDentists);
// Use the image processing middleware before the controller action
router.post('/create', upload.array('profileImages', 5), processImage, createProfile); 

// Get profile by userId
router.get('/profile/:userId', getProfile);

// Edit profile by userId
router.put('/profile/:userId', editProfile);

// Delete profile by userId
router.delete('/profile/:userId', deleteProfile);
// Get dentist by dentistId
router.get('/profile/:dentistId', getDentistByDentistId);

module.exports = router;