const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/User')
const ContactMessage = require('../models/ContactMessage')

const router = express.Router()

// Admin-only guard inline
async function ensureAdmin(req, res, next){
  try {
    // req.userId is set by auth middleware
    const me = await User.findById(req.userId).select('role')
    if (!me || me.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
    return next()
  } catch {
    return res.status(403).json({ error: 'Forbidden' })
  }
}

// GET /api/admin/users  -> list minimal user info
router.get('/users', auth, ensureAdmin, async (req,res)=>{
  const users = await User.find({}).select('_id name email role roleId').lean()
  res.json({ users: users.map(u=>({ id: u._id, name: u.name, email: u.email, role: u.role, roleId: u.roleId })) })
})

// GET /api/admin/messages -> list contact messages
router.get('/messages', auth, ensureAdmin, async (req,res)=>{
  const messages = await ContactMessage.find({}).sort({ createdAt: -1 }).lean()
  res.json({ messages: messages.map(m=>({
    id: m._id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    status: m.status,
    createdAt: m.createdAt,
  })) })
})

// PATCH /api/admin/messages/:id -> update status
router.patch('/messages/:id', auth, ensureAdmin, async (req,res)=>{
  const { status } = req.body || {}
  if (!['new','read','archived'].includes(status||'')) return res.status(400).json({ error: 'Invalid status' })
  const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true })
  if (!msg) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

// DELETE /api/admin/messages/:id -> remove message
router.delete('/messages/:id', auth, ensureAdmin, async (req,res)=>{
  const msg = await ContactMessage.findByIdAndDelete(req.params.id)
  if (!msg) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

module.exports = router