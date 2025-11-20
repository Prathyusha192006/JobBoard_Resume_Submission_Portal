const mongoose = require('mongoose')

const chatConversationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'AppliedJob' },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seekerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active','closed'], default: 'active' },
}, { timestamps: true })

chatConversationSchema.index({ employerId: 1, seekerId: 1, jobId: 1 }, { unique: true, partialFilterExpression: { jobId: { $type: 'objectId' }}})

module.exports = mongoose.model('ChatConversation', chatConversationSchema)