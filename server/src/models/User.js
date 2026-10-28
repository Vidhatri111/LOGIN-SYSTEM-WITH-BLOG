const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  bio: { type: String, trim: true, maxlength: 280, default: "" },
  avatarUrl: { type: String, trim: true, default: "" },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }]
}, { timestamps: true });

userSchema.pre("save", async function hashPassword() {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 12);
});
userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};
userSchema.set("toJSON", {
  transform(_doc, value) {
    delete value.password;
    delete value.__v;
    return value;
  }
});

module.exports = mongoose.model("User", userSchema);
