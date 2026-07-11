import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function StudentDashboard(){
  const [tab, setTab] = useState('resume')
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    location: '',
    email: '',
    phone: '',
    links: { linkedin: '', github: '', portfolio: '' },
    summary: '',
    skills: [],
    resumeUrl: '',
    resumeName: '',
  })
  
  const [applied, setApplied] = useState([])
  const [saved, setSaved] = useState([])
  const [allJobs, setAllJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const navigate = useNavigate()

  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token')
    return { 'Authorization': `Bearer ${token}` }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('auth_token')
      if (!token) {
        navigate('/login')
        return
      }

      // Fetch Profile
      const profileRes = await axios.get('/api/auth/profile', { headers: getAuthHeader() })
      const p = profileRes.data.profile || {}
      setProfile({
        name: profileRes.data.user?.name || '',
        title: p.title || '',
        location: p.location || '',
        email: profileRes.data.user?.email || '',
        phone: p.phone || '',
        links: p.links || { linkedin: '', github: '', portfolio: '' },
        summary: p.summary || '',
        skills: p.skills || [],
        resumeUrl: p.resumeUrl || '',
        resumeName: p.resumeName || '',
      })

      // Fetch Applied Jobs
      const appliedRes = await axios.get('/api/applied', { headers: getAuthHeader() })
      setApplied(appliedRes.data.jobs || [])

      // Fetch Saved Jobs
      const savedRes = await axios.get('/api/saved', { headers: getAuthHeader() })
      setSaved(savedRes.data.jobs || [])

      // Fetch public jobs list for suggestions
      const jobsRes = await axios.get('/api/jobs')
      setAllJobs(jobsRes.data.jobs || [])

    } catch (e) {
      console.error('Error fetching dashboard data:', e)
      setError('Failed to retrieve dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(()=>{
    if (!toast) return
    const t=setTimeout(()=>setToast(''), 1800)
    return ()=>clearTimeout(t)
  },[toast])

  const isApplied = (jobId) => applied.some(a => a._id === jobId)
  
  const applyToJob = async (jobId) => {
    try {
      setToast('Applying...')
      await axios.post('/api/applied', { jobId }, { headers: getAuthHeader() })
      setToast('Applied successfully!')
      fetchData() // refresh lists
    } catch (e) {
      setError('Failed to apply to job')
    }
  }

  const unsaveJob = async (jobId) => {
    try {
      await axios.delete(`/api/saved/${jobId}`, { headers: getAuthHeader() })
      setToast('Job unsaved')
      fetchData()
    } catch (e) {
      setError('Failed to unsave job')
    }
  }

  const keywords = useMemo(()=>{
    const base = new Set([...(profile.skills||[]), ...(profile.title? profile.title.split(/\s+/): [])].map(s=>s.toLowerCase()))
    return Array.from(base).filter(Boolean)
  }, [profile.skills, profile.title])

  const suggestions = useMemo(()=>{
    if (!profile.resumeUrl) return []
    if (!keywords.length) return allJobs.slice(0,3)
    const scored = allJobs.map(j=>{
      const hay = (j.title + ' ' + (j.company||'') + ' ' + (j.location||'') + ' ' + (j.tags||[]).join(' ') + ' ' + (j.description||'')).toLowerCase()
      const score = keywords.reduce((acc,k)=> acc + (hay.includes(k) ? 1 : 0), 0)
      return { job:j, score }
    }).sort((a,b)=> b.score - a.score)
    const top = scored.filter(s=>s.score>0).slice(0,5).map(s=>s.job)
    return top.length? top : allJobs.slice(0,3)
  }, [allJobs, keywords, profile.resumeUrl])

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
      
      setProfile(p => ({
        ...p,
        resumeUrl: data.resumeUrl,
        resumeName: data.fileName
      }))

      // save URL to profile
      await axios.put('/api/auth/profile', {
        resumeUrl: data.resumeUrl,
        resumeName: data.fileName
      }, { headers: getAuthHeader() })
      
      setToast('Resume updated successfully')
      fetchData()
    } catch (err) {
      setError('Failed to upload resume')
    }
  }

  const onDeleteResume = async () => {
    if (!profile.resumeUrl) return
    const ok = window.confirm('Delete your uploaded resume? This cannot be undone.')
    if (!ok) return
    
    try {
      await axios.put('/api/auth/profile', {
        resumeUrl: '',
        resumeName: ''
      }, { headers: getAuthHeader() })
      setProfile(p => ({ ...p, resumeUrl: '', resumeName: '' }))
      setToast('Resume deleted')
      fetchData()
    } catch (err) {
      setError('Failed to delete resume')
    }
  }

  const statusMeta = {
    applied: { label: 'Applied', cls: 'bg-teal-50 text-teal-700 border border-teal-100' },
    pending: { label: 'Pending', cls: 'bg-yellow-50 text-yellow-800 border border-yellow-200' },
    shortlisted: { label: 'Shortlisted', cls: 'bg-green-50 text-green-700 border border-green-100' },
    interviewing: { label: 'Interviewing', cls: 'bg-blue-50 text-blue-700 border border-blue-100' },
    hired: { label: 'Hired', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
    rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700 border border-red-100' },
  }

  const statusCounts = useMemo(()=>{
    const init = { applied:0, pending:0, shortlisted:0, interviewing:0, hired:0, rejected:0 }
    return applied.reduce((acc,a)=>{ 
      const k = a.status || 'applied'
      if(k in acc){ acc[k] = acc[k]+1 } 
      return acc 
    }, init)
  }, [applied])

  if (loading) {
    return (
      <div className="container-app section text-center py-20">
        <p className="text-gray-600">Loading student dashboard...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <div className="container-app section">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Seeker Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {profile.name || 'Student'}!</p>
          </div>
          <Link to="/student/profile" className="btn btn-outline">View Profile</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="card p-5 card-hover">
            <p className="text-sm text-gray-500">Applied Jobs</p>
            <p className="mt-1 text-3xl font-extrabold">{applied.length}</p>
          </div>
          <div className="card p-5 card-hover">
            <p className="text-sm text-gray-500">Saved Jobs</p>
            <p className="mt-1 text-3xl font-extrabold">{saved.length}</p>
          </div>
          <div className="card p-5 card-hover">
            <p className="text-sm text-gray-500">Profile Skills</p>
            <p className="mt-1 text-3xl font-extrabold">{profile.skills.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="inline-flex rounded-lg overflow-hidden border border-gray-200 bg-gray-100 text-sm">
            <button type="button" onClick={()=>setTab('resume')} className={`px-4 py-2 ${tab==='resume' ? 'bg-white font-medium' : 'text-gray-600'}`}>Resume & Suggestions</button>
            <button type="button" onClick={()=>setTab('applied')} className={`px-4 py-2 ${tab==='applied' ? 'bg-white font-medium' : 'text-gray-600'}`}>Applied Jobs</button>
            <button type="button" onClick={()=>setTab('saved')} className={`px-4 py-2 ${tab==='saved' ? 'bg-white font-medium' : 'text-gray-600'}`}>Saved Jobs</button>
          </div>

          {tab === 'resume' && (
            <div className="mt-6">
              {!profile.resumeUrl ? (
                <div className="card p-10 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-indigo-50 ring-1 ring-indigo-100 flex items-center justify-center">
                    <span className="h-6 w-6 rounded-full bg-indigo-400/80"></span>
                  </div>
                  <h3 className="text-lg font-semibold">No Resume Uploaded</h3>
                  <p className="text-sm text-gray-600 mt-1 max-w-md mx-auto">Upload your resume to get personalized job suggestions based on your skills and experience.</p>
                  <div className="mt-5">
                    <label className="btn w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">
                      Upload New Resume
                      <input type="file" accept="application/pdf" onChange={onUploadResume} className="hidden"/>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Current Resume</p>
                        <p className="font-medium">{profile.resumeName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="btn btn-outline cursor-pointer">
                          Replace
                          <input type="file" accept="application/pdf" onChange={onUploadResume} className="hidden"/>
                        </label>
                        <button onClick={onDeleteResume} className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50">Delete</button>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Suggested Jobs for You</h3>
                      <Link to="/student/jobs" className="text-sm text-indigo-600 hover:underline">View all</Link>
                    </div>
                    {suggestions.length === 0 ? (
                      <p className="mt-3 text-sm text-gray-600">No suggestions yet. Try adding skills to your profile.</p>
                    ) : (
                      <div className="mt-4 grid md:grid-cols-2 gap-4">
                        {suggestions.map(j => (
                          <div key={j._id} className="rounded-lg border p-4 card-hover">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-lg text-indigo-700">{j.title}</p>
                                <p className="text-sm text-gray-600">{j.company} • {j.location}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {isApplied(j._id) ? (
                                  <span className="px-2 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-100">Applied</span>
                                ) : (
                                  <button onClick={()=>applyToJob(j._id)} className="btn btn-outline text-sm">Apply</button>
                                )}
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {(j.tags || []).map((t,i)=> <span key={i} className="px-2 py-1 rounded-full text-xs bg-gray-100">{t}</span>)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {tab === 'applied' && (
            <div className="mt-6 space-y-6">
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="rounded-lg border p-4 text-center"><p className="text-sm text-gray-500">Applied</p><p className="text-2xl font-semibold">{statusCounts.applied}</p></div>
                <div className="rounded-lg border p-4 text-center"><p className="text-sm text-gray-500">Shortlisted</p><p className="text-2xl font-semibold">{statusCounts.shortlisted}</p></div>
                <div className="rounded-lg border p-4 text-center"><p className="text-sm text-gray-500">Interviewing</p><p className="text-2xl font-semibold">{statusCounts.interviewing}</p></div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
                {applied.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-600">No applications yet. Apply from Suggested Jobs or the Browse Jobs feed.</p>
                ) : (
                  <div className="overflow-hidden rounded-lg border">
                    <table className="min-w-full text-sm">
                      <thead className="bg-blue-600 text-white">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium">Job Title</th>
                          <th className="text-left px-4 py-3 font-medium">Company</th>
                          <th className="text-left px-4 py-3 font-medium">Applied At</th>
                          <th className="text-left px-4 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {applied.map(a => {
                          const meta = statusMeta[a.status] || statusMeta.applied
                          return (
                            <tr key={a._id} className="bg-white">
                              <td className="px-4 py-3 font-medium">{a.title}</td>
                              <td className="px-4 py-3">{a.company || '-'}</td>
                              <td className="px-4 py-3 text-gray-500">{new Date(a.appliedAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${meta.cls}`}>{meta.label}</span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {tab === 'saved' && (
            <div className="mt-6 card p-6">
              <h3 className="text-lg font-semibold mb-4">Saved Jobs</h3>
              {saved.length === 0 ? (
                <p className="text-sm text-gray-600">You haven't saved any jobs yet.</p>
              ) : (
                <div className="grid gap-4">
                  {saved.map(j => (
                    <div key={j._id} className="rounded-lg border p-4 card-hover flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg text-indigo-700">{j.title}</p>
                        <p className="text-sm text-gray-600">{j.company} • {j.location}</p>
                        <p className="text-xs text-gray-500 mt-1">Saved on: {new Date(j.savedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        {isApplied(j._id) ? (
                          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 grid place-items-center">Applied</span>
                        ) : (
                          <button onClick={()=>applyToJob(j._id)} className="btn btn-primary text-sm">Apply Now</button>
                        )}
                        <button onClick={()=>unsaveJob(j._id)} className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50 text-sm">Unsave</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {toast && (<div className="fixed bottom-6 right-6 rounded-lg bg-black text-white px-4 py-2 text-sm shadow-lg z-50">{toast}</div>)}
      {error && (<div className="fixed bottom-6 left-6 rounded-lg bg-red-600 text-white px-4 py-2 text-sm shadow-lg z-50">{error}</div>)}
    </div>
  )
}
