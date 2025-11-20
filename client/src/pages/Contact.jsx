import { useState } from 'react'

export default function Contact(){
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [status, setStatus] = useState({ type:'', message:'' })
  const set = (k) => (e) => setForm(s => ({ ...s, [k]: e.target.value }))
  const onSubmit = (e) => {
    e.preventDefault()
    // basic validation
    if(!form.name || !form.email || !form.subject || !form.message){
      setStatus({ type:'error', message:'Please fill out all fields.' })
      return
    }
    const emailOk = /.+@.+\..+/.test(form.email)
    if(!emailOk){
      setStatus({ type:'error', message:'Please enter a valid email address.' })
      return
    }
    // simulate success
    setStatus({ type:'success', message:'Thanks! Your message has been sent.' })
    setForm({ name:'', email:'', subject:'', message:'' })
  }

  return (
    <div className="bg-white text-gray-900">
      {/* Hero with shared image */}
      <section className="relative text-white">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop" alt="teamwork" className="h-full w-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/70 to-sky-600/70"/>
        </div>
        <div className="relative container-app py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Get in Touch</h1>
          <p className="mt-3 md:mt-4 text-white/90 max-w-2xl mx-auto">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </section>

      {/* Content */}
      <section className="container-app section grid md:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Send us a Message</h2>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="label">Full Name</label>
              <input className="input" placeholder="John Doe" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="john@example.com" value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label className="label">Subject</label>
              <input className="input" placeholder="How can we help?" value={form.subject} onChange={set('subject')} />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea className="input" rows={5} placeholder="Tell us more about your inquiry..." value={form.message} onChange={set('message')} />
            </div>
            <button type="submit" className="btn w-full bg-blue-600 hover:bg-blue-500 text-white">✈️  Send Message</button>
            {status.message && (
              <p className={`${status.type==='error' ? 'text-red-600' : 'text-emerald-600'} text-sm`}>{status.message}</p>
            )}
          </form>
        </div>

        {/* Right: Info */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-50 ring-1 ring-indigo-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-indigo-600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.06 1.905l-7.5 4.615a2.25 2.25 0 0 1-2.38 0L3.81 8.898a2.25 2.25 0 0 1-1.06-1.905V6.75"/></svg>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-600">prathyusha@gmail.com<br/>Sandhya@gmail.com</p>
                </div>
              </div>
            </div>
            <div className="card p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-50 ring-1 ring-indigo-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-indigo-600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a2.25 2.25 0 0 0 2.25-2.25v-1.072c0-.516-.351-.966-.852-1.091l-3.423-.856a1.125 1.125 0 0 0-1.173.417l-.97 1.293a.75.75 0 0 1-1.21.038 12.035 12.035 0 0 1-3.162-3.162.75.75 0 0 1 .038-1.21l1.293-.97a1.125 1.125 0 0 0 .417-1.173l-.856-3.423a1.125 1.125 0 0 0-1.091-.852H6.75A2.25 2.25 0 0 0 4.5 6.75v0z"/></svg>
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-gray-600">+91 9014154596<br/>+91 6300407658</p>
                </div>
              </div>
            </div>
            <div className="card p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-50 ring-1 ring-indigo-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-indigo-600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/></svg>
                </div>
                <div>
                  <p className="font-medium">Office</p>
                  <p className="text-sm text-gray-600">Andhra pradesh<br/>Vignan univeristy, Vadlmudi<br/>India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">Business Hours</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
              <span>Monday - Friday:</span><span className="justify-self-end">9:00 AM - 6:00 PM</span>
              <span>Saturday-Sunday</span><span className="justify-self-end">10:00 AM - 4:00 PM</span>
            
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
