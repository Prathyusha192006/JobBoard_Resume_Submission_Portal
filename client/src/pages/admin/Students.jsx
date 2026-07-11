import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Students(){
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token')
    return { 'Authorization': `Bearer ${token}` }
  }

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get('/api/admin/users', { headers: getAuthHeader() })
        const allStudents = (data.users || []).filter(u => u.role === 'jobseeker')
        setStudents(allStudents)
      } catch (e) {
        console.error(e)
        if (e.response?.status === 401 || e.response?.status === 403) {
          navigate('/login')
        } else {
          setError('Failed to fetch students')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [navigate])

  return (
    <div className="container-app section">
      <h1 className="text-3xl font-bold tracking-tight">All Students</h1>
      
      {/* Sub-navigation Menu */}
      <div className="flex items-center gap-2 mt-6 border-b pb-3 mb-6">
        <Link to="/admin" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-sm">Overview</Link>
        <Link to="/admin/students" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm">Students</Link>
        <Link to="/admin/jobs" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-sm">Jobs</Link>
        <Link to="/admin/reports" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-sm">Reports</Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading student list...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : students.length === 0 ? (
        <div className="card p-5 mt-6 card-hover">No registered students on the platform yet.</div>
      ) : (
        <div className="card p-6 mt-6">
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Job Seeker ID</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.map((u) => (
                  <tr key={u.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500">{u.roleId || '-'}</td>
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
