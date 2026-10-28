const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const configuredOrigins = (process.env.CLIENT_URL || (process.env.NODE_ENV === "production" ? "" : "http://localhost:5173"))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const developmentOrigins = process.env.NODE_ENV === "production"
  ? []
  : [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
  ];
const allowedOrigins = new Set([...configuredOrigins, ...developmentOrigins]);

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin)),
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false }));
app.get("/api/health", (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ status: "error", message: "Database connection unavailable." });
  }
  res.json({ status: "ok", database: "connected" });
});
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use((_req, res) => res.status(404).json({ message: "Endpoint not found." }));
app.use(errorHandler);

module.exports = app;
