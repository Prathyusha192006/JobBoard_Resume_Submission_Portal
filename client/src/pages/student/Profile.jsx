import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Profile(){
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const [profile, setProfile] = useState({
    name: '',
    title: '',
    location: '',
    email: '',
    phone: '',
    links: { linkedin: '', github: '', portfolio: '' },
    summary: '',
    skills: [],
    resume: { fileName: '', updatedAt: '' },
    resumeUrl: '',
    education: [],
    experience: [],
    stats: { applied: 0, saved: 0, views: 0 },
    settings: { public: true, notifyEmail: true, notifyJobs: true },
    achievements: [],
  })

  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token')
    return { 'Authorization': `Bearer ${token}` }
  }

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/auth/profile', { headers: getAuthHeader() })
      const p = data.profile || {}
      setProfile({
        name: data.user?.name || '',
        title: p.title || '',
        location: p.location || '',
        email: data.user?.email || '',
        phone: p.phone || '',
        links: p.links || { linkedin: '', github: '', portfolio: '' },
        summary: p.summary || '',
        skills: p.skills || [],
        resume: { 
          fileName: p.resumeName || '', 
          updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '' 
        },
        resumeUrl: p.resumeUrl || '',
        education: p.education || [],
        experience: p.experience || [],
        stats: p.stats || { applied: 0, saved: 0, views: 0 },
        settings: p.settings || { public: true, notifyEmail: true, notifyJobs: true },
        achievements: p.achievements || [],
      })
    } catch (e) {
      console.error('Error fetching profile:', e)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const saveProfileToServer = async (updatedFields) => {
    try {
      const payload = {
        name: updatedFields.name !== undefined ? updatedFields.name : profile.name,
        title: updatedFields.title !== undefined ? updatedFields.title : profile.title,
        location: updatedFields.location !== undefined ? updatedFields.location : profile.location,
        phone: updatedFields.phone !== undefined ? updatedFields.phone : profile.phone,
        links: updatedFields.links !== undefined ? updatedFields.links : profile.links,
        summary: updatedFields.summary !== undefined ? updatedFields.summary : profile.summary,
        skills: updatedFields.skills !== undefined ? updatedFields.skills : profile.skills,
        resumeUrl: updatedFields.resumeUrl !== undefined ? updatedFields.resumeUrl : profile.resumeUrl,
        resumeName: updatedFields.resumeName !== undefined ? updatedFields.resumeName : profile.resume.fileName,
        education: updatedFields.education !== undefined ? updatedFields.education : profile.education,
        experience: updatedFields.experience !== undefined ? updatedFields.experience : profile.experience,
        settings: updatedFields.settings !== undefined ? updatedFields.settings : profile.settings,
        achievements: updatedFields.achievements !== undefined ? updatedFields.achievements : profile.achievements
      }
      
      const { data } = await axios.put('/api/auth/profile', payload, { headers: getAuthHeader() })
      if (data.user?.name) {
        localStorage.setItem('user_name', data.user.name)
      }
      setToast('Profile saved successfully!')
    } catch (err) {
      console.error('Error saving profile:', err)
      setError('Failed to save profile changes')
    }
  }

  const completion = useMemo(()=>{
    let score = 0
    if (profile.summary) score += 15
    if (profile.skills.length) score += 20
    if (profile.resumeUrl) score += 20
    if (profile.education.length) score += 15
    if (profile.experience.length) score += 20
    if (profile.links.linkedin || profile.links.github || profile.links.portfolio) score += 10
    return Math.min(100, score)
  }, [profile])

  useEffect(()=>{
    if (!toast) return
    const t = setTimeout(()=>setToast(''), 1800)
    return ()=>clearTimeout(t)
  },[toast])

  useEffect(()=>{
    if (!error) return
    const t = setTimeout(()=>setError(''), 2500)
    return ()=>clearTimeout(t)
  },[error])

  const [showEditBasic, setShowEditBasic] = useState(false)
  const [showEditSummary, setShowEditSummary] = useState(false)
  const [newSkill, setNewSkill] = useState('')

  const onUploadResume = async (e)=>{
    const f = e.target.files?.[0]
    if (!f) return
    
    const formData = new FormData()
    formData.append('resume', f)
    
    try {
      setToast('Uploading resume...')
      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'multipart/form-data'
        }
      })
      
      const updatedProfile = {
        ...profile,
        resumeUrl: data.resumeUrl,
        resume: { fileName: data.fileName, updatedAt: new Date().toLocaleDateString() }
      }
      setProfile(updatedProfile)
      
      await saveProfileToServer({
        resumeUrl: data.resumeUrl,
        resumeName: data.fileName
      })
      setToast('Resume uploaded successfully')
    } catch (err) {
      console.error(err)
      setError('Failed to upload resume')
    }
  }

  const onDeleteResume = async () => {
    if (!profile.resumeUrl) return
    const ok = window.confirm('Delete your uploaded resume? This cannot be undone.')
    if (!ok) return
    
    try {
      const updatedProfile = {
        ...profile,
        resumeUrl: '',
        resume: { fileName: '', updatedAt: '' }
      }
      setProfile(updatedProfile)
      
      await saveProfileToServer({
        resumeUrl: '',
        resumeName: ''
      })
      setToast('Resume deleted')
    } catch (err) {
      console.error(err)
      setError('Failed to delete resume')
    }
  }

  if (loading) {
    return (
      <div className="container-app section text-center py-20">
        <p className="text-gray-600 text-lg">Loading your profile...</p>
      </div>
    )
  }

  return (
    <div className="container-app section">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Job Seeker Profile</h1>
        <Link to="/student" className="btn btn-outline">Back to Dashboard</Link>
      </div>

      {/* Basic Info */}
      <section className="mt-6 card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="h-16 w-16 rounded-full bg-indigo-600 text-white grid place-items-center text-2xl font-semibold">
              {(profile.name && profile.name[0]) || '?'}
            </span>
            <div>
              <h2 className="text-xl font-semibold">{profile.name || 'Your Name'}</h2>
              <p className="text-sm text-gray-700">{profile.title || 'Desired Job Title'} { (profile.title || profile.location) ? '•' : '' } {profile.location || 'Location'}</p>
              <div className="mt-1 text-sm text-gray-600">
                <span>{profile.email || 'email@example.com'}</span>
                <span className="mx-2">•</span>
                <span>{profile.phone || '+91 XXXXX XXXXX'}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                {profile.links.linkedin && <a className="text-indigo-600 hover:underline" href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
                {profile.links.github && <a className="text-indigo-600 hover:underline" href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>}
                {profile.links.portfolio && <a className="text-indigo-600 hover:underline" href={profile.links.portfolio} target="_blank" rel="noreferrer">Portfolio</a>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={()=>setShowEditBasic(true)} className="btn btn-outline">Edit Profile</button>
          </div>
        </div>
        {/* Completion */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium">Profile completion</span>
            <span>{completion}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-200">
            <div className="h-2 rounded-full bg-indigo-600" style={{width: `${completion}%`}}></div>
          </div>
        </div>
      </section>

      {/* Professional Summary */}
      <section className="mt-6 card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Professional Summary</h3>
          <button onClick={()=>setShowEditSummary(true)} className="btn btn-outline">Edit</button>
        </div>
        <p className="mt-3 text-gray-700 leading-relaxed">{profile.summary || 'Add a short bio about your goals, strengths and experience.'}</p>
      </section>

      {/* Skills */}
      <section className="mt-6 card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Skills</h3>
          <div className="flex items-center gap-2">
            <input value={newSkill} onChange={(e)=>setNewSkill(e.target.value)} placeholder="Add a skill" className="rounded-lg border px-3 py-2 text-sm"/>
            <button onClick={async ()=>{ if(newSkill.trim()){ const newSkills = [...profile.skills, newSkill.trim()]; setProfile(p=>({...p, skills:newSkills})); setNewSkill(''); await saveProfileToServer({ skills: newSkills }) } }} className="btn btn-outline">Add</button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.skills.map((s,i)=> (
            <span key={i} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-700 border border-indigo-100">
              {s}
              <button onClick={async ()=>{ const newSkills = profile.skills.filter((_,idx)=>idx!==i); setProfile(p=>({...p, skills: newSkills})); await saveProfileToServer({ skills: newSkills }) }} className="text-indigo-600">×</button>
            </span>
          ))}
        </div>
      </section>

      {/* Resume */}
      <section className="mt-6 card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Resume</h3>
          <div className="flex items-center gap-2">
            <label className="btn btn-outline cursor-pointer">
              Upload/Update
              <input type="file" accept="application/pdf" onChange={onUploadResume} className="hidden"/>
            </label>
            {profile.resumeUrl && (
              <button onClick={onDeleteResume} className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50">Delete</button>
            )}
          </div>
        </div>
        {profile.resumeUrl ? (
          <div className="mt-3 text-sm text-gray-700">
            <p>File: <span className="font-medium">{profile.resume.fileName}</span></p>
            {profile.resume.updatedAt && <p className="text-gray-600">Updated: {profile.resume.updatedAt}</p>}
            <a className="mt-3 inline-block btn btn-outline" href={profile.resumeUrl} target="_blank" rel="noreferrer">View Resume</a>
          </div>
        ) : (
          <div className="mt-4 text-sm text-gray-600">No resume uploaded.</div>
        )}
      </section>

      {/* Education */}
      <section className="mt-6 card p-6">
        <h3 className="text-lg font-semibold">Education</h3>
        <div className="mt-4 space-y-4">
          {profile.education.map((e,i)=> (
            <div key={i} className="rounded-lg border p-4">
              <p className="font-medium">{e.degree}</p>
              <p className="text-sm text-gray-700">{e.school}</p>
              <p className="text-sm text-gray-600">Year: {e.year} • GPA: {e.gpa}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience timeline */}
      <section className="mt-6 card p-6">
        <h3 className="text-lg font-semibold">Experience</h3>
        <div className="mt-4 relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>
          <div className="space-y-6">
            {profile.experience.map((x,i)=> (
              <div key={i} className="relative pl-10">
                <span className="absolute left-2 top-1 h-3 w-3 rounded-full bg-indigo-600"></span>
                <p className="font-medium">{x.role} • {x.company}</p>
                <p className="text-sm text-gray-600">{x.period}</p>
                <p className="text-sm text-gray-700 mt-1">{x.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements / Certifications */}
      <section className="mt-6 card p-6">
        <h3 className="text-lg font-semibold">Achievements & Certifications</h3>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          {profile.achievements.map((a,i)=> (
            <div key={i} className="rounded-lg border p-4">
              <p className="font-medium">{a.name}</p>
              <p className="text-sm text-gray-600">{a.issuer}</p>
              {a.link && <a className="text-sm text-indigo-600 hover:underline" href={a.link} target="_blank" rel="noreferrer">Verify</a>}
            </div>
          ))}
        </div>
      </section>

      {/* Settings & Privacy */}
      <section className="mt-6 card p-6">
        <h3 className="text-lg font-semibold">Settings & Privacy</h3>
        <div className="mt-3 space-y-3 text-sm">
          <label className="flex items-center gap-3"><input type="checkbox" checked={profile.settings.public} onChange={async (e)=>{ const newSettings = {...profile.settings, public:e.target.checked}; setProfile(p=>({...p, settings:newSettings})); await saveProfileToServer({ settings: newSettings }) }}/> Profile visible to employers</label>
          <label className="flex items-center gap-3"><input type="checkbox" checked={profile.settings.notifyEmail} onChange={async (e)=>{ const newSettings = {...profile.settings, notifyEmail:e.target.checked}; setProfile(p=>({...p, settings:newSettings})); await saveProfileToServer({ settings: newSettings }) }}/> Email notifications</label>
          <label className="flex items-center gap-3"><input type="checkbox" checked={profile.settings.notifyJobs} onChange={async (e)=>{ const newSettings = {...profile.settings, notifyJobs:e.target.checked}; setProfile(p=>({...p, settings:newSettings})); await saveProfileToServer({ settings: newSettings }) }}/> Job alerts</label>
        </div>
      </section>

      {/* Edit basic modal */}
      {showEditBasic && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-md">
            <h4 className="text-lg font-semibold mb-3">Edit Basic Information</h4>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <input className="rounded-lg border px-3 py-2" value={profile.name} onChange={e=>setProfile(p=>({...p, name:e.target.value}))} placeholder="Full name"/>
              <input className="rounded-lg border px-3 py-2" value={profile.title} onChange={e=>setProfile(p=>({...p, title:e.target.value}))} placeholder="Desired job title"/>
              <input className="rounded-lg border px-3 py-2" value={profile.location} onChange={e=>setProfile(p=>({...p, location:e.target.value}))} placeholder="Location"/>
              <input className="rounded-lg border px-3 py-2" value={profile.email} onChange={e=>setProfile(p=>({...p, email:e.target.value}))} placeholder="Email" disabled/>
              <input className="rounded-lg border px-3 py-2" value={profile.phone} onChange={e=>setProfile(p=>({...p, phone:e.target.value}))} placeholder="Phone"/>
              <input className="rounded-lg border px-3 py-2 sm:col-span-2" value={profile.links.linkedin} onChange={e=>setProfile(p=>({...p, links:{...p.links, linkedin:e.target.value}}))} placeholder="LinkedIn URL"/>
              <input className="rounded-lg border px-3 py-2 sm:col-span-2" value={profile.links.github} onChange={e=>setProfile(p=>({...p, links:{...p.links, github:e.target.value}}))} placeholder="GitHub URL"/>
              <input className="rounded-lg border px-3 py-2 sm:col-span-2" value={profile.links.portfolio} onChange={e=>setProfile(p=>({...p, links:{...p.links, portfolio:e.target.value}}))} placeholder="Portfolio URL"/>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>{ setShowEditBasic(false); fetchProfile() }} className="btn btn-outline">Cancel</button>
              <button onClick={async ()=>{ setShowEditBasic(false); await saveProfileToServer(profile) }} className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit summary modal */}
      {showEditSummary && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-md">
            <h4 className="text-lg font-semibold mb-3">Edit Summary</h4>
            <textarea className="w-full rounded-lg border px-3 py-2 min-h-40" value={profile.summary} onChange={e=>setProfile(p=>({...p, summary:e.target.value}))} />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>{ setShowEditSummary(false); fetchProfile() }} className="btn btn-outline">Cancel</button>
              <button onClick={async ()=>{ setShowEditSummary(false); await saveProfileToServer({ summary: profile.summary }) }} className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 rounded-lg bg-black text-white px-4 py-2 text-sm shadow-lg">
          {toast}
        </div>
      )}
      {error && (
        <div className="fixed bottom-6 left-6 rounded-lg bg-red-600 text-white px-4 py-2 text-sm shadow-lg">
          {error}
        </div>
      )}
    </div>
  )
}
