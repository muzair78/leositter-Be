const User = require("../models/model");
const message = require("../models/message");
const Conversation = require("../models/Conversation");
const bcrypt = require("bcrypt");
const {
  hashString,
  passwordString,
  transporter,
} = require("../helpers/helper");
const { response } = require("express");
const mongoose = require("mongoose");
const generateToken = require("../models/model");

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
      res.status(500).json({ message: "server error" });
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
  SendMessage = async (req, res) => {
    try {
      const { messages } = req.body;
      const { sender_ID, reciever_ID } = req.params;
      let conversation;
      conversation = await Conversation.findOne({
        members: {
          $all: [sender_ID, reciever_ID],
        },
      });
      if (!conversation) {
        conversation = await Conversation.create({
          members: [sender_ID, reciever_ID],
          lastMessage: messages, // Set the initial lastMessage value
        });
      } else {
        conversation.lastMessage = messages; // Update the lastMessage field
        await conversation.save(); // Save the updated conversation
      }
      const messageTable = await message.create({
        conversationId: conversation._id,
        senderId: sender_ID,
        text: messages,
      });

      if (messageTable) {
        res.status(201).json({ message: "message sent", data: messageTable });
      } else {
        res.status(400).json({ message: "message failed" });
      }
    } catch (error) {
      res.status(402).json({ message: "message failed to send" });
      console.log(error);
    }
  };
  GetMessage = async (req, res) => {
    try {
      const n_id = req.params.senderid;
      const _reciverid = req.params._reciverid;
      const Find_Conv = await Conversation.findOne({
        $or: [{ members: [_reciverid, n_id] }, { members: [n_id, _reciverid] }],
      });

      if (!Find_Conv) {
        return res.status(402).json({ message: "no messages found" });
      }
      const __id = Find_Conv._id;
      const Find_messages = await message.find({ conversationId: __id });
      if (!Find_messages) {
        return res.status(404).json({ message: "No messages found" });
      }

      res.status(200).json({ message: "Messages found", data: Find_messages });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  GetConv = async (req, res) => {
    try {
      const id = req.params.id;
      const Find_Conv = await Conversation.find({
        members: { $in: [id] },
      }).populate(["members"]);
      if (Find_Conv) {
        res.status(201).json({ message: "found convs", data: Find_Conv });
      } else {
        res.status(404).json({ message: "Conversation not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

module.exports = new Auth();
