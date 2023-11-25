const User = require("../../models/model");
const message = require("../../models/message");
const Conversation = require("../../models/Conversation");
const bcrypt = require("bcrypt");
const {
  hashString,
  passwordString,
  transporter,
} = require("../../helpers/helper");
const { response } = require("express");
const mongoose = require("mongoose");
const generateToken = require("../../models/model");

class Auth {
  Signup = async (req, res) => {
    try {
      const { name, username, phone, email, service, password, role } =
        req.body;
      const verifyEmail = await User.findOne({ email });
      if (verifyEmail) {
        return res.status(409).json({ message: "Email Already Exist" });
      }
      const hashPassword = hashString(password);
      const userCreate = await User.create({
        name,
        username,
        phone,
        email,
        service,
        password: hashPassword,
        role,
      });
      if (userCreate) {
        res.status(201).json({
          message: "Signup Sucessfully : User Created",
          data: userCreate,
        });
      } else {
        return res.status(500).json({ message: "Signup Failed" });
      }
    } catch (error) {
      console.log(error);
      return res.status(503).json({ message: error.message });
    }
  };
  Signin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      const passwordMatch = await passwordString(password, user.password);
      if (passwordMatch) {
        const token = await user.generateToken();
        return res.status(200).json({
          message: "Signin_Sucessfully",
          data: { user },
          token: token,
        });
      } else {
        return res.status(409).json({ message: "Wrong Credentials" });
      }
    } catch (error) {
      console.log(error);
      return res.status(503).json({ message: error.message });
    }
  };
  UpdateProfile = async (req, res) => {
    try {
      const files = req.files;
      const { _id } = req.params;
      if (files) {
        let obj = {
          name: req.body.name,
          email: req.body.name,
          phone: req.body.phone,
          hourrate: req.body.hourrate,
          about: req.body.about,
          weeklyhours: req.body.weeklyhours,
          service: req.body.service,
          available: req.body.available.split(","),
        };
        let result = { ...obj, profileImg: req.files[0].location };
        const data = await User.findByIdAndUpdate(_id, result, { new: true });
        return res.status(200).send(data);
      } else {
        const data = await User.findByIdAndUpdate(_id, req.body, { new: true });
        return res.status(200).send(data);
      }
    } catch (error) {
      return res.status(503).json({ message: error.message });
    }
  };
  UpdatePassword = async (req, res) => {
    try {
      const { _id } = req.params;
      const { password } = req.body;
      const nPassword = hashString(password);
      const data = await User.findByIdAndUpdate(
        _id,
        { password: nPassword },
        { new: true }
      );
      res.status(201).json({ message: "password updated", data });
    } catch (error) {
      console.log(error);
      return res.status(503).json({ message: error.message });
    }
  };
}

module.exports = new Auth();
