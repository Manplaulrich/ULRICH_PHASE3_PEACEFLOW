

import { Link } from "react-router-dom"
import { User, LogOut, Settings, ChevronDown } from "lucide-react"
import logo from '../../assets/logo.png' // Make sure to import your logo
import { useState } from "react"

export default function NavbarStaff() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <>
      <div>
        <header className="fixed top-0 left-0 right-0 bg-linear-to-r from-amber-900 via-amber-700 to-amber-600 py-3 shadow-2xl z-50">
          <div className="flex justify-between items-center px-4 md:px-8 lg:px-12">
            {/* Logo - Larger size */}
            <Link 
              to="/" 
              className="transform hover:scale-110 hover:rotate-3 transition-all duration-500 ease-out"
            >
              <img 
                src={logo} 
                alt="Peace-flow logo" 
                className="w-16 md:w-20 lg:w-24 rounded-full border-3 border-white/90 shadow-2xl hover:shadow-amber-300/50 hover:border-amber-300 transition-all duration-500" 
              />
            </Link>

            {/* Navigation Links - Hidden on mobile, visible on desktop */}
            <nav className="hidden md:flex gap-2 lg:gap-4 xl:gap-6 text-white">
              <Link 
                to='/dashboard' 
                className="px-3 lg:px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg text-sm lg:text-base font-medium whitespace-nowrap"
              >
                Dashboard
              </Link>
              <Link 
                to='/rawmaterialstaff' 
                className="px-3 lg:px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg text-sm lg:text-base font-medium whitespace-nowrap"
              >
                Raw Materials
              </Link>
              <Link 
                to='/reportstaff' 
                className="px-3 lg:px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg text-sm lg:text-base font-medium whitespace-nowrap"
              >
                Stock Report
              </Link>
            </nav>

            {/* Mobile Menu Button - Optional */}
            <button className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* User Profile with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full pl-1 pr-3 lg:pl-2 lg:pr-4 py-1 hover:bg-white/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg group"
              >
                <div className="w-9 h-9 lg:w-10 lg:h-10 bg-linear-to-br from-amber-900 to-amber-700 rounded-full flex items-center justify-center border-2 border-white/90 shadow-md group-hover:shadow-amber-300/50 transition-all duration-300">
                  <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <span className="text-white text-sm font-medium hidden sm:block">Profile</span>
                <ChevronDown className={`w-3 h-3 lg:w-4 lg:h-4 text-white transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-amber-100 overflow-hidden transform transition-all duration-300 animate-fadeIn">
                  {/* User Info */}
                  <div className="px-4 py-3 bg-linear-to-r from-amber-50 to-white border-b border-amber-100">
                    <p className="text-sm font-semibold text-amber-900">John Doe</p>
                    <p className="text-xs text-gray-600">john@example.com</p>
                  </div>

                  {/* Dropdown Links */}
                  <div className="p-2">
                    
                    <Link 
                      to="/login" 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 rounded-lg transition-all duration-300 group"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LogOut className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform duration-300" />
                      <span>Logout</span>
                    </Link>
                  </div>

                  {/* Decorative bottom accent */}
                  <div className="h-1 bg-linear-to-r from-amber-400 via-amber-300 to-amber-400"></div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Spacer to prevent content from hiding under fixed navbar */}
        <div className="h-20"></div>
      </div>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        /* Smooth transitions for all interactive elements */
        a, button, .group, input, select {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  )
}