/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "./pages/LoginPage";

/*user import*/
import ClientSidebar from "./pages/UserFiling/ClientSidebar"
import CreateUser from "./pages/UserFiling/CreateUser"
import EditUser from "./pages/UserFiling/EditUser"
import UserDashboard from "./pages/UserFiling/UserDashboard"

/*Admin import*/
import AdminLogin from "./pages/AdminPannel/AdminLogin";
import AdminDashboard from "./pages/AdminPannel/AdminDashboard";
import AdminSidebar from "./pages/AdminPannel/AdminSidebar";
// ManagerAdmin control
import MngAdmin from "./pages/AdminPannel/ManagerPanel/MngAdmin";
function App() {
  useEffect(() => {
    localStorage.removeItem("authToken");
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* User Panel */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/CreateUser" element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />
        <Route path="/EditUser" element={<ProtectedRoute><EditUser /></ProtectedRoute>} />

        {/* Admin Panel */}
        <Route path="/Admin" element={<AdminLogin />} />
        <Route path="/AdminDashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/MngAdmin" element={<ProtectedRoute><MngAdmin /></ProtectedRoute>} />
       
        {/* Redirect to for now */}
        <Route path="/ClientSidebar" element={<ClientSidebar />} />
        <Route path="/AdminSidebar" element={<AdminSidebar />} />
        {/* Redirect too */}
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;