const User = require("../models/model");
const bcrypt = require("bcrypt");
const {
  hashString,
  passwordString,
  transporter,
} = require("../helpers/helper");

class Auth {
  Signup = async (req, res) => {
    try {
      const { name, username, phone, email, Pservice, password, cpassword } =
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
        Pservice,
        password: hashPassword,
        cpassword: hashPassword,
        role: "petsitter",
      });
      if (
        !name ||
        !username ||
        !phone ||
        !email ||
        !Pservice ||
        !password ||
        !cpassword
      ) {
        return;
      }
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
      return res.status(503).json({ message: "server error" });
    }
  };
  Signin = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return res
          .status(200)
          .json({ message: "Signin_Sucessfully", data: { user } });
      } else {
        return res.status(400).json({ message: "Wrong Credentials" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  jobForm = async (req, res) => {
    try {
      const { _id } = req.params; // Destructure _id from req.params
      const data = await User.findByIdAndUpdate(_id, req.body, { new: true });

      res.status(200).send(data);
    } catch (error) {
      console.log(error);
    }
  };
  SitterNearMe = async (req, res) => {
    try {
      const data = req.params.service;

      const sitterData = await User.find({ Pservice: data });
      res.status(200).json({ message: "Data Ok", sitterData });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  Sitters = async (req, res) => {
    try {
      const { service } = req.params;
      const findSitter = await User.find({ Pservice: service });
      if (findSitter) {
        res.status(200).json({ message: "found", findSitter });
      } else {
        res.status(402).json({ message: "not found" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  Careiver = async (req, res) => {
    try {
      const { name, email, phone, service, password, cpassword } = req.body;
      const mailCheck = await User.findOne({ email });
      if (mailCheck) {
        return res.status(409).json({ message: "Email Already Exist" });
      }
      const hashPassword = hashString(password);
      const userCreate = await User.create({
        name,
        email,
        phone,
        service,
        password: hashPassword,
        cpassword: hashPassword,
        role: "caregiver",
      });
      if (userCreate) {
        res.status(201).json({
          message: "Signup Sucessfully : User Created",
          data: userCreate,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  CaregiverData = async (req, res) => {
    const data = req.params.service;

    const findSitter = await User.find({ Pservice: data });
    if (findSitter) {
      res.status(201).send({ message: "found", findSitter });
    }
  };
  PetSitterAdmin = async (req, res) => {
    try {
      const _id = req.params._id;
      const findUser = await User.findById(_id);
      if (findUser) {
        res.status(200).json({ message: "User found", findUser });
      }
    } catch (error) {
      console.log(error);
    }
  };
  CareTakerProfile = async (req, res) => {
    const profile = req.params;
    const profileUser = await User.findById(profile);
    // const sitters = await User.find({ service:})
    res.status(201).json({ message: "user found", profileUser });
  };

  PetSitterProfile = async (req, res) => {
    const data = req.params._id;
    const checkUser = await User.find({ _id: data }, { password: 0 });
    res.status(201).json({ message: "found", checkUser });
  };
  UpdateCareTakerProfile = async (req, res) => {
    try {
      const { _id } = req.params;
      const data = await User.findByIdAndUpdate(_id, req.body, { new: true });
      res.status(200).json({ message: "user updated", data });
    } catch (error) {
      console.log(error);
    }
  };
  UpdatePetSitterProfile = async (req, res) => {
    try {
      const { _id } = req.params;
      const data = await User.findByIdAndUpdate(_id, req.body, { new: true });
      res.status(200).json({ message: "user updated", data });
    } catch (error) {
      console.log(error);
    }
  };
  UpdatePetSitterPassword = async (req, res) => {
    try {
      const { _id } = req.params;
      const { password } = req.body;
      const nPassword = hashString(password);
      const data = await User.findByIdAndUpdate(
        _id,
        { password: nPassword },
        { new: true }
      );
      res.status(200).json({ message: "password updated", data });
    } catch (error) {
      console.log(error);
    }
  };
  UpdateCareTakerPassword = async (req, res) => {
    try {
      const new_id = req.params._id;
      const Newpassword = req.body.password;

      const nPassword = hashString(Newpassword);
      const Ndata = await User.findByIdAndUpdate(
        new_id,
        { password: nPassword },
        { new: true }
      );

      res.status(200).json({ message: "password updated", Ndata });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

module.exports = new Auth();
