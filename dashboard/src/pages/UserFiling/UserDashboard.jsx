import React from "react";
// eslint-disable-next-line no-unused-vars
import { useNavigate } from "react-router-dom";
import ClientSidebar from "./ClientSidebar";
//image
import DentalBanner from "../../assets/MolarRecordWithBorder.png";
import OrthoIn from "../../assets/OrthoisIn.png";
import Orthoout from "../../assets/orthoisOut'.png";
//basicmui    
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
//calendar
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

//accordion
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionActions from '@mui/material/AccordionActions';
//css
import "./UserDashboard.css";

function UserDashboard() {
  return (
    <div className="user-dashboard">
      <ClientSidebar />
      <div className="dashboard-content">
          <div className="Img">
            <img
              src={DentalBanner}
              alt="Dental Clinic Banner"
            />
          </div>
          <div className="dashboard-Funct">
            <div className="RecentRecords3">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography component="span">Accordion 1</Typography>
              </AccordionSummary>
              <AccordionDetails>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                malesuada lacus ex, sit amet blandit leo lobortis eget.
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <Typography component="span">Accordion 2</Typography>
              </AccordionSummary>
              <AccordionDetails>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                malesuada lacus ex, sit amet blandit leo lobortis eget.
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
              >
                <Typography component="span">Accordion Actions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                malesuada lacus ex, sit amet blandit leo lobortis eget.
              </AccordionDetails>
              <AccordionActions>
                <Button>Cancel</Button>
                <Button>Agree</Button>
              </AccordionActions>
            </Accordion>
            </div>

            <div className="DetailsandEtc">

              <div className="DoctorStatImg">
              <img
                src={OrthoIn}
                alt="Dental Clinic Banner"
                style={{ width: '300px', height: 'auto' }} 
              />
              </div>

              <div className="CalendarMain">

                <Button variant="contained" sx={{ backgroundColor: "# 6DF181" }}>
                Make Appointment
                </Button>

                <div className="CalendarPart">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className="calendar-wrapper" style={{ width: '400px', height: 'auto' }}>
                      <DateCalendar
                        showDaysOutsideCurrentMonth
                        fixedWeekNumber={6}
                      />
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
