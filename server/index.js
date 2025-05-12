require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler.js");

// Routes
const userRoute = require("./routes/userRoute.js");
const dentistRoute = require("./routes/dentistRoute.js");
const staffRoute = require("./routes/staffRoute.js");
const recordRoute = require("./routes/recordRoute.js");
const appointmentRoute = require("./routes/appointmentRoute.js");
const loginNRegisterRoute = require("./routes/loginNRegisterRoute.js");
const patientRoute = require("./routes/patientRoute.js");
// MongoDB connection
const connectDB = require("./config/connection.js");

const app = express();

// Middleware
app.use(cors());
// app.use(express.json());

// Connect to MongoDB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
connectDB();

// Routes
app.use("/user", userRoute);
app.use("/dentist", dentistRoute);
app.use("/staff", staffRoute);
app.use("/patient", patientRoute);
app.use("/appointment", appointmentRoute);
app.use("/record", recordRoute);
app.use("/auth", loginNRegisterRoute);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
