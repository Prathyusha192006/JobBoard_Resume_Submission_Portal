import { Link } from 'react-router-dom'

export default function About(){
  return (
    <div className="bg-white text-gray-900">
      {/* Hero with shared image */}
      <section className="relative text-white">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop" alt="teamwork" className="h-full w-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/70 to-sky-600/70"/>
        </div>
        <div className="relative container-app py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About JobPortal</h1>
          <p className="mt-3 md:mt-4 text-white/90 max-w-2xl mx-auto">We're on a mission to revolutionize the way people find jobs and companies find talent.</p>
        </div>
      </section>

      {/* Story */}
      <section className="container-app section">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Our Story</h2>
        <div className="mt-6 max-w-3xl mx-auto space-y-4 text-gray-700 leading-relaxed">
          <p>
            Founded in 2020, JobPortal was born from a simple idea: the job search process should be easier, more transparent, and more effective for everyone involved.
          </p>
          <p>
            Our founders, having experienced the frustrations of traditional job boards from both sides, set out to create a platform that puts people first. We combine advanced technology with human-centered design to create meaningful connections between job seekers and employers.
          </p>
          <p>
            Today, JobPortal serves thousands of job seekers and hundreds of companies across various industries, helping them achieve their goals and build successful careers and teams.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="container-app section">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Our Values</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {title:'Our Mission', desc:'To connect talented professionals with their dream jobs and help companies build exceptional teams.'},
            {title:'Community First', desc:'We believe in building a supportive community where job seekers and employers can thrive together.'},
            {title:'Innovation', desc:'Using cutting-edge technology to make the job search and hiring process seamless and efficient.'},
            {title:'Excellence', desc:'Committed to delivering the highest quality service to both job seekers and employers.'},
          ].map((v)=> (
            <div key={v.title} className="card p-6 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-indigo-50 ring-1 ring-indigo-100 flex items-center justify-center">
                <span className="h-5 w-5 rounded-full bg-indigo-400/80"></span>
              </div>
              <h3 className="font-semibold">{v.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="container-app section">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Meet Our Team</h2>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {[
            {name:'Sai prathyusha', role:'Project Lead'},
            {name:'Pradeepthi', role:'Frontend Developer'},
            {name:'Sai moushmi', role:'UI/UX Designer'},
            {name:'Sandhya', role:'Backend Developer'},
          ].map((m)=> (
            <div key={m.name} className="text-center">
              <div className="mx-auto h-24 w-24 md:h-28 md:w-28 rounded-full bg-gray-100 ring-1 ring-gray-200 shadow-sm"></div>
              <div className="mt-3">
                <p className="font-medium">{m.name}</p>
                <p className="text-sm text-gray-600">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="container-app py-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-indigo-600">50,000+</p>
            <p className="text-sm text-gray-600">Active Job Seekers</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-indigo-600">2,000+</p>
            <p className="text-sm text-gray-600">Companies Hiring</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-indigo-600">10,000+</p>
            <p className="text-sm text-gray-600">Jobs Posted Monthly</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-app section text-center">
        <h3 className="text-xl md:text-2xl font-semibold">Ready to get started?</h3>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Link to="/signup" className="btn btn-outline">Create free account</Link>
          <Link to="/jobs" className="btn btn-outline">Find jobs</Link>
        </div>
      </section>
    </div>
  )
}
