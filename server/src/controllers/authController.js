const jwt = require("jsonwebtoken");
const User = require("../models/User");

function setAuthCookie(res, userId, remember = true) {
  const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: remember ? "7d" : "12h" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    ...(remember ? { maxAge: 7 * 24 * 60 * 60 * 1000 } : {})
  });
}

async function register(req, res, next) {
  try {
    const user = await User.create({ name: req.body.name, email: req.body.email, password: req.body.password, role: "user" });
    res.status(201).json({ message: "Account created. You can now sign in.", user });
  } catch (error) { next(error); }
}

async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email }).select("+password");
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }
    setAuthCookie(res, user.id, req.body.remember !== false);
    res.json({ user });
  } catch (error) { next(error); }
}

function logout(_req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });
  res.json({ message: "You have been signed out." });
}

function me(req, res) { res.json({ user: req.user || null }); }

async function updateMe(req, res, next) {
  try {
    for (const field of ["name", "bio", "avatarUrl"]) {
      if (Object.hasOwn(req.body, field)) req.user[field] = req.body[field];
    }
    await req.user.save();
    res.json({ user: req.user });
  } catch (error) { next(error); }
}

module.exports = { register, login, logout, me, updateMe };
