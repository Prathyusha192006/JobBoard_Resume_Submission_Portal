import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function AdminDashboard(){
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token')
    return { 'Authorization': `Bearer ${token}` }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/admin/users', { headers: getAuthHeader() })
      setUsers(data.users || [])
    } catch (e) {
      console.error(e)
      if (e.response?.status === 401 || e.response?.status === 403) {
        navigate('/login')
      } else {
        setError('Failed to fetch users list')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const seekers = useMemo(()=> users.filter(u=>u.role==='jobseeker'), [users])
  const employers = useMemo(()=> users.filter(u=>u.role==='employer'), [users])

  if (loading) {
    return (
      <div className="container-app section text-center py-20">
        <p className="text-gray-600">Loading admin overview...</p>
      </div>
    )
  }

  return (
    <div className="container-app section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform management and insights.</p>
        </div>
      </div>

      {/* Sub-navigation Menu */}
      <div className="flex items-center gap-2 mt-6 border-b pb-3 mb-6">
        <Link to="/admin" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm">Overview</Link>
        <Link to="/admin/students" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-sm">Students</Link>
        <Link to="/admin/jobs" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-sm">Jobs</Link>
        <Link to="/admin/reports" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-sm">Reports</Link>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm mb-4">{error}</div>}

      {/* Top stats */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="card p-5 card-hover">
          <p className="text-sm text-gray-500">Job Seekers</p>
          <p className="mt-1 text-3xl font-extrabold text-indigo-700">{seekers.length}</p>
        </div>
        <div className="card p-5 card-hover">
          <p className="text-sm text-gray-500">Employers</p>
          <p className="mt-1 text-3xl font-extrabold text-indigo-700">{employers.length}</p>
        </div>
        <div className="card p-5 card-hover">
          <p className="text-sm text-gray-500">Total Registered</p>
          <p className="mt-1 text-3xl font-extrabold text-indigo-700">{users.length}</p>
        </div>
      </div>

      {/* Job Seekers Table */}
      <section className="mt-8 card p-6">
        <h3 className="text-lg font-semibold">Job Seekers</h3>
        {seekers.length===0 ? (
          <p className="mt-2 text-sm text-gray-600">No job seekers captured yet.</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Job Seeker ID</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {seekers.map((u,i)=> (
                  <tr key={i} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500">{u.roleId || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Employers Table */}
      <section className="mt-6 card p-6">
        <h3 className="text-lg font-semibold">Employers</h3>
        {employers.length===0 ? (
          <p className="mt-2 text-sm text-gray-600">No employers captured yet.</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Employer ID</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {employers.map((u,i)=> (
                  <tr key={i} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500">{u.roleId || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
