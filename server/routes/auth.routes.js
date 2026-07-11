// In routes/auth.routes.js
const express = require('express');
const { login, register } = require('../controllers/auth.controller');
const router = express.Router();

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register
router.post('/register', register);

const auth = require('../middleware/auth');
const User = require('../models/User');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const EmployerProfile = require('../models/EmployerProfile');

// GET /api/auth/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    let profile = null;
    if (user.role === 'jobseeker') {
      profile = await JobSeekerProfile.findOne({ userId: req.userId });
      if (!profile) {
        profile = await JobSeekerProfile.create({ userId: req.userId, roleId: user.roleId });
      }
    } else if (user.role === 'employer') {
      profile = await EmployerProfile.findOne({ userId: req.userId });
      if (!profile) {
        profile = await EmployerProfile.create({ userId: req.userId, roleId: user.roleId });
      }
    }
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        roleId: user.roleId
      },
      profile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const { name, ...profileData } = req.body;
    if (name) {
      user.name = name;
      await user.save();
    }
    
    let profile = null;
    if (user.role === 'jobseeker') {
      profile = await JobSeekerProfile.findOneAndUpdate(
        { userId: req.userId },
        { $set: profileData },
        { new: true, upsert: true }
      );
    } else if (user.role === 'employer') {
      profile = await EmployerProfile.findOneAndUpdate(
        { userId: req.userId },
        { $set: profileData },
        { new: true, upsert: true }
      );
    }
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        roleId: user.roleId
      },
      profile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;