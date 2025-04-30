const mongoose = require('mongoose');
require('dotenv').config(); // Make sure you're loading environment variables

const connectDB = async () => {
  try {
    // Connect using the MongoDB URI from the .env file, without deprecated options
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
