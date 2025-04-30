const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true, unique: true }, // Primary Key
  patientId: { type: String, required: true },
  dentistId: { type: String, required: true },
  appointmentDate: { type: Date, required: true }, // Date part
  appointmentTime: { type: String, required: true }, // Store time as string (e.g., '14:30')
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  remarks: { type: String } // Optional remarks field
});

module.exports = mongoose.model('Appointments', appointmentSchema);