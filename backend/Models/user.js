const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // ✅ ADDED: For password reset
  resetCode: { type: String },
  resetCodeExpires: { type: Date },
});

module.exports = mongoose.model("User", userSchema);
