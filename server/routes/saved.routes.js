const express = require('express')
const SavedJob = require('../models/SavedJob')
const Job = require('../models/Job')
const auth = require('../middleware/auth')

const router = express.Router()

// Get saved jobs for current user
router.get('/', auth, async (req,res) => {
  const items = await SavedJob.find({ userId: req.userId }).populate('jobId')
  const jobs = items.map(i => ({ ...i.jobId.toObject(), savedAt: i.savedAt }))
  res.json({ jobs })
})

// Save a job
router.post('/', auth, async (req,res) => {
  const { jobId } = req.body || {}
  if (!jobId) return res.status(400).json({ error: 'jobId is required' })
  const job = await Job.findById(jobId)
  if (!job) return res.status(404).json({ error: 'Job not found' })
  try {
    await SavedJob.create({ userId: req.userId, jobId })
    res.json({ ok: true })
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: 'Already saved' })
    res.status(500).json({ error: 'Failed to save' })
  }
})

// Unsave a job
router.delete('/:jobId', auth, async (req,res) => {
  await SavedJob.deleteOne({ userId: req.userId, jobId: req.params.jobId })
  res.json({ ok: true })
})

module.exports = router
