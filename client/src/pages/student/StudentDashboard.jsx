import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

export default function StudentDashboard(){
  const [tab, setTab] = useState('resume')
  const [profile, setProfile] = useState(()=>{
    const saved = typeof window !== 'undefined' ? localStorage.getItem('jobseeker_profile') : null
    if (saved) { try { return JSON.parse(saved) } catch { /* ignore */ } }
    return { name:'', title:'', location:'', email:'', phone:'', links:{ linkedin:'', github:'', portfolio:'' }, summary:'', skills:[], resume:{ fileName:'', updatedAt:'' }, education:[], experience:[], stats:{applied:0,saved:0,views:0}, settings:{ public:true, notifyEmail:true, notifyJobs:true }, achievements:[] }
  })
  useEffect(()=>{ try { localStorage.setItem('jobseeker_profile', JSON.stringify(profile)) } catch {} }, [profile])

  // Applied jobs (localStorage-backed for now)
  const [applied, setApplied] = useState(()=>{
    try { return JSON.parse(localStorage.getItem('applied_jobs')||'[]') } catch { return [] }
  })
  useEffect(()=>{ try { localStorage.setItem('applied_jobs', JSON.stringify(applied)) } catch {} }, [applied])

  const isApplied = (jobId)=> applied.some(a=>a.job.id===jobId)
  const applyToJob = (job)=>{
    if (isApplied(job.id)) return
    setApplied(list=>[...list, { job, status:'applied', appliedAt: new Date().toISOString(), notes:'' }])
  }
  const updateApplication = (jobId, update)=>{
    setApplied(list=> list.map(a=> a.job.id===jobId ? { ...a, ...update } : a))
  }
  const removeApplication = (jobId)=>{
    setApplied(list=> list.filter(a=> a.job.id!==jobId))
  }
  const clearApplications = ()=>{
    if (applied.length === 0) return
    const ok = window.confirm('Clear all applications? This will remove your local application list.')
    if (!ok) return
    setApplied([])
  }

  const statusCounts = useMemo(()=>{
    const init = { applied:0, pending:0, shortlisted:0 }
    return applied.reduce((acc,a)=>{ const k=a.status; if(k in acc){ acc[k] = (acc[k]||0)+1 } return acc }, init)
  }, [applied])

  const statusMeta = {
    applied: { label: 'Applied', cls: 'bg-teal-50 text-teal-700 border border-teal-100' },
    pending: { label: 'Pending', cls: 'bg-yellow-50 text-yellow-800 border border-yellow-200' },
    shortlisted: { label: 'Shortlisted', cls: 'bg-green-50 text-green-700 border border-green-100' },
    interviewing: { label: 'Interviewing', cls: 'bg-blue-50 text-blue-700 border border-blue-100' },
    hired: { label: 'Hired', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
    rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700 border border-red-100' },
  }

  const jobs = useMemo(()=>[
    { id:1, title:'Frontend Developer', company:'TechNova', location:'Hyderabad', tags:['React','JavaScript','CSS','Tailwind'], description:'Build UI components and collaborate with designers.' },
    { id:2, title:'Full Stack Engineer', company:'CloudGrid', location:'Remote', tags:['Node','React','MongoDB','API'], description:'Work across the stack to deliver features.' },
    { id:3, title:'UI Engineer', company:'PixelWorks', location:'Bengaluru', tags:['HTML','CSS','Accessibility','React'], description:'Create accessible interfaces and design systems.' },
    { id:4, title:'React Native Developer', company:'MobilityX', location:'Remote', tags:['React Native','JavaScript','Git'], description:'Ship mobile features quickly.' },
    { id:5, title:'Backend Developer', company:'DataForge', location:'Hyderabad', tags:['Node','Express','PostgreSQL','API'], description:'Design and build scalable APIs.' },
  ], [])

  const keywords = useMemo(()=>{
    const base = new Set([...(profile.skills||[]), ...(profile.title? profile.title.split(/\s+/): [])].map(s=>s.toLowerCase()))
    return Array.from(base).filter(Boolean)
  }, [profile.skills, profile.title])

  const suggestions = useMemo(()=>{
    if (!profile.resume?.fileName) return []
    if (!keywords.length) return jobs.slice(0,3)
    const scored = jobs.map(j=>{
      const hay = (j.title + ' ' + j.company + ' ' + j.location + ' ' + j.tags.join(' ') + ' ' + j.description).toLowerCase()
      const score = keywords.reduce((acc,k)=> acc + (hay.includes(k) ? 1 : 0), 0)
      return { job:j, score }
    }).sort((a,b)=> b.score - a.score)
    const top = scored.filter(s=>s.score>0).slice(0,5).map(s=>s.job)
    return top.length? top : jobs.slice(0,3)
  }, [jobs, keywords, profile.resume])

  const onUploadResume = (e)=>{
    const f = e.target.files?.[0]
    if (!f) return
    setProfile(p=>({ ...p, resume: { fileName: f.name, updatedAt: new Date().toLocaleDateString() } }))
  }
  const onDeleteResume = ()=>{
    if (!profile.resume?.fileName) return
    const ok = window.confirm('Delete your uploaded resume? This cannot be undone.')
    if (!ok) return
    setProfile(p=>({ ...p, resume: { fileName: '', updatedAt: '' } }))
  }
  return (
    <div className="bg-gray-50">
      <div className="container-app section">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Seeker Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your applications and saved jobs</p>
          </div>
          <Link to="/student/profile" className="btn btn-outline">View Profile</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="card p-5 card-hover">
            <p className="text-sm text-gray-500">Applied Jobs</p>
            <p className="mt-1 text-3xl font-extrabold">0</p>
          </div>
          <div className="card p-5 card-hover">
            <p className="text-sm text-gray-500">Saved Jobs</p>
            <p className="mt-1 text-3xl font-extrabold">0</p>
          </div>
          <div className="card p-5 card-hover">
            <p className="text-sm text-gray-500">Profile Views</p>
            <p className="mt-1 text-3xl font-extrabold">0</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="inline-flex rounded-lg overflow-hidden border border-gray-200 bg-gray-100 text-sm">
            <button type="button" onClick={()=>setTab('resume')} className={`px-4 py-2 ${tab==='resume' ? 'bg-white font-medium' : 'text-gray-600'}`}>Resume</button>
            <button type="button" onClick={()=>setTab('applied')} className={`px-4 py-2 ${tab==='applied' ? 'bg-white font-medium' : 'text-gray-600'}`}>Applied Jobs</button>
            <button type="button" onClick={()=>setTab('saved')} className={`px-4 py-2 ${tab==='saved' ? 'bg-white font-medium' : 'text-gray-600'}`}>Saved Jobs</button>
          </div>

          {tab === 'resume' && (
            <div className="mt-6">
              {!profile.resume?.fileName ? (
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
                        <p className="font-medium">{profile.resume.fileName}</p>
                        <p className="text-sm text-gray-600">Updated: {profile.resume.updatedAt}</p>
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
                          <div key={j.id} className="rounded-lg border p-4 card-hover">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{j.title}</p>
                                <p className="text-sm text-gray-600">{j.company} • {j.location}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {isApplied(j.id) ? (
                                  <span className="px-2 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-100">Applied</span>
                                ) : (
                                  <button onClick={()=>applyToJob(j)} className="btn btn-outline text-sm">Apply</button>
                                )}
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {j.tags.map((t,i)=> <span key={i} className="px-2 py-1 rounded-full text-xs bg-gray-100">{t}</span>)}
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
                <div className="rounded-lg border p-4 text-center"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-semibold">{statusCounts.pending}</p></div>
                <div className="rounded-lg border p-4 text-center"><p className="text-sm text-gray-500">Shortlisted</p><p className="text-2xl font-semibold">{statusCounts.shortlisted}</p></div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recent Applications</h3>
                  {applied.length > 0 && (
                    <button onClick={clearApplications} className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50 text-sm">Clear Applications</button>
                  )}
                </div>
                {applied.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-600">No applications yet. Apply from Suggested Jobs in the Resume tab.</p>
                ) : (
                  <div className="mt-4 overflow-hidden rounded-lg border">
                    <table className="min-w-full text-sm">
                      <thead className="bg-blue-600 text-white">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium">Job Title</th>
                          <th className="text-left px-4 py-3 font-medium">Company</th>
                          <th className="text-left px-4 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {applied.map(a=> {
                          const meta = statusMeta[a.status] || statusMeta.applied
                          return (
                            <tr key={a.job.id} className="bg-white">
                              <td className="px-4 py-3">{a.job.title}</td>
                              <td className="px-4 py-3">{a.job.company}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${meta.cls}`}>{meta.label}</span>
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
            <div className="mt-6"></div>
          )}
        </div>
      </div>
    </div>
  )
}
