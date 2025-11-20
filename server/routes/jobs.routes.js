const express = require('express')
const Job = require('../models/Job')

const router = express.Router()

// List jobs with simple search
router.get('/', async (req,res) => {
  const { search = '', tags = '', location = '' } = req.query
  const q = {}
  if (search) q.$or = [
    { title: new RegExp(search, 'i') },
    { company: new RegExp(search, 'i') },
    { description: new RegExp(search, 'i') },
  ]
  if (location) q.location = new RegExp(location, 'i')
  if (tags) q.tags = { $in: String(tags).split(',').map(t=>t.trim()).filter(Boolean) }
  const jobs = await Job.find(q).sort({ createdAt: -1 }).limit(100)
  res.json({ jobs })
})

// Get job by id
router.get('/:id', async (req,res)=>{
  const job = await Job.findById(req.params.id)
  if (!job) return res.status(404).json({ error: 'Not found' })
  res.json({ job })
})

module.exports = router
