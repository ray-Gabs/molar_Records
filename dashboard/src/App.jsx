
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "./pages/LoginPage";

/*user import*/
import ClientSidebar from "./pages/UserFiling/ClientSidebar"
import UserProfile from "./pages/UserFiling/UserProfile"
import UserDashboard from "./pages/UserFiling/UserDashboard"
import UserRecords from "./pages/UserFiling/UserRecords"
/*Admin import*/
import AdminDashboard from "./pages/AdminPannel/AdminDashboard";


function App() {
  useEffect(() => {
    localStorage.removeItem("authToken");
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* User Panel */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<UserDashboard />} />
        <Route path="/Profile" element={<UserProfile />} />
        <Route path="/Records" element={<UserRecords />} />

        {/* Admin Panel */}
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
       
        {/* Redirect to for now */}
        <Route path="/ClientSidebar" element={<ClientSidebar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;