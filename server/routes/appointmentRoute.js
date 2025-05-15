// routes/recordroute.js
const express = require('express');
const processImage = require('../middleware/resizeImageMiddleware');
const { createAppointment, 
    getAppointment, 
    deleteAppointment,
    getAllAppointmentsByStatusAndDentistId, 
    getAllAppointmentsByStatusAndPatientId 
    ,editAppointment
    ,cancelAppointment, 
    confirmAppointment,
    getAllAppointment,
    getAllAppointmentsByPatientId,
    getSpecificDentistByUserId,
    getAllAppointmentsByStatus} 
    = require('../controllers/appointmentController');
const router = express.Router();



//create appointment
router.post('/create', createAppointment);
// Get all appointments
router.get('/getall', getAllAppointment);

// Get appointments by appointmentId
router.get('/:recordId', getAppointment);

// Edit appointments by appointmentId


// Delete appointments by appointmentId
router.delete('/delete/:appointmentId', deleteAppointment);

// Get all appointments by patientId
router.get('/patient/:patientId', getAllAppointmentsByPatientId);
// Get all appointments by status
router.get('/status/:status', getAllAppointmentsByStatus);
//confirm appointment by appointmentId
router.put('/confirm/:appointmentId', confirmAppointment);
// Cancel appointment by appointmentId
router.put('/cancel/:appointmentId', cancelAppointment);
//get all appointments by status and patientId
router.get('/status/:status/patient/:patientId', getAllAppointmentsByStatusAndPatientId);
//get all appointments by status and dentistId
router.get('/status/:status/:dentistId', getAllAppointmentsByStatusAndDentistId);

//get dentist by userId

router.put('/edit/:appointmentId', editAppointment);
module.exports = router;