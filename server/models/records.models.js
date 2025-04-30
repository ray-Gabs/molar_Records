const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const recordsSchema = new mongoose.Schema({
  recordsId: { type: String, default: uuidv4, unique: true }, // Primary Key
  patientId: { type: String, required: true },
  appointmentId: { type: String, required: true },
  dentistId: { type: String, required: true },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  images: [{ type: String }], // Array of Base64 image strings
  fine: { type: mongoose.Types.Decimal128, default: 0.0 },
  fineStatus: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid'
  },
  visitDate: { type: Date, required: true },
  appointmentCreatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DentalRecords', recordsSchema);
