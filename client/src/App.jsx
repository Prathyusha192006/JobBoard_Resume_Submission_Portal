 import { Routes, Route, Navigate } from 'react-router-dom'
 import Header from './components/Header'
import Footer from './components/Footer'
 import Dashboard from './pages/Dashboard'
 import About from './pages/About'
import Contact from './pages/Contact'
 import Login from './pages/auth/Login'
 import Signup from './pages/auth/Signup'
 import EmployerDashboard from './pages/employer/EmployerDashboard'
 import AdminDashboard from './pages/admin/AdminDashboard'
 import Students from './pages/admin/Students'
 import Reports from './pages/admin/Reports'
 import Performance from './pages/admin/Performance'
 import JobsAdmin from './pages/admin/Jobs'
 import Resumes from './pages/admin/Resumes'
 import StudentDashboard from './pages/student/StudentDashboard'
 import JobsFeed from './pages/student/JobsFeed'
 import Profile from './pages/student/Profile'
 import UploadResume from './pages/student/UploadResume'

function NotFound(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-gray-600 mt-2">The page you are looking for doesn't exist.</p>
    </div>
  )
}

export default function App(){
  function RequireAdmin({ children }){
    let ok = false
    try {
      const token = localStorage.getItem('auth_token')
      const userStr = localStorage.getItem('auth_user')
      const user = userStr ? JSON.parse(userStr) : null
      ok = !!token && user?.role === 'admin'
    } catch {}
    return ok ? children : <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/jobs" element={<JobsFeed />} />

          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="/admin/students" element={<RequireAdmin><Students /></RequireAdmin>} />
          <Route path="/admin/reports" element={<RequireAdmin><Reports /></RequireAdmin>} />
          <Route path="/admin/performance" element={<RequireAdmin><Performance /></RequireAdmin>} />
          <Route path="/admin/jobs" element={<RequireAdmin><JobsAdmin /></RequireAdmin>} />
          <Route path="/admin/resumes" element={<RequireAdmin><Resumes /></RequireAdmin>} />

          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/jobs" element={<JobsFeed />} />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/resume" element={<UploadResume />} />

          <Route path="/employer" element={<EmployerDashboard />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
