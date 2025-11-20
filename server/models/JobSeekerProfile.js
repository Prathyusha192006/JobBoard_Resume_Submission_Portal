const mongoose = require('mongoose')

const jobSeekerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  roleId: { type: String, default: '' },
  title: { type: String, default: '' },
  location: { type: String, default: '' },
  skills: { type: [String], default: [] },
  resumeUrl: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('JobSeekerProfile', jobSeekerProfileSchema)