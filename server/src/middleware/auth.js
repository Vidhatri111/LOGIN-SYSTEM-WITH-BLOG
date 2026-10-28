const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authenticate(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Please sign in to continue." });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "Your session is no longer valid." });
    req.user = user;
    next();
  } catch (error) {
    if (["TokenExpiredError", "JsonWebTokenError"].includes(error.name)) {
      return res.status(401).json({ message: "Your session has expired. Please sign in again." });
    }
    next(error);
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Administrator access is required." });
  next();
}

module.exports = { authenticate, requireAdmin };
