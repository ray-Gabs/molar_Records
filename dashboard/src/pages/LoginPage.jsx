import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./LoginPage.css";

function LoginPage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [userForm, setUserForm] = useState({ emailOrUsername: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    console.log("Login attempt with:", userForm);
  
    const { emailOrUsername, password } = userForm;
    const isEmail = emailOrUsername.includes("@");
  
    try {
      const response = await axios.post("http://localhost:1337/auth/login", {
        email: isEmail ? emailOrUsername.toLowerCase().trim() : "",
        username: !isEmail ? emailOrUsername.trim() : "",
        password,
      });
  
      console.log("Response from server:", response.data); // Log the full response
  
      if (response.data.message === "Login successful") {
        const { authToken, role, userId, email } = response.data;
  
        sessionStorage.setItem("authToken", authToken);
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("role", role);
  
        // Update authentication state in App.jsx
        setIsAuthenticated(true);
        // setUserRole(role); // Removed as it is not defined
  
        if (role === "patient") {
          navigate("/"); 
        } else if (role === "dentist") {
          navigate("/AdminDashboard");
        }
      } else {
        setError(response.data.message || "Invalid login");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="LoginMain">
      <div className="LoginContent">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        <TextField
          label="Email or Username"
          variant="outlined"
          fullWidth
          margin="dense"
          value={userForm.emailOrUsername}
          onChange={(e) => setUserForm({ ...userForm, emailOrUsername: e.target.value })}
        />
        
        <FormControl fullWidth margin="dense" variant="filled">
          <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
          <FilledInput
            id="filled-adornment-password"
            type={showPassword ? "text" : "password"}
            value={userForm.password}
            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <a href="/SignUpPage">No account? Click here to Sign up!</a>
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  );
}

export default LoginPage;
