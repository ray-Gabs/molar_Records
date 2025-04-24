import React from "react";
// eslint-disable-next-line no-unused-vars
import { useNavigate } from "react-router-dom";
import ClientSidebar from "./ClientSidebar";
import "./UserDashboard.css"; // Import your CSS file for styling
function UserDashboard() {
  return (
   <div className="user-dashboard">
      <ClientSidebar />
      <div className="dashboard-content">
        <h1>User Dashboard</h1>
        <p>Welcome to the User Dashboard!</p>
        <p>Here you can manage your account and view your information.</p>  
      </div>
     
   </div>
  )
}

export default UserDashboard
