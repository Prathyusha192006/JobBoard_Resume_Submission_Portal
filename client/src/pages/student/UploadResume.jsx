export default function UploadResume(){
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Upload Resume</h1>
      <form className="rounded-xl border bg-white p-6 space-y-4">
        <input type="file" className="w-full"/>
        <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Upload</button>
      </form>
    </div>
  )
}
