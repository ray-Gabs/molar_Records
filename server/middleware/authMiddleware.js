const jwt = require("jsonwebtoken");
const User = require("../models/user.models.js");

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ userId: decoded.userId });

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user; // Attach user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authenticateUser;
