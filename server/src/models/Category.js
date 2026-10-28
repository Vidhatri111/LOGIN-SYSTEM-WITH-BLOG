const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true, maxlength: 40 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, trim: true, maxlength: 180, default: "" },
  color: { type: String, match: /^#[0-9A-Fa-f]{6}$/, default: "#8B5CF6" }
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
