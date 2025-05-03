const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffId: { type: String, default: uuidv4, unique: true },
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  birthdate: { type: Date, required: true },
  address: { type: String, required: true },
  contactNumber: {
    type: String,
    required: true,
    match: [/^\d+$/, 'Contact number must contain only digits']
  },
  profileImages: { type: [String] },
});

module.exports = mongoose.model('Staff', staffSchema);
