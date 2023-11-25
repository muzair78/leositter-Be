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

class UUser {
  Allcaregivers = async (req, res) => {
    try {
      const { service } = req.params;
      const findSitter = await User.find({
        service: service,
        role: "caregiver",
      });
      if (findSitter) {
        res.status(200).json({ message: "found", findSitter });
      } else {
        res.status(402).json({ message: "not found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(503).json({ message: error.message });
    }
  };
  users_profile = async (req, res) => {
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
  CareGiverPage = async (req, res) => {
    try {
      const id = req.params._id;
      const checkUser = await User.find({ _id: id }, { password: 0 });
      res.status(201).json({ message: "found", checkUser });
    } catch (error) {
      console.log(error);
      return res.status(503).json({ message: error.message });
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
}
module.exports = new UUser();
