import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function JobsFeed(){
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [appliedJobIds, setAppliedJobIds] = useState(new Set())
  
  // Search state
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('full-time')

  const navigate = useNavigate()

  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  const fetchAppliedJobs = async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) return
    try {
      const { data } = await axios.get('/api/applied', { headers: { 'Authorization': `Bearer ${token}` } })
      const ids = new Set((data.jobs || []).map(j => j._id))
      setAppliedJobIds(ids)
    } catch (e) {
      console.error('Error fetching applied jobs status:', e)
    }
  }

  const fetchJobs = async (params = {}) => {
    setLoading(true)
    setError('')
    try {
      const query = new URLSearchParams()
      if (params.search) query.append('search', params.search)
      if (params.location) query.append('location', params.location)
      if (params.jobType) query.append('tags', params.jobType)
      
      const { data } = await axios.get(`/api/jobs?${query.toString()}`)
      setJobs(data.jobs || [])
    } catch (e) {
      setError('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
    fetchAppliedJobs()
  }, [])

  useEffect(()=>{
    if (!toast) return
    const t = setTimeout(()=>setToast(''), 1800)
    return ()=>clearTimeout(t)
  },[toast])

  const handleFilter = (e) => {
    e.preventDefault()
    fetchJobs({ search, location, jobType })
  }

  const handleReset = () => {
    setSearch('')
    setLocation('')
    setJobType('full-time')
    fetchJobs()
  }

  const handleApply = async (jobId) => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate('/login')
      return
    }
    
    try {
      setToast('Submitting application...')
      await axios.post('/api/applied', { jobId }, { headers: { 'Authorization': `Bearer ${token}` } })
      setAppliedJobIds(prev => {
        const next = new Set(prev)
        next.add(jobId)
        return next
      })
      setToast('Applied successfully!')
    } catch (e) {
      console.error(e)
      setError(e.response?.data?.error || 'Failed to apply')
    }
  }

  return (
    <div className="container-app section">
      <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
      
      <form onSubmit={handleFilter} className="card p-4 mt-6">
        <div className="grid md:grid-cols-5 gap-3">
          <input 
            placeholder="Role" 
            className="input md:col-span-2"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <input 
            placeholder="Location" 
            className="input md:col-span-2"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <select 
            className="input"
            value={jobType}
            onChange={e => setJobType(e.target.value)}
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="remote">Remote</option>
          </select>
        </div>
        <div className="mt-3 flex gap-3">
          <button type="submit" className="btn btn-outline">Filter</button>
          <button type="button" onClick={handleReset} className="btn btn-outline">Reset</button>
        </div>
      </form>

      {loading ? (
        <p className="mt-6 text-center text-gray-600">Loading jobs...</p>
      ) : error ? (
        <p className="mt-6 text-center text-red-600">{error}</p>
      ) : jobs.length === 0 ? (
        <p className="mt-6 text-center text-gray-600">No jobs found matching the criteria.</p>
      ) : (
        <div className="grid gap-3 mt-6">
          {jobs.map(job => (
            <div key={job._id} className="card p-4 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-lg text-indigo-700">{job.title}</p>
                  <p className="text-sm text-gray-500">{job.company || 'Unknown Company'} • {job.location || 'Remote'}</p>
                  <p className="text-sm text-gray-600 mt-2 max-w-2xl">{job.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(job.tags || []).map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-600">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  {appliedJobIds.has(job._id) ? (
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">Applied</span>
                  ) : (
                    <button 
                      onClick={() => handleApply(job._id)} 
                      className="btn btn-primary text-sm"
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-lg bg-black text-white px-4 py-2 text-sm shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
