/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import ClientSidebar from "../UserFiling/ClientSidebar";
import { styled } from '@mui/material/styles';
import {
  Table, TableBody, TableCell, tableCellClasses,
  TableContainer, TableHead, TableRow, Paper, TablePagination, Button
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
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

function ManageAppointment() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('all');

  const userId = sessionStorage.getItem("userId");

  const fetchAppointments = async (status) => {
    try {
      const res = await axios.get(`http://localhost:1337/appointment/${status}/${userId}`);
      const appointmentsWithDentists = await Promise.all(res.data.map(async (appointment) => {
        const dentistRes = await axios.get(`http://localhost:1337/dentist/profile/${appointment.dentistId}`);
        const dentistName = dentistRes.data.name;
        return { ...appointment, dentistName };
      }));
      setRecords(appointmentsWithDentists);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchAppointments(statusFilter);
  }, [statusFilter, userId]);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.put(`http://localhost:1337/appointment/cancel/${appointmentId}`);
      alert("Appointment cancelled.");
      fetchAppointments(statusFilter);
    } catch (err) {
      alert("Error cancelling appointment.");
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
        <h2>Manage Appointments</h2>
        <div style={{ marginBottom: '1rem' }}>
          <Button onClick={() => { setStatusFilter('completed'); fetchAppointments('completed'); }}>Completed</Button>
          <Button onClick={() => { setStatusFilter('confirmed'); fetchAppointments('confirmed'); }}>Confirmed</Button>
          <Button onClick={() => { setStatusFilter('pending'); fetchAppointments('pending'); }}>Pending</Button>
        </div>
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>Appointment Date</StyledTableCell>
                <StyledTableCell>Appointment Time</StyledTableCell>
                <StyledTableCell>Dentist Name</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                {statusFilter === 'pending' && (
                  <StyledTableCell>Action</StyledTableCell>
                )}
                {statusFilter === 'completed' && (
                  <StyledTableCell>Remarks</StyledTableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedRecords.map((appointment) => (
                <StyledTableRow key={appointment._id}>
                  <StyledTableCell>{new Date(appointment.appointmentDate).toLocaleDateString()}</StyledTableCell>
                  <StyledTableCell>{dayjs(appointment.appointmentTime, 'HH:mm').format('hh:mm A')}</StyledTableCell>
                  <StyledTableCell>{appointment.dentistName || "Unknown"}</StyledTableCell>
                  <StyledTableCell>{appointment.status}</StyledTableCell>
                  {statusFilter === 'pending' && (
                    <StyledTableCell>
                      <Button color="error" onClick={() => handleCancelAppointment(appointment._id)}>Cancel</Button>
                    </StyledTableCell>
                  )}
                  {statusFilter === 'completed' && (
                    <StyledTableCell>{appointment.remarks || "No remarks"}</StyledTableCell>
                  )}
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
    </div>
  );
}

export default ManageAppointment;
