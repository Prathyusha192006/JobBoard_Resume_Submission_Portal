const mongoose = require('mongoose')

const chatMessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatConversation', index: true, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('ChatMessage', chatMessageSchema)