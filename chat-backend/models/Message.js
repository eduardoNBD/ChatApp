const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  ip: { type: String, required: true },
  readBy: [{ type: String }],
  timestamp: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('Message', MessageSchema);