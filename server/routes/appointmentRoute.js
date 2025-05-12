// routes/recordroute.js
const express = require('express');
const processImage = require('../middleware/resizeImageMiddleware');
const { createRecord, getRecord, deleteRecord, getAllAppointmentsByStatusAndPatientId ,editRecord,cancelAppointment, getAllRecord,getAllAppointmentsByPatientId,getAllAppointmentsByStatus} = require('../controllers/appointmentController');
const router = express.Router();


//create Record
router.post('/create', processImage, createRecord); 

// Get all Record
router.get('/getall', getAllRecord);

// Get Record by recordId
router.get('/:recordId', getRecord);

// Edit Record by recordId
router.put('/edit/:recordId', editRecord);

// Delete Record by recordId
router.delete('/delete/:recordId', deleteRecord);

// Get all appointments by patientId
router.get('/:patientId', getAllAppointmentsByPatientId);
// Get all appointments by status
router.get('/:status', getAllAppointmentsByStatus);
// Cancel appointment by appointmentId
router.put('/cancel/:appointmentId', cancelAppointment);
//get all appointments by status and patientId
router.get('/:status/:patientId', getAllAppointmentsByStatusAndPatientId);
module.exports = router;