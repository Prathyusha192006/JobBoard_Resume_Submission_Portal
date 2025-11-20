const express = require('express')
const Job = require('../models/Job')
const AppliedJob = require('../models/AppliedJob')
const auth = require('../middleware/auth')

const router = express.Router()

// Create a job (employer only)
router.post('/jobs', auth, async (req,res)=>{
  try{
    const { title, description='', requiredSkills='', salary='', location='Remote', company } = req.body || {}
    if (!title) return res.status(400).json({ error: 'Title is required' })
    const tags = String(requiredSkills||'').split(',').map(s=>s.trim()).filter(Boolean)
    const job = await Job.create({
      title,
      description,
      tags,
      location,
      url: '',
      salary,
      employerId: req.userId,
      company: company || 'Your Company'
    })
    res.json({ job })
  }catch(e){
    res.status(500).json({ error: 'Failed to create job' })
  }
})

// List employer's jobs
router.get('/jobs', auth, async (req,res)=>{
  const jobs = await Job.find({ employerId: req.userId }).sort({ createdAt: -1 })
  res.json({ jobs })
})

// Update a job
router.patch('/jobs/:id', auth, async (req,res)=>{
  const job = await Job.findOne({ _id: req.params.id, employerId: req.userId })
  if (!job) return res.status(404).json({ error: 'Not found' })
  const { title, description, requiredSkills, salary, location } = req.body || {}
  if (title !== undefined) job.title = title
  if (description !== undefined) job.description = description
  if (requiredSkills !== undefined) job.tags = String(requiredSkills).split(',').map(s=>s.trim()).filter(Boolean)
  if (salary !== undefined) job.salary = salary
  if (location !== undefined) job.location = location
  await job.save()
  res.json({ job })
})

// Delete a job
router.delete('/jobs/:id', auth, async (req,res)=>{
  const job = await Job.findOneAndDelete({ _id: req.params.id, employerId: req.userId })
  if (!job) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

// View applicants for a job
router.get('/jobs/:id/applicants', auth, async (req,res)=>{
  const job = await Job.findOne({ _id: req.params.id, employerId: req.userId })
  if (!job) return res.status(404).json({ error: 'Not found' })
  const items = await AppliedJob.find({ jobId: job._id }).populate('userId', 'name email')
  const applicants = items.map(a=> ({
    id: a._id,
    name: a.userId?.name || 'Applicant',
    email: a.userId?.email || '',
    resumeUrl: a.resumeUrl || '',
    appliedAt: a.appliedAt,
    status: a.status,
  }))
  res.json({ applicants })
})

module.exports = router
