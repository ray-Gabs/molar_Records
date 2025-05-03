const express = require('express');
const multer = require('multer');
const processImage = require('../middleware/resizeImageMiddleware');
const { createProfile, getProfile, deleteProfile } = require('../controllers/dentistNStaffController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// CREATE profile (with image uploads)
router.post('/create', upload.array('profileImages', 5), processImage, createProfile);

// GET profile
router.get('/profile/:userId', getProfile);

// DELETE profile
router.delete('/profile/:userId', deleteProfile);

module.exports = router;
