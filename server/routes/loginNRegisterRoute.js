const express = require("express");
const authenticateUser = require("../middleware/authMiddleware"); // Import the custom JWT middleware
const { loginUser, registerUser, editUser, getUserById } = require("../controllers/loginNRegisterController.js");

const router = express.Router();

// Define routes for login, signup, edit, and get user by ID
router.post("/login", loginUser);  // Login route
router.post("/signup", registerUser);  // Signup route

// Protected Route Example: Using the custom authenticateUser middleware
router.get("/user/:userId", authenticateUser, getUserById);  
router.put("/user/edit", authenticateUser, editUser); 

module.exports = router;
