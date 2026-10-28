require("dotenv").config();
const mongoose = require("mongoose");
const connectDatabase = require("../config/db");
const User = require("../models/User");

async function run() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 12) {
    throw new Error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters in server/.env.");
  }
  await connectDatabase();
  if (await User.exists({ role: "admin" })) {
    throw new Error("An administrator already exists. Use the existing admin account to manage access.");
  }
  const user = await User.findOne({ email: process.env.ADMIN_EMAIL.toLowerCase() });
  if (!user) throw new Error("Register the intended account first, then set ADMIN_EMAIL to that account.");
  user.role = "admin";
  await user.save();
  console.log(`Administrator role granted to ${user.email}.`);
}

run().catch((error) => {
  console.error("Admin setup failed:", error.message);
  process.exitCode = 1;
}).finally(() => mongoose.disconnect());
