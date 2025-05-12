const Appointments = require('../models/appointment.models');

// Create new appointment
exports.createRecord = async (req, res) => {
  try {
    const { patientId, dentistId, appointmentDate, appointmentTime, status, remarks } = req.body;

    const newAppointment = new Appointments({
      patientId,
      dentistId,
      appointmentDate,
      appointmentTime,
      status,
      remarks
    });

    await newAppointment.save();

    res.status(201).json(newAppointment);
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ message: "Error creating appointment", error: err.message });
  }
};

// Get appointment by appointmentId
exports.getRecord = async (req, res) => {
  const { recordId } = req.params;

  try {
    const appointment = await Appointments.findOne({ appointmentId: recordId });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (err) {
    console.error("Error retrieving appointment:", err);
    res.status(500).json({ message: "Error retrieving appointment", error: err.message });
  }
};

// Get all appointments
exports.getAllRecord = async (req, res) => {
  try {
    const appointments = await Appointments.find();
    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Error fetching appointments", error: err.message });
  }
};

// Edit appointment by appointmentId
exports.editRecord = async (req, res) => {
  const { recordId } = req.params;
  const updateFields = req.body;

  try {
    const updated = await Appointments.findOneAndUpdate(
      { appointmentId: recordId },
      updateFields,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ message: "Error updating appointment", error: err.message });
  }
};

// Delete appointment by appointmentId
exports.deleteRecord = async (req, res) => {
  const { recordId } = req.params;

  try {
    const deleted = await Appointments.findOneAndDelete({ appointmentId: recordId });

    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ success: true, message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).json({ message: "Error deleting appointment", error: err.message });
  }
};
// Get all appointments by patient ID
exports.getAllAppointmentsByPatientId = async (req, res) => {
  const { patientId } = req.params;

  try {
    const appointments = await Appointments.find({ patientId });
    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching appointments by patient ID:", err);
    res.status(500).json({ message: "Error fetching appointments by patient ID", error: err.message });
  }
};

// Get all appointments by status (pending, confirmed, cancelled, completed)
exports.getAllAppointmentsByStatus = async (req, res) => {
  const { status } = req.params;

  try {
    const appointments = await Appointments.find({ status });
    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching appointments by status:", err);
    res.status(500).json({ message: "Error fetching appointments by status", error: err.message });
  }
};

// Edit appointment status to 'cancelled'
exports.cancelAppointment = async (req, res) => {
  const { appointmentId } = req.params;  // changed to appointmentId

  try {
    const updatedAppointment = await Appointments.findOneAndUpdate(
      { _id: appointmentId },  // changed recordId to appointmentId
      { status: 'cancelled' },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(updatedAppointment);
  } catch (err) {
    console.error("Error cancelling appointment:", err);
    res.status(500).json({ message: "Error cancelling appointment", error: err.message });
  }
};

// Get all appointments by status and patient ID
exports.getAllAppointmentsByStatusAndPatientId = async (req, res) => {
  const { status, patientId } = req.params;

  try {
    const appointments = await Appointments.find({ status, patientId });
    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching appointments by status and patient ID:", err);
    res.status(500).json({ message: "Error fetching appointments by status and patient ID", error: err.message });
  }
};