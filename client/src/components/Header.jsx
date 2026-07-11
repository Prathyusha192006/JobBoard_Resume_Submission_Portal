import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [auth, setAuth] = useState({ token: null, user: null })

  useEffect(()=>{
    try {
      const token = localStorage.getItem('auth_token')
      const userStr = localStorage.getItem('auth_user')
      const user = userStr ? JSON.parse(userStr) : null
      setAuth({ token, user })
    } catch {}
  }, [location.pathname])

  const displayName = (auth.user?.name || '').trim()

  const handleLogout = () => {
    setOpen(false)
    try {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      localStorage.removeItem('user_name')
    } catch {}
    setAuth({ token: null, user: null })
    navigate('/login')
  }

  const brandLink = auth.token
    ? (auth.user?.role === 'jobseeker' ? '/student' : `/${auth.user?.role}`)
    : '/'

  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-gray-200">
      <div className="container-app py-3 grid grid-cols-3 items-center">
        {/* Left: Brand */}
        <div className="flex items-center gap-2">
          <Link to={brandLink} className="flex items-center gap-2 group">
            <span className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 block group-hover:scale-110 transition-transform"></span>
            <span className="text-xl font-semibold tracking-tight">JobPortal</span>
          </Link>
        </div>

        {/* Center: Nav */}
        <nav className="hidden md:flex items-center justify-center gap-6 text-sm">
          {auth.token ? (
            <>
              {auth.user?.role === 'jobseeker' && (
                <>
                  <NavLink to="/student" end className={({isActive})=>`hover:text-indigo-600 transition ${isActive? 'text-indigo-600 font-medium':''}`}>Dashboard</NavLink>
                  <NavLink to="/jobs" className={({isActive})=>`hover:text-indigo-600 transition ${isActive? 'text-indigo-600 font-medium':''}`}>Browse Jobs</NavLink>
                  <NavLink to="/student/profile" className={({isActive})=>`hover:text-indigo-600 transition ${isActive? 'text-indigo-600 font-medium':''}`}>My Profile</NavLink>
                </>
              )}
              {auth.user?.role === 'employer' && (
                <>
                  <NavLink to="/employer" className={({isActive})=>`hover:text-indigo-600 transition ${isActive? 'text-indigo-600 font-medium':''}`}>Employer Dashboard</NavLink>
                </>
              )}
              {auth.user?.role === 'admin' && (
                <>
                  <NavLink to="/admin" end className={({isActive})=>`hover:text-indigo-600 transition ${isActive? 'text-indigo-600 font-medium':''}`}>Admin Overview</NavLink>
                  <NavLink to="/admin/students" className={({isActive})=>`hover:text-indigo-600 transition ${isActive? 'text-indigo-600 font-medium':''}`}>Students</NavLink>
                  <NavLink to="/admin/jobs" className={({isActive})=>`hover:text-indigo-600 transition ${isActive? 'text-indigo-600 font-medium':''}`}>Jobs</NavLink>
                  <NavLink to="/admin/reports" className={({isActive})=>`hover:text-indigo-600 transition ${isActive? 'text-indigo-600 font-medium':''}`}>Reports</NavLink>
                </>
              )}
            </>
          ) : (
            <>
              <NavLink to="/" className={({isActive})=>`hover:text-indigo-600 transition ${isActive? 'text-indigo-600 font-medium':''}`}>Home</NavLink>
              <NavLink to="/jobs" className={({isActive})=>`hover:text-indigo-600 transition ${isActive? 'text-indigo-600 font-medium':''}`}>Find Jobs</NavLink>
              <NavLink to="/about" className={({isActive})=>`hover:text-indigo-600 transition ${isActive? 'text-indigo-600 font-medium':''}`}>About</NavLink>
              <NavLink to="/contact" className={({isActive})=>`hover:text-indigo-600 transition ${isActive? 'text-indigo-600 font-medium':''}`}>Contact</NavLink>
            </>
          )}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3">
          {auth.token ? (
            <div className="relative flex items-center justify-end">
              <button onClick={()=>setOpen(o=>!o)} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100">
                <span className="h-8 w-8 rounded-full bg-sky-700 text-white grid place-items-center text-sm font-semibold">{(auth.user?.name?.[0] || 'U').toUpperCase()}</span>
                {displayName && (
                  <span className="hidden md:inline text-sm font-medium text-gray-700">{displayName}</span>
                )}
              </button>
              {open && (
                <div className="absolute right-0 top-11 w-56 rounded-xl border border-gray-200 bg-white shadow-md p-3 text-sm">
                  <div className="mb-3">
                    <p className="font-medium">{auth.user?.name || 'User'}</p>
                    <p className="text-gray-600 text-xs">{auth.user?.email || ''}</p>
                    <p className="text-gray-600 text-xs capitalize">{auth.user?.role === 'jobseeker' ? 'Job Seeker' : auth.user?.role}</p>
                  </div>
                  <button onClick={()=>{setOpen(false); navigate(auth.user?.role === 'jobseeker' ? '/student' : '/' + auth.user?.role)}} className="w-full text-left px-2 py-2 rounded hover:bg-gray-50">Dashboard</button>
                  <button onClick={handleLogout} className="w-full text-left px-2 py-2 rounded text-red-600 hover:bg-red-50">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/signup" className="btn btn-outline">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
