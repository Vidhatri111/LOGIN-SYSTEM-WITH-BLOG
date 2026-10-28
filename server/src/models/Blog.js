const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true, trim: true, maxlength: 280 },
  content: { type: String, required: true, minlength: 20, maxlength: 50000 },
  imageUrl: { type: String, trim: true, default: "" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: [{ type: String, trim: true, lowercase: true, maxlength: 24 }],
  status: { type: String, enum: ["draft", "pending", "published"], default: "draft" },
  featured: { type: Boolean, default: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  readCount: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

blogSchema.index({ title: "text", description: "text", content: "text", tags: "text" });
blogSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Blog", blogSchema);
