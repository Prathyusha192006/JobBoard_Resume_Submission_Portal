import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function EmployerDashboard(){
  const [form, setForm] = useState({ title:'', description:'', requiredSkills:'', salary:'', location:'', company:'' })
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [posting, setPosting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const [edit, setEdit] = useState(null) // job to edit
  const [applicantsJob, setApplicantsJob] = useState(null)
  const [applicants, setApplicants] = useState([])
const [jobType, setJobType] = useState('all');
  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      console.error('No auth token found in localStorage')
      return {}
    }
    return { 'Authorization': `Bearer ${token}` }
  }
const fetchJobs = async () => {
  setLoading(true);
  setError('');

  try {
    const url = jobType === 'all' 
      ? '/api/employer/jobs'
      : `/api/employer/jobs?type=${jobType}`;

    const { data } = await axios.get(url, { 
      headers: getAuthHeader() 
    });

    setJobs(data.jobs || []);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    setError('Failed to load jobs');
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      navigate('/login');
    }
  } finally {
    setLoading(false);
  }
};
  useEffect(()=>{ fetchJobs() }, [])
  useEffect(()=>{ if(!toast) return; const t=setTimeout(()=>setToast(''),1800); return ()=>clearTimeout(t) },[toast])
  useEffect(()=>{ if(!error) return; const t=setTimeout(()=>setError(''),2500); return ()=>clearTimeout(t) },[error])

 const onPost = async (e) => {
  e.preventDefault();
  setPosting(true);
  setError('');

  try {
    const payload = {
      ...form,
      type: jobType, // Include the selected job type
      requiredSkills: form.requiredSkills.split(',').map(skill => skill.trim()).filter(Boolean)
    };

    const response = await axios.post('/api/employer/jobs', payload, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.job) {
      setJobs(jobs => [response.data.job, ...jobs]);
      setForm({ 
        title: '', 
        description: '', 
        requiredSkills: '', 
        salary: '', 
        location: '', 
        company: '' 
      });
      setJobType('all'); // Reset job type after posting
      setToast('Job posted successfully!');
    }
  } catch (error) {
    console.error('Error posting job:', error);
    setError(error.response?.data?.message || 'Failed to post job');
  } finally {
    setPosting(false);
  }
};

  const openEdit = (job)=>{ setEdit({ ...job, requiredSkills:(job.tags||[]).join(', ') }) }
  const saveEdit = async()=>{
    setSaving(true)
    setError('')
    try{
      const { _id, title, description, requiredSkills, salary, location } = edit
      const { data } = await axios.patch(`/api/employer/jobs/${_id}`, { title, description, requiredSkills, salary, location }, { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } })
      // re-fetch to ensure consistency
      await fetchJobs()
      setEdit(null)
      setToast('Job updated')
    }catch(e){ setError('Failed to update job') }
    finally{ setSaving(false) }
  }
  const removeJob = async(id)=>{
    const ok = window.confirm('Delete this job?')
    if(!ok) return
    setError('')
    try{
      await axios.delete(`/api/employer/jobs/${id}`, { headers: getAuthHeader() })
      await fetchJobs()
      setToast('Job deleted')
    }catch(e){ setError('Failed to delete job') }
  }
  const viewApplicants = async(job)=>{
    setError('')
    try{
      const { data } = await axios.get(`/api/employer/jobs/${job._id}/applicants`, { headers: getAuthHeader() })
      setApplicants(data.applicants||[])
      setApplicantsJob(job)
    }catch(e){ setError('Failed to load applicants') }
  }

  const total = jobs.length

  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    navigate('/login')
  }

  return (
    <div className="container-app section">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Employer Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="rounded-lg border px-3 py-2 text-sm">Total Jobs: <span className="font-semibold">{total}</span></div>
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                {localStorage.getItem('user_name')?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline">Profile</span>
              <svg 
                className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
        {isProfileOpen && (
  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
    <a
      href="#"
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      onClick={(e) => {
        e.preventDefault();
        window.location.reload();
        setIsProfileOpen(false);
      }}
    >
      My Profile
    </a>
    <a
      href="#"
      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
      onClick={(e) => {
        e.preventDefault();
        handleLogout();
        setIsProfileOpen(false);
      }}
    >
      Logout
    </a>
  </div>
)}
          </div>
        </div>
      </div>


      {/* Post Job Form */}
      <form onSubmit={onPost} className="mt-6 card p-6 grid gap-4">
        <h3 className="text-lg font-semibold">Post a New Job</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Title</label>
            <input className="input" value={form.title} onChange={e=>setForm(s=>({...s, title:e.target.value}))} placeholder="e.g., Frontend Developer" required />
          </div>
          <div>
            <label className="label">Company</label>
            <input className="input" value={form.company} onChange={e=>setForm(s=>({...s, company:e.target.value}))} placeholder="Your Company Pvt Ltd" />
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={e=>setForm(s=>({...s, location:e.target.value}))} placeholder="Hyderabad / Remote" />
          </div>
          <div>
            <label className="label">Required Skills (comma separated)</label>
            <input className="input" value={form.requiredSkills} onChange={e=>setForm(s=>({...s, requiredSkills:e.target.value}))} placeholder="React, Node, MongoDB" />
          </div>
          <div>
            <label className="label">Salary</label>
            <input className="input" value={form.salary} onChange={e=>setForm(s=>({...s, salary:e.target.value}))} placeholder="₹ 8-12 LPA" />
          </div>
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea className="input min-h-28" value={form.description} onChange={e=>setForm(s=>({...s, description:e.target.value}))} placeholder="Role description" />
          </div>
        </div>
        <div className="flex items-center gap-4">
  <div className="relative">
    <select
      value={jobType}
      onChange={(e) => setJobType(e.target.value)}
      className="appearance-none bg-white border rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="all">All Job Types</option>
      <option value="full-time">Full-time</option>
      <option value="part-time">Part-time</option>
      <option value="remote">Remote</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  </div>
  
</div>
        <div>
          <button disabled={posting} className="btn bg-blue-600 hover:bg-blue-500 text-white">{posting? 'Posting...':'Post Job'}</button>
        </div>
        
      </form>


      {/* Jobs List */}
     {/* Jobs List */}
<section className="mt-6 card p-6">
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold">Your Job Posts</h3>
    <div className="flex items-center gap-4">
      <div className="relative">
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="appearance-none bg-white border rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Job Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="remote">Remote</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="rounded-lg border px-3 py-2 text-sm">Total Jobs: <span className="font-semibold">{total}</span></div>
    </div>
  </div>
  {error && (<p className="text-sm text-red-600">{error}</p>)}
  {loading ? (
    <p className="mt-2 text-sm text-gray-600">Loading jobs...</p>
  ) : jobs.length === 0 ? (
    <p className="mt-2 text-sm text-gray-600">No jobs yet. Use the form above to post a job.</p>
  ) : (
    <div className="mt-4 overflow-hidden rounded-lg border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Title</th>
            <th className="text-left px-4 py-3 font-medium">Type</th>
            <th className="text-left px-4 py-3 font-medium">Company</th>
            <th className="text-left px-4 py-3 font-medium">Location</th>
            <th className="text-left px-4 py-3 font-medium">Salary</th>
            <th className="text-left px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {jobs.map(j => (
            <tr key={j._id} className="bg-white hover:bg-gray-50">
              <td className="px-4 py-3">{j.title}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  j.type === 'full-time' ? 'bg-blue-100 text-blue-800' :
                  j.type === 'part-time' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {j.type || 'N/A'}
                </span>
              </td>
              <td className="px-4 py-3">{j.company || '-'}</td>
              <td className="px-4 py-3">{j.location || '-'}</td>
              <td className="px-4 py-3">{j.salary || '-'}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openEdit(j)} 
                    className="btn btn-outline text-sm" 
                    disabled={saving}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => removeJob(j._id)} 
                    className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50 text-sm" 
                    disabled={saving}
                  >
                    Delete
                  </button>
                  <button 
                    onClick={() => viewApplicants(j)} 
                    className="btn btn-outline text-sm" 
                    disabled={saving}
                  >
                    View Applicants
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>

      {/* Edit Modal */}
      {edit && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-md">
            <h4 className="text-lg font-semibold mb-3">Edit Job</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Title</label>
                <input className="input" value={edit.title} onChange={e=>setEdit(s=>({...s, title:e.target.value}))} />
              </div>
              <div>
                <label className="label">Location</label>
                <input className="input" value={edit.location||''} onChange={e=>setEdit(s=>({...s, location:e.target.value}))} />
              </div>
              <div>
                <label className="label">Required Skills</label>
                <input className="input" value={edit.requiredSkills||''} onChange={e=>setEdit(s=>({...s, requiredSkills:e.target.value}))} />
              </div>
              <div>
                <label className="label">Salary</label>
                <input className="input" value={edit.salary||''} onChange={e=>setEdit(s=>({...s, salary:e.target.value}))} />
              </div>
              <div className="md:col-span-2">
                <label className="label">Description</label>
                <textarea className="input min-h-28" value={edit.description||''} onChange={e=>setEdit(s=>({...s, description:e.target.value}))} />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>setEdit(null)} className="btn btn-outline">Cancel</button>
              <button onClick={saveEdit} disabled={saving} className="btn btn-primary">{saving? 'Saving...':'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {applicantsJob && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-md">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Applicants — {applicantsJob.title}</h4>
              <button onClick={()=>{ setApplicantsJob(null); setApplicants([]) }} className="btn btn-outline">Close</button>
            </div>
            {applicants.length===0 ? (
              <p className="mt-3 text-sm text-gray-600">No applicants yet.</p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-lg border">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium">Name</th>
                      <th className="text-left px-4 py-2 font-medium">Email</th>
                      <th className="text-left px-4 py-2 font-medium">Resume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {applicants.map((a,i)=> (
                      <tr key={i} className="bg-white">
                        <td className="px-4 py-2">{a.name}</td>
                        <td className="px-4 py-2">{a.email}</td>
                        <td className="px-4 py-2">{a.resumeUrl ? <a className="text-indigo-600 hover:underline" href={a.resumeUrl} target="_blank">Download</a> : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {toast && (<div className="fixed bottom-6 right-6 rounded-lg bg-black text-white px-4 py-2 text-sm shadow-lg">{toast}</div>)}
      {error && (<div className="fixed bottom-6 left-6 rounded-lg bg-red-600 text-white px-4 py-2 text-sm shadow-lg">{error}</div>)}
    </div>
  )
}
