import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Reports(){
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const navigate = useNavigate()

  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token')
    return { 'Authorization': `Bearer ${token}` }
  }

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/admin/messages', { headers: getAuthHeader() })
      setMessages(data.messages || [])
    } catch (e) {
      console.error(e)
      if (e.response?.status === 401 || e.response?.status === 403) {
        navigate('/login')
      } else {
        setError('Failed to fetch contact reports')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(()=>{
    if (!toast) return
    const t = setTimeout(()=>setToast(''), 1800)
    return ()=>clearTimeout(t)
  },[toast])

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/admin/messages/${id}`, { status: 'read' }, { headers: getAuthHeader() })
      setToast('Report marked as read')
      fetchMessages()
    } catch (e) {
      setError('Failed to update status')
    }
  }

  const deleteMessage = async (id) => {
    const ok = window.confirm('Delete this report message permanently?')
    if (!ok) return
    try {
      await axios.delete(`/api/admin/messages/${id}`, { headers: getAuthHeader() })
      setToast('Report deleted successfully')
      fetchMessages()
    } catch (e) {
      setError('Failed to delete report')
    }
  }

  return (
    <div className="container-app section">
      <h1 className="text-3xl font-bold tracking-tight">Reports & Support</h1>
      
      {/* Sub-navigation Menu */}
      <div className="flex items-center gap-2 mt-6 border-b pb-3 mb-6">
        <Link to="/admin" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-sm">Overview</Link>
        <Link to="/admin/students" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-sm">Students</Link>
        <Link to="/admin/jobs" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium text-sm">Jobs</Link>
        <Link to="/admin/reports" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm">Reports</Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading support messages...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : messages.length === 0 ? (
        <div className="card p-5 mt-6 card-hover text-gray-600">No contact reports or support messages received yet.</div>
      ) : (
        <div className="grid gap-4 mt-6">
          {messages.map(msg => (
            <div key={msg.id} className="card p-5 card-hover">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 ${
                    msg.status === 'new' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {msg.status?.toUpperCase() || 'NEW'}
                  </span>
                  <h4 className="text-lg font-semibold text-gray-800">{msg.subject || 'No Subject'}</h4>
                  <p className="text-sm text-gray-500 mt-1">From: <span className="font-medium text-gray-700">{msg.name}</span> ({msg.email})</p>
                  <p className="text-xs text-gray-400">Received on: {new Date(msg.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  {msg.status === 'new' && (
                    <button 
                      onClick={() => markAsRead(msg.id)} 
                      className="btn btn-outline text-indigo-600 border-indigo-200 hover:bg-indigo-50 text-xs"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button 
                    onClick={() => deleteMessage(msg.id)} 
                    className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded border text-sm text-gray-700 whitespace-pre-wrap">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (<div className="fixed bottom-6 right-6 rounded-lg bg-black text-white px-4 py-2 text-sm shadow-lg z-50">{toast}</div>)}
    </div>
  )
}
