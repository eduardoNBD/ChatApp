const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  participants: [{ type: String, required: true }], // IDs o nombres de usuario
  isGroup: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastMessage: { type: String, default: '' },
  lastMessageTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', ChatSchema);