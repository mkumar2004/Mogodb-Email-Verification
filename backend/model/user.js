
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  mobile: String,
  address: String,
  isVerified: { type: Boolean, default: false },
  verificationToken: String
});

module.exports = mongoose.model('User', userSchema);
