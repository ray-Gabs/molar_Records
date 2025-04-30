require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler.js");

// Routes
const userRoute = require("./routes/userRoute.js");
const dentistNStaffRoute = require("./routes/dentistNStaffRoute.js");
const loginNRegisterRoute = require("./routes/loginNRegisterRoute.js");
const appointmentRoute = require("./routes/appointmentRoute.js");
const recordRoute = require("./routes/recordRoute.js");

// MongoDB connection
const connectDB = require("./config/connection.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/user", userRoute);
app.use("/dentist", dentistNStaffRoute);
app.use("/staff", dentistNStaffRoute);
app.use("/appointment", appointmentRoute);
app.use("/record", recordRoute);
app.use("/auth", loginNRegisterRoute);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
