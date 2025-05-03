import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// User imports
import UserDashboard from "./pages/UserFiling/UserDashboard";
import ManageProfilePage from "./pages/ManageProfilePage";
import UserRecords from "./pages/UserFiling/UserRecords";

// Admin imports
import AdminDashboard from "./pages/AdminPannel/AdminDashboard";

//Main imports
import PorfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(""); 

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decodedToken.role); 
        setIsAuthenticated(true); 
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false); 
    }
  }, []);
  

  return (
    <BrowserRouter>
      <Routes>
        {/* User Panel */}
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/SignUpPage" element={<SignUpPage setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />}/>
        <Route path="/" element={isAuthenticated && userRole === "patient" ? <UserDashboard /> : <Navigate to="/login" />} />
        <Route path="/ManageProfilePage" element={isAuthenticated ? (<ManageProfilePage /> ) : ( <Navigate to="/login" />)}/>
        <Route path="/Profile" element={isAuthenticated && userRole === "patient" ? <PorfilePage /> : <Navigate to="/login" />} />
        <Route path="/Records" element={isAuthenticated && userRole === "patient" ? <UserRecords /> : <Navigate to="/login" />} />

        {/* Admin Panel */}
        <Route path="/AdminDashboard" element={isAuthenticated && userRole === "dentist" ? <AdminDashboard /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
