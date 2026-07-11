import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function Jobs(){
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/jobs')
        setJobs(data.jobs || [])
      } catch (e) {
        setError('Failed to load active jobs')
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  return (
    <div className="container-app section">
      <h1 className="text-3xl font-bold tracking-tight">Jobs Vacant</h1>
      
      {/* Sub-navigation Menu */}
      <div className="flex items-center gap-2 mt-6 border-b pb-3 mb-6">
        <Link to="/admin" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-sm">Overview</Link>
        <Link to="/admin/students" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-sm">Students</Link>
        <Link to="/admin/jobs" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm">Jobs</Link>
        <Link to="/admin/reports" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-sm">Reports</Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading active jobs...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : jobs.length === 0 ? (
        <div className="card p-5 mt-6 card-hover">No active job listings on the platform yet.</div>
      ) : (
        <div className="card p-6 mt-6">
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Job Title</th>
                  <th className="text-left px-4 py-3 font-medium">Company</th>
                  <th className="text-left px-4 py-3 font-medium">Location</th>
                  <th className="text-left px-4 py-3 font-medium">Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {jobs.map((job) => (
                  <tr key={job._id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-indigo-700">{job.title}</td>
                    <td className="px-4 py-3 text-gray-700">{job.company || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{job.location || 'Remote'}</td>
                    <td className="px-4 py-3 text-gray-500">{job.salary || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
