const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  type: { type: String, enum: ['application_accepted','application_rejected','general'], default: 'general' },
  title: { type: String, default: '' },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Notification', notificationSchema)