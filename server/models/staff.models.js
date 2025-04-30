const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const staffSchema = new mongoose.Schema({
    staffId: { type: String, default: uuidv4, unique: true },
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true},
    contactNumber: { type: String, required: true},
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'] // Optional regex validation for email format
    }
});

module.exports = mongoose.model('Staff', staffSchema);