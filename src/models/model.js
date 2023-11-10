const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  Pservice: {
    type: String,
  },
  service: {
    type: String,
  },
  password: {
    type: String,
  },
  cpassword: {
    type: String,
  },
  weeklyhours: {
    type: String,
  },
  hourrate: {
    type: String,
  },
  available: {
    type: [String],
  },
  about: {
    type: String,
  },
  role: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
