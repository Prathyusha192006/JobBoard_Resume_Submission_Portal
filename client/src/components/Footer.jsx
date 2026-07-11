export default function Footer(){
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container-app py-8 text-sm text-gray-600 grid md:grid-cols-3 gap-6 items-center">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-fuchsia-500 block"></span>
          <span className="font-semibold text-gray-900">JobPortal</span>
        </div>
        <nav className="flex justify-center gap-5">
          <a href="/about" className="hover:text-indigo-600">About</a>
          <a href="/contact" className="hover:text-indigo-600">Contact</a>
          <a href="/jobs" className="hover:text-indigo-600">Find Jobs</a>
        </nav>
        <p className="md:text-right">© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
      </div>
    </footer>
  )
}
