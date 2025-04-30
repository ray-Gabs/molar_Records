import React, { useState, useEffect } from "react";
import ClientSidebar from "./ClientSidebar";
import DentalBanner from "../../assets/BgMolarRecord.png";
import OrthoIn from "../../assets/OrthoisIn.png";
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import "./UserDashboard.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14, // Force white text color for body rows
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

function UserDashboard() {
  const [records, setRecords] = useState([]); // Store patient records
  const [page, setPage] = useState(0); // Store current page
  const [rowsPerPage] = useState(5);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Fetch records data
  useEffect(() => {
    const fetchRecords = async () => {
      const fetchedRecords = [
        { record_id: 1, patient_id: 101, dentist_id: 201, diagnosis: "Cavity", images: [], fine: 100, visit_date: '2025-05-01' },
        { record_id: 2, patient_id: 102, dentist_id: 202, diagnosis: "Check-up", images: [], fine: 0, visit_date: '2025-05-02' },
        { record_id: 3, patient_id: 103, dentist_id: 203, diagnosis: "Braces Adjustment", images: [], fine: 50, visit_date: '2025-05-03' },
        { record_id: 4, patient_id: 104, dentist_id: 204, diagnosis: "Root Canal", images: [], fine: 500, visit_date: '2025-05-04' },
        { record_id: 5, patient_id: 105, dentist_id: 205, diagnosis: "Extraction", images: [], fine: 300, visit_date: '2025-05-05' },
        { record_id: 6, patient_id: 106, dentist_id: 206, diagnosis: "Cleaning", images: [], fine: 0, visit_date: '2025-05-06' },
      ];
      setRecords(fetchedRecords);
    };
    fetchRecords();
  }, []);

  // Table rows to be displayed based on current page
  const displayedRecords = records.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="user-dashboard">
      <ClientSidebar />
      <div className="dashboard-content">
        <div className="dashboard-Funct">
          <div className="Text">
            <h1>Welcome to Molar Records!</h1>
            <div className="MinorDetailsforMolarRecordInPatientDashboard">
              <h2>Your dental visit history and treatment details are securely recorded here.</h2>
              
              <h3> Easily track your past diagnoses, visits, and any pending fines. Stay updated with your latest dental records, upcoming appointments, and visit summaries. Your oral health history is just a click away.</h3>
            </div>
            <Divider sx={{ borderColor: '#1C444D', borderBottomWidth: 2, width: '100%', display: 'block' }} />
            <div className="BtnAppointment">
              <Button variant="contained" sx={{ backgroundColor: "#3AB286" }}>
                Make Appointment
              </Button>
            </div>
          </div>

          <div className="Table">
            <h2>Latest Patient Records</h2>
            <div className="RecordTable">
              <TableContainer component={Paper}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Record ID</StyledTableCell>
                      <StyledTableCell>Dentist ID</StyledTableCell>
                      <StyledTableCell>Fine</StyledTableCell>
                      <StyledTableCell>Visit Date</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedRecords.map((record) => (
                      <StyledTableRow key={record.record_id}>
                        <StyledTableCell>{record.record_id}</StyledTableCell>
                        <StyledTableCell>{record.dentist_id}</StyledTableCell>
                        <StyledTableCell>{record.fine}</StyledTableCell>
                        <StyledTableCell>{record.visit_date}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <TablePagination
              component="div"
              count={records.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[]}  // Hide the rows per page selector
            />
          </div>
        </div>
        <div className="DetailsandEtc">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={OrthoIn} alt="Dental Clinic Banner" style={{ width: '300px', height: 'auto' }} />
          </div>
          <div className="AppointmentSection">
            <h2>Appointment Dates</h2>
            <div className="CalendarMain">
              <div className="CalendarPart">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="calendar-wrapper" style={{ width: '400px', height: 'auto' }}>
                    <DateCalendar showDaysOutsideCurrentMonth fixedWeekNumber={6} />
                  </div>
                </LocalizationProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
