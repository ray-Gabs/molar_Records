const Records = require('../models/records.models');

exports.createRecord = async (req, res) => {
  try {
    const {
      appointmentId,
      patientId,
      dentistId,
      diagnosis,
      treatment,
      images,
      visitDate
    } = req.body;

    const newRecord = new Records({
      appointmentId,
      patientId,
      dentistId,
      diagnosis,
      treatment,
      images,
      visitDate,
    });

    await newRecord.save();

    res.status(201).json({ message: 'Record created successfully', record: newRecord });
  } catch (err) {
    console.error("Error creating record:", err);
    res.status(500).json({ message: "Failed to create record", error: err.message });
  }
};
