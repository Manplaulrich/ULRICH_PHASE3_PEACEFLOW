

import { Link } from "react-router-dom"
export default function Navbar() {
  return (
    <>
       <div>
         <header className=" fixed top-0 left-0 right-0 bg-amber-600 py-4 flex justify-between px-10 shadow-lg shadow-black z-50">
             <div className="text-2xl text-white font-bold">Peace-flow</div>
             <nav className="flex gap-3 text-xl text-white">
                <Link className="bg-amber-800 px-1 rounded" to='/dashboard'>Dashboard</Link>
                <Link className="bg-amber-800 px-1 rounded"to='/rawmaterial'>Raw Materials</Link>
                <Link className="bg-amber-800 px-1 rounded" to='/productionsetup'>Production Setup</Link>
                <Link className="bg-amber-800 px-1 rounded"  to='/newproduction'>New Production</Link>
                <Link className="bg-amber-800 px-1 rounded" to='/stockreport'>Stock Report</Link>
             </nav>
         </header>
       </div>
    </>
  )
}
