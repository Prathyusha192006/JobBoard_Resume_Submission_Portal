require('dotenv').config()
const bcrypt = require('bcryptjs')
const { connectDB } = require('../config/db')
const User = require('../models/User')
const JobSeekerProfile = require('../models/JobSeekerProfile')
const EmployerProfile = require('../models/EmployerProfile')
const AdminProfile = require('../models/AdminProfile')

async function upsertUser({ name, email, password, role, roleId, extraProfile = {} }){
  const existing = await User.findOne({ email })
  const passwordHash = await bcrypt.hash(password, 10)
  let user
  if (existing){
    existing.name = name
    existing.role = role
    existing.roleId = roleId
    existing.passwordHash = passwordHash
    user = await existing.save()
  } else {
    user = await User.create({ name, email, passwordHash, role, roleId })
  }
  try {
    if (role === 'jobseeker'){
      await JobSeekerProfile.updateOne(
        { userId: user._id },
        { $set: { userId: user._id, roleId, ...extraProfile } },
        { upsert: true }
      )
    } else if (role === 'employer'){
      await EmployerProfile.updateOne(
        { userId: user._id },
        { $set: { userId: user._id, roleId, ...extraProfile } },
        { upsert: true }
      )
    } else if (role === 'admin'){
      await AdminProfile.updateOne(
        { userId: user._id },
        { $set: { userId: user._id, roleId, ...extraProfile } },
        { upsert: true }
      )
    }
  } catch {}
  return user
}

async function main(){
  if (!process.env.MONGODB_URI){
    console.error('Missing MONGODB_URI in .env')
    process.exit(1)
  }
  await connectDB(process.env.MONGODB_URI)

  await upsertUser({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Passw0rd!',
    role: 'admin',
    roleId: 'ADM001',
    extraProfile: { department: 'Ops' },
  })

  await upsertUser({
    name: 'Employer One',
    email: 'employer@example.com',
    password: 'Passw0rd!',
    role: 'employer',
    roleId: 'EMP001',
    extraProfile: { company: 'Acme Inc', website: 'https://acme.example', location: 'Remote' },
  })

  await upsertUser({
    name: 'Job Seeker',
    email: 'seeker@example.com',
    password: 'Passw0rd!',
    role: 'jobseeker',
    roleId: 'JSK001',
    extraProfile: { title: 'Frontend Developer', skills: ['React','JS'] },
  })

  console.log('Seed complete. Users: admin@example.com, employer@example.com, seeker@example.com (password: Passw0rd!)')
  process.exit(0)
}

main().catch((e)=>{ console.error(e); process.exit(1) })