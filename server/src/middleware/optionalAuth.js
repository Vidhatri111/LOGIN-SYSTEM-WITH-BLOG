const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function optionalAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.sub);
    next();
  } catch (error) {
    if (["TokenExpiredError", "JsonWebTokenError"].includes(error.name)) {
      return res.status(401).json({ message: "Your session has expired. Please sign in again." });
    }
    next(error);
  }
}

module.exports = optionalAuth;
