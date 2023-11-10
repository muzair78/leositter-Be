const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
  },

  senderId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
  },
  created_at: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
