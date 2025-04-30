const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const patientsSchema = new mongoose.Schema({
  patient_Id: { type: String, default: uuidv4, unique: true }, // Primary Key
  userId: { type: String, required: true }, // Reference to user
  name: { type: String, required: true },
  birthdate: { type: Date, required: true },
  address: { type: String, required: true },
  contactNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Contact number must be 10 digits']
  },
  gmail: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid Gmail address']
  },
  profileImages: { type: [String] }, 
});

module.exports = mongoose.model('PatientRecords', patientsSchema); // Save to PatientRecords collection
