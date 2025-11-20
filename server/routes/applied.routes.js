const express = require('express')
const AppliedJob = require('../models/AppliedJob')
const Job = require('../models/Job')
const auth = require('../middleware/auth')

const router = express.Router()

// Get applied jobs for current user
router.get('/', auth, async (req,res) => {
  const items = await AppliedJob.find({ userId: req.userId }).populate('jobId')
  const jobs = items.map(i => ({ ...i.jobId.toObject(), appliedAt: i.appliedAt, status: i.status, notes: i.notes }))
  res.json({ jobs })
})

// Apply to a job
router.post('/', auth, async (req,res) => {
  const { jobId, notes = '' } = req.body || {}
  if (!jobId) return res.status(400).json({ error: 'jobId is required' })
  const job = await Job.findById(jobId)
  if (!job) return res.status(404).json({ error: 'Job not found' })
  try {
    await AppliedJob.create({ userId: req.userId, jobId, notes })
    res.json({ ok: true })
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: 'Already applied' })
    res.status(500).json({ error: 'Failed to apply' })
  }
})

// Update status/notes
router.patch('/:jobId', auth, async (req,res) => {
  const { status, notes } = req.body || {}
  const allowed = ['applied','interviewing','rejected','hired']
  const update = {}
  if (status && allowed.includes(status)) update.status = status
  if (typeof notes === 'string') update.notes = notes
  const doc = await AppliedJob.findOneAndUpdate(
    { userId: req.userId, jobId: req.params.jobId },
    { $set: update },
    { new: true }
  )
  if (!doc) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

// Remove applied record
router.delete('/:jobId', auth, async (req,res) => {
  await AppliedJob.deleteOne({ userId: req.userId, jobId: req.params.jobId })
  res.json({ ok: true })
})

module.exports = router
