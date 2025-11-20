const express = require('express')
const auth = require('../middleware/auth')
const Notification = require('../models/Notification')

const router = express.Router()

// List my notifications
router.get('/', auth, async (req,res)=>{
  const items = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 }).lean()
  res.json({ notifications: items.map(n=>({
    id: n._id,
    type: n.type,
    title: n.title,
    message: n.message,
    read: n.read,
    createdAt: n.createdAt,
  })) })
})

// Mark one as read
router.patch('/:id/read', auth, async (req,res)=>{
  const n = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { read: true }, { new: true })
  if (!n) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

// Mark all as read
router.patch('/mark-all/read', auth, async (req,res)=>{
  await Notification.updateMany({ userId: req.userId, read: false }, { read: true })
  res.json({ ok: true })
})

module.exports = router