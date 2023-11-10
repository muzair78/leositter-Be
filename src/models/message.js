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
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
