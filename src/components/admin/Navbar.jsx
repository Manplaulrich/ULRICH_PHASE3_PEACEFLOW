

import { Link } from "react-router-dom"
export default function Navbar() {
  return (
    <>
       <div>
         <header className=" fixed top-0 left-0 right-0 bg-amber-600 py-4 flex justify-between px-10 shadow-lg shadow-black z-50">
             <div className="text-2xl text-white font-bold">Peace-flow</div>
             <nav className="flex gap-3 text-xl text-white">
                <Link  to='/dashboard'>Dashboard</Link>
                <Link to='/rawmaterial'>Raw Materials</Link>
                <Link  to='/setproduction'>Production Setup</Link>
                <Link   to='/newproduction'>New Production</Link>
                <Link  to='/stockreport'>Stock Report</Link>
                <button><Link to='/'>Home</Link></button>
             </nav>
         </header>
       </div>
    </>
  )
}
