const mongoose = require("mongoose");

const GiverUser = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
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
});

const Guser = mongoose.model("guser", GiverUser);

module.exports = Guser;
