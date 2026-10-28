const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true, index: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, trim: true, minlength: 2, maxlength: 1200 }
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);
