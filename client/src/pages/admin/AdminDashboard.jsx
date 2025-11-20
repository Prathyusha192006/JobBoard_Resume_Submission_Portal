import { useEffect, useMemo, useState } from 'react'

export default function AdminDashboard(){
  const [users, setUsers] = useState([])
  useEffect(()=>{
    try { setUsers(JSON.parse(localStorage.getItem('mock_users')||'[]')) } catch { setUsers([]) }
  }, [])
  const seekers = useMemo(()=> users.filter(u=>u.role==='jobseeker'), [users])
  const employers = useMemo(()=> users.filter(u=>u.role==='employer'), [users])

  return (
    <div className="container-app section">
      <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
      <p className="text-gray-600 mt-1">Monitor users and jobs at a glance.</p>

      {/* Top stats */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="card p-5 card-hover">
          <p className="text-sm text-gray-500">Job Seekers</p>
          <p className="mt-1 text-2xl font-semibold">{seekers.length}</p>
        </div>
        <div className="card p-5 card-hover">
          <p className="text-sm text-gray-500">Employers</p>
          <p className="mt-1 text-2xl font-semibold">{employers.length}</p>
        </div>
        <div className="card p-5 card-hover">
          <p className="text-sm text-gray-500">Performance analytics</p>
          <p className="mt-1 text-2xl font-semibold">—</p>
        </div>
      </div>

      {/* Job Seekers Table */}
      <section className="mt-6 card p-6">
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
                  <th className="text-left px-4 py-3 font-medium">ID</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {seekers.map((u,i)=> (
                  <tr key={i} className="bg-white">
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.id || '-'}</td>
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
                  <th className="text-left px-4 py-3 font-medium">ID</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {employers.map((u,i)=> (
                  <tr key={i} className="bg-white">
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.id || '-'}</td>
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
