const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: 'Remote' },
  tags: [{ type: String }],
  description: { type: String, default: '' },
  url: { type: String, default: '' },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
}, { timestamps: true })

module.exports = mongoose.model('Job', jobSchema)
