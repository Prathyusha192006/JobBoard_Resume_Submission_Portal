// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    select: false  // Don't include by default for security
  },
  passwordHash: {
    type: String,
    select: false  // Don't include by default for security
  },
  role: {
    type: String,
    required: true,
    enum: ['jobseeker', 'employer', 'admin'],
    lowercase: true
  },
  roleId: {
    type: String,
    required: true,
    uppercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);