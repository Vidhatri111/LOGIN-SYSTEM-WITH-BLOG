const mongoose = require("mongoose");

function errorHandler(error, _req, res, _next) {
  if (error.code === 11000) {
    const message = error.keyPattern?.email || error.keyValue?.email
      ? "An account with this email already exists."
      : "That value is already in use.";
    return res.status(409).json({ message });
  }
  if (error.name === "CastError") return res.status(400).json({ message: "The requested resource identifier is invalid." });
  if (error.name === "ValidationError") return res.status(400).json({ message: error.message });
  if (mongoose.connection.readyState !== 1) {
    console.error("MongoDB request failed:", error.message);
    return res.status(503).json({ message: "The database is temporarily unavailable. Please try again shortly." });
  }
  console.error(error);
  res.status(500).json({ message: "An unexpected server error occurred." });
}

module.exports = errorHandler;
