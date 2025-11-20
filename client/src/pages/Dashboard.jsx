import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const quotes = [
  'Opportunities don\'t happen, you create them.',
  'Your resume tells your story — make it unforgettable.',
  'The future depends on what you do today.',
]

const featuredJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $160k',
    posted: '2 days ago',
    featured: true,
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'Innovation Labs',
    location: 'Remote',
    type: 'Full-time',
    salary: '$100k - $140k',
    posted: '3 days ago',
    featured: true,
  },
]

const categories = [
  { id: 'tech', name: 'Technology', count: 1240, icon: 'chevrons' },
  { id: 'health', name: 'Healthcare', count: 856, icon: 'heart' },
  { id: 'business', name: 'Business', count: 2103, icon: 'briefcase' },
  { id: 'design', name: 'Design', count: 642, icon: 'palette' },
]

const steps = [
  { id: 1, title: 'Create Your Profile', desc: 'Sign up and build your professional profile with your skills and experience.' },
  { id: 2, title: 'Search & Apply', desc: 'Browse thousands of jobs and apply to positions that match your expertise.' },
  { id: 3, title: 'Get Hired', desc: 'Connect with employers and land your dream job.' },
]

export default function Dashboard(){
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-white to-indigo-50">
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-20 md:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="max-w-xl">
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Find your dream job. Showcase your talent.
          </motion.h1>
          <p className="mt-5 text-base md:text-lg text-gray-600 leading-relaxed">A modern job board and resume portal for students and admins. Upload resumes, track performance, and manage openings.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50">Get Started</Link>
            <Link to="/jobs" className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50">Browse Jobs</Link>
          </div>
          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {quotes.map((q,i)=> (
              <motion.blockquote whileHover={{scale:1.02}} key={i} className="p-4 rounded-xl bg-white shadow-sm border border-gray-100 h-full">
                <p className="text-sm text-gray-700 leading-relaxed">“{q}”</p>
              </motion.blockquote>
            ))}
          </div>
        </div>
        <motion.div initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}} transition={{duration:.6}} className="relative group lg:justify-self-end w-full max-w-xl">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop" alt="careers" className="w-full rounded-2xl shadow-xl ring-1 ring-black/5 group-hover:shadow-indigo-200 transition"/>
          <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-100">
            <p className="text-xs md:text-sm font-medium text-gray-700">Trusted by 1000+ students</p>
          </div>
        </motion.div>
      </section>

      {/* Featured Jobs */}
      <section className="container-app section">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Featured Jobs</h2>
            <p className="text-gray-600 mt-1">Hand-picked opportunities from top companies</p>
          </div>
          <Link to="/jobs" className="btn btn-outline">View All</Link>
        </div>
        <div className="space-y-6">
          {featuredJobs.map(job => (
            <div key={job.id} className="card card-hover p-5 md:p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-50 ring-1 ring-indigo-100 flex items-center justify-center">
                    <span className="h-6 w-6 rounded-full bg-indigo-400/80"></span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold hover:text-indigo-600"><Link to="/jobs">{job.title}</Link></h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      <span>📍 {job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                      <span>•</span>
                      <span>💲 {job.salary}</span>
                      <span>•</span>
                      <span>{job.posted}</span>
                    </div>
                  </div>
                </div>
                {job.featured && (
                  <span className="text-[10px] md:text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200">Featured</span>
                )}
              </div>
              <div className="pt-1">
                <button className="btn btn-primary w-full md:w-auto">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="container-app section">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Browse by Category</h2>
          <p className="text-gray-600 mt-2">Explore jobs in different industries</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat)=> (
            <div key={cat.id} className="card card-hover p-6 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-indigo-50 ring-1 ring-indigo-100 flex items-center justify-center">
                <span className="h-5 w-5 rounded-full bg-indigo-400/80"></span>
              </div>
              <h3 className="font-semibold">{cat.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{cat.count} jobs available</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container-app section">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="text-gray-600 mt-2">Get hired in 3 simple steps</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s)=> (
            <div key={s.id} className="card p-6 text-center">
              <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">{s.id}</div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
