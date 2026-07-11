const mongoose = require('mongoose')

const employerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  roleId: { type: String, default: '' },
  company: { type: String, default: '' },
  website: { type: String, default: '' },
  location: { type: String, default: '' },
  logo: { type: String, default: '' },
  description: { type: String, default: '' },
  phone: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('EmployerProfile', employerProfileSchema)