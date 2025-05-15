/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import ClientSidebar from "../UserFiling/ClientSidebar";
import { styled } from '@mui/material/styles';
import {
  Table, TableBody, TableCell, tableCellClasses,
  TableContainer, TableHead, TableRow, Paper, TablePagination, Button,
  Modal, Box, TextField
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import imageCompression from 'browser-image-compression';
import './ManageAppointment.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function ManageAppointment() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [dentistId, setDentistId] = useState('');
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const userId = sessionStorage.getItem("userId");
  const role = sessionStorage.getItem("role");

      const fetchAppointments = async (status, loadedDentistId = dentistId) => {
        setLoading(true);
        try {
          let res;

          if (role === 'staff') {
            res = status === 'all'
              ? await axios.get('http://localhost:1337/appointment/getall')
              : await axios.get(`http://localhost:1337/appointment/status/${status}`);
          } else if (role === 'dentist' && loadedDentistId) {
            res = await axios.get(`http://localhost:1337/appointment/status/${status}/${loadedDentistId}`);
          }

          const appointmentsWithDentists = await Promise.all(res.data.map(async (appointment) => {
            let dentistName = "Unknown";

            if (appointment.dentistId && appointment.dentistId.length > 10) {
              try {
                // ✅ Use correct endpoint for dentistId
                const dentistRes = await axios.get(`http://localhost:1337/staff/profile/dentist/${appointment.dentistId}`);
                dentistName = dentistRes.data?.name || "Unknown";
              } catch (err) {
                console.warn(`Dentist not found for ID ${appointment.dentistId}`);
              }
            }

            return { ...appointment, dentistName };
          }));

          setRecords(appointmentsWithDentists);
        } catch (err) {
          console.error("Error fetching appointments:", err);
        }
        setLoading(false);
      };

      
useEffect(() => {
  const init = async () => {
    setLoading(true);
    if (role === 'dentist') {
      try {
        const res = await axios.get(`http://localhost:1337/dentist/profile/user/${userId}`);
        console.log("Dentist profile response:", res.data); // For debugging

        if (res.data.dentistId) {
          setDentistId(res.data.dentistId);
          await fetchAppointments(statusFilter, res.data.dentistId);
        } else {
          console.error("Dentist ID not found in profile");
        }
      } catch (err) {
        console.error("Failed to fetch dentist profile:", err);
      }
    } else if (role === 'staff') {
      await fetchAppointments(statusFilter);
    }
    setLoading(false);
  };

  init();
}, [statusFilter, role, userId]);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.put(`http://localhost:1337/appointment/cancel/${appointmentId}`);
      alert("Appointment cancelled.");
      fetchAppointments(statusFilter);
    } catch (err) {
      alert("Error cancelling appointment.");
    }
  };

  const handleApproveAppointment = async (appointmentId) => {
    try {
      await axios.put(`http://localhost:1337/appointment/confirm/${appointmentId}`, {
        status: 'confirmed',
      });
      alert("Appointment approved.");
      fetchAppointments(statusFilter);
    } catch (err) {
      alert("Error approving appointment.");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:1337/appointment/delete/${appointmentId}`);
      alert("Appointment deleted.");
      fetchAppointments(statusFilter);
    } catch (err) {
      alert("Error deleting appointment.");
    }
  };

  const handleReviewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setDiagnosis('');
    setTreatment('');
    setImageFile(null);
    setOpenModal(true);
  };

  const compressAndConvertToBase64 = async (file) => {
    try {
      const options = {
        maxSizeMB: 0.01, // ~10KB
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      return await imageCompression.getDataUrlFromFile(compressedFile);
    } catch (err) {
      console.error('Image compression error:', err);
      return null;
    }
  };

  const handleSubmitRecord = async () => {
    try {
      const imageData = imageFile ? await compressAndConvertToBase64(imageFile) : null;

      const recordData = {
        appointmentId: selectedAppointment.appointmentId,
        patientId: selectedAppointment.patientId,
        dentistId: selectedAppointment.dentistId,
        diagnosis,
        treatment,
        images: imageData ? [imageData] : [],
        visitDate: selectedAppointment.appointmentDate,
      };

      await axios.post('http://localhost:1337/record/create', recordData);

      alert('Record created successfully');
      setOpenModal(false);
      fetchAppointments(statusFilter);
    } catch (err) {
      alert('Failed to create record');
      console.error(err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const displayedRecords = records.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="ManageAppointment-dashboard">
      <ClientSidebar />
      <div className="ManageAppointment-content">
        <h1>Manage Appointments</h1>
        <div style={{ marginBottom: '1rem' }}>
          <Button onClick={() => { setStatusFilter('confirmed'); }}>Confirmed</Button>
          <Button onClick={() => { setStatusFilter('pending'); }}>Pending</Button>
          <Button onClick={() => { setStatusFilter('cancelled'); }}>Cancelled</Button>
        </div>

        {loading ? (
          <p>Loading appointments...</p>
        ) : (
          <div className='ManageAppointment-table'>
            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Appointment Date</StyledTableCell>
                    <StyledTableCell>Appointment Time</StyledTableCell>
                    <StyledTableCell>Dentist Name</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedRecords.map((appointment) => (
                    <StyledTableRow key={appointment.appointmentId}>
                      <StyledTableCell>{new Date(appointment.appointmentDate).toLocaleDateString()}</StyledTableCell>
                      <StyledTableCell>{dayjs(appointment.appointmentTime, 'HH:mm').format('hh:mm A')}</StyledTableCell>
                      <StyledTableCell>{appointment.dentistName || "Unknown"}</StyledTableCell>
                      <StyledTableCell>{appointment.status}</StyledTableCell>
                      <StyledTableCell>
                        {statusFilter === 'pending' && (
                          <>
                            <Button color="success" onClick={() => handleApproveAppointment(appointment.appointmentId)}>Approve</Button>
                            <Button color="error" onClick={() => handleCancelAppointment(appointment.appointmentId)}>Cancel</Button>
                          </>
                        )}
                        {statusFilter === 'confirmed' && (
                          <Button color="primary" onClick={() => handleReviewAppointment(appointment)}>Review</Button>
                        )}
                        {statusFilter === 'cancelled' && (
                          <Button color="error" onClick={() => handleDeleteAppointment(appointment.appointmentId)}>Delete</Button>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={records.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[]}
            />
          </div>
        )}

        {/* Modal for Review Record */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box sx={modalStyle}>
            <h2>Review Appointment</h2>
            <TextField
              label="Diagnosis"
              fullWidth
              margin="normal"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
            <TextField
              label="Treatment"
              fullWidth
              margin="normal"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              style={{ marginTop: '1rem' }}
            />
            <Button variant="contained" color="primary" onClick={handleSubmitRecord} sx={{ mt: 2 }}>
              Submit Record
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default ManageAppointment;
