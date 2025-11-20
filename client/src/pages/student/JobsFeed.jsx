export default function JobsFeed(){
  return (
    <div className="container-app section">
      <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
      <div className="card p-4 mt-6">
        <div className="grid md:grid-cols-5 gap-3">
          <input placeholder="Role" className="input md:col-span-2"/>
          <input placeholder="Location" className="input md:col-span-2"/>
          <select className="input">
            <option>Full-time</option>
            <option>Internship</option>
            <option>Remote</option>
          </select>
        </div>
        <div className="mt-3 flex gap-3">
          <button className="btn btn-outline">Filter</button>
          <button className="btn btn-outline">Reset</button>
        </div>
      </div>
      <div className="grid gap-3 mt-6">
        {[1,2,3].map(i=> (
          <div key={i} className="card p-4 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">UI/UX Designer</p>
                <p className="text-sm text-gray-500">Acme Inc • Hyderabad • Remote</p>
              </div>
              <button className="btn btn-outline">Apply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
