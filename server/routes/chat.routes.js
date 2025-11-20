const express = require('express')
const auth = require('../middleware/auth')
const ChatConversation = require('../models/ChatConversation')
const ChatMessage = require('../models/ChatMessage')
const User = require('../models/User')
const Job = require('../models/Job')

const router = express.Router()

// List my conversations (as employer or seeker)
router.get('/conversations', auth, async (req,res)=>{
  const me = req.userId
  const items = await ChatConversation.find({ $or: [{ employerId: me }, { seekerId: me }] })
    .sort({ updatedAt: -1 })
    .lean()

  // gather last message
  const ids = items.map(i=> i._id)
  const lastByConv = {}
  if (ids.length){
    const last = await ChatMessage.aggregate([
      { $match: { conversationId: { $in: ids } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$conversationId', text: { $first: '$text' }, createdAt: { $first: '$createdAt' } } }
    ])
    last.forEach(l=>{ lastByConv[String(l._id)] = { text: l.text, createdAt: l.createdAt } })
  }

  // attach peer info and job title
  const userIds = new Set()
  const jobIds = new Set()
  items.forEach(c=>{ userIds.add(String(c.employerId)); userIds.add(String(c.seekerId)); if (c.jobId) jobIds.add(String(c.jobId)) })
  const users = await User.find({ _id: { $in: Array.from(userIds) } }).select('name email').lean()
  const userMap = Object.fromEntries(users.map(u=> [String(u._id), u]))
  const jobs = await Job.find({ _id: { $in: Array.from(jobIds) } }).select('title').lean()
  const jobMap = Object.fromEntries(jobs.map(j=> [String(j._id), j]))

  const convs = items.map(c=>{
    const peerId = String(c.employerId) === String(me) ? String(c.seekerId) : String(c.employerId)
    const peer = userMap[peerId] || {}
    const last = lastByConv[String(c._id)] || null
    return {
      id: c._id,
      jobId: c.jobId,
      jobTitle: c.jobId ? (jobMap[String(c.jobId)]?.title || '') : '',
      peerName: peer.name || 'User',
      peerEmail: peer.email || '',
      lastMessage: last?.text || '',
      lastAt: last?.createdAt || c.updatedAt,
      status: c.status,
    }
  })
  res.json({ conversations: convs })
})

// Get messages in a conversation
router.get('/conversations/:id/messages', auth, async (req,res)=>{
  const conv = await ChatConversation.findById(req.params.id)
  if (!conv) return res.status(404).json({ error: 'Not found' })
  const me = String(req.userId)
  if (me !== String(conv.employerId) && me !== String(conv.seekerId)) return res.status(403).json({ error: 'Forbidden' })
  const msgs = await ChatMessage.find({ conversationId: conv._id }).sort({ createdAt: 1 }).lean()
  res.json({ messages: msgs.map(m=> ({ id: m._id, senderId: m.senderId, text: m.text, createdAt: m.createdAt })) })
})

// Send a new message
router.post('/conversations/:id/messages', auth, async (req,res)=>{
  const conv = await ChatConversation.findById(req.params.id)
  if (!conv) return res.status(404).json({ error: 'Not found' })
  const me = String(req.userId)
  if (me !== String(conv.employerId) && me !== String(conv.seekerId)) return res.status(403).json({ error: 'Forbidden' })
  const text = (req.body?.text || '').trim()
  if (!text) return res.status(400).json({ error: 'Message text required' })
  const msg = await ChatMessage.create({ conversationId: conv._id, senderId: req.userId, text })
  await ChatConversation.updateOne({ _id: conv._id }, { $set: { updatedAt: new Date() } })
  res.json({ message: { id: msg._id, senderId: msg.senderId, text: msg.text, createdAt: msg.createdAt } })
})

module.exports = router