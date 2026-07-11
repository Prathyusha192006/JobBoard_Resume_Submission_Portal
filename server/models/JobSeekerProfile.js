const mongoose = require('mongoose')

const jobSeekerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  roleId: { type: String, default: '' },
  title: { type: String, default: '' },
  location: { type: String, default: '' },
  skills: { type: [String], default: [] },
  resumeUrl: { type: String, default: '' },
  resumeName: { type: String, default: '' },
  phone: { type: String, default: '' },
  summary: { type: String, default: '' },
  links: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' }
  },
  education: { type: Array, default: [] },
  experience: { type: Array, default: [] },
  achievements: { type: Array, default: [] }
}, { timestamps: true })

module.exports = mongoose.model('JobSeekerProfile', jobSeekerProfileSchema)