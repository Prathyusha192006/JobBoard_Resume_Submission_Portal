const mongoose = require('mongoose')

const appliedJobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['applied','interviewing','rejected','hired'], default: 'applied' },
  notes: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
}, { timestamps: true })

appliedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true })

module.exports = mongoose.model('AppliedJob', appliedJobSchema)
