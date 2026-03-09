import backimg2 from '../assets/backimg2.jpg'
import grid1 from '../assets/grid1.jpg'
import grid2 from '../assets/gird2.jpg'
import grid5 from '../assets/grid5.jpg'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Homepage() {
  return (
    <> 
      {/* Enhanced Header with better contrast and smooth gradient */}
      <header className="bg-gradient-to-r from-amber-900 via-amber-700 to-amber-600 py-4 shadow-2xl relative">
        <nav className="flex flex-col md:flex-row justify-between items-center px-4 md:px-12 lg:px-24">
          <div className="mb-4 md:mb-0 transform hover:scale-105 transition-all duration-500">
            <img 
              src={logo} 
              alt="Peace-flow logo" 
              className="w-24 md:w-32 rounded-full border-4 border-white/90 shadow-2xl hover:shadow-amber-300/50 hover:border-amber-300 transition-all duration-500" 
            />
          </div>
          <div className="flex gap-6"> 
            <Link 
              className='text-lg md:text-xl text-amber-900 font-semibold bg-white/95 backdrop-blur-sm px-8 py-3 rounded-full border-2 border-amber-900 hover:bg-amber-900 hover:text-white hover:border-white hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg' 
              to='/login'
            >
              Login
            </Link>
            <Link 
              className='text-lg md:text-xl text-white bg-gradient-to-r from-amber-800 to-amber-700 px-8 py-3 rounded-full border-2 border-white/50 hover:bg-gradient-to-l hover:from-amber-900 hover:to-amber-800 hover:border-amber-300 hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg' 
              to='/signup'
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section with enhanced overlay and smooth animations */}
      <div className='w-full min-h-[90vh] relative overflow-hidden'>
        <img 
          className='w-full h-full object-cover object-center absolute inset-0 scale-105 animate-slow-zoom' 
          src={backimg2} 
          alt="background image" 
        />
        
        {/* Multi-layer gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 via-transparent to-amber-900/30"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 z-10 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 font-bold">
            <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent drop-shadow-2xl">
              Welcome to
            </span>
            <br />
            <span className="text-6xl md:text-8xl lg:text-9xl bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Peace-flow
            </span>
          </h1>

          <p className="text-xl md:text-3xl lg:text-4xl bg-black/30 backdrop-blur-md text-white rounded-3xl p-8 max-w-4xl shadow-2xl border border-white/30 leading-relaxed">
            Automatically track raw materials and production. <br />
            <span className="text-amber-300 font-semibold">Save time, reduce waste, and plan better</span> for your small business.
          </p>
        </div>
      </div>

      {/* Features Grid with edge-to-edge alignment */}
      <div className='bg-gradient-to-b from-amber-50 to-white py-15'>
        <div className='px-4 md:px-12 lg:px-24'>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-amber-900">
            Why Choose <span className="text-amber-600">Peace-flow?</span>
          </h2>
          
          {/* Full-width grid without max-width constraint */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Card 1 */}
            <div className='group bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-700 hover:shadow-amber-300/50'>
              <div className='h-80 overflow-hidden relative'>
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img 
                  src={grid1} 
                  alt="Track Materials" 
                  className='w-full h-full object-cover object-center group-hover:scale-125 transition-transform duration-1000' 
                />
              </div>
              <div className='p-10'>
                <h3 className='text-3xl md:text-4xl font-bold text-center mb-4 text-amber-900 group-hover:text-amber-700 transition-colors duration-300'>
                  Track Materials
                </h3> 
                <p className='text-xl text-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300'>
                  Easily manage your raw materials inventory with real-time updates and smart tracking
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className='group bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-700 hover:shadow-amber-300/50'>
              <div className='h-80 overflow-hidden relative'>
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img 
                  src={grid2} 
                  alt="Production Recipes" 
                  className='w-full h-full object-cover object-center group-hover:scale-125 transition-transform duration-1000' 
                />
              </div>
              <div className='p-10'>
                <h3 className='text-3xl md:text-4xl font-bold text-center mb-4 text-amber-900 group-hover:text-amber-700 transition-colors duration-300'>
                  Production Recipes
                </h3>
                <p className='text-xl text-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300'>
                  Set up recipes and automatically calculate material usage with precision
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className='group bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-700 hover:shadow-amber-300/50'>
              <div className='h-80 overflow-hidden relative'>
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img 
                  src={grid5} 
                  alt="Stock Alerts" 
                  className='w-full h-full object-cover object-center group-hover:scale-125 transition-transform duration-1000' 
                />
              </div>
              <div className='p-10'>
                <h3 className='text-3xl md:text-4xl font-bold text-center mb-4 text-amber-900 group-hover:text-amber-700 transition-colors duration-300'>
                  Stock Alerts
                </h3>
                <p className='text-xl text-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300'>
                  Get instant notifications when stock runs low with smart alert system
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer with edge-to-edge alignment */}
      <footer className="bg-gradient-to-br from-amber-950 via-amber-900 to-amber-800 text-white relative">
        {/* Decorative top wave */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400"></div>
        
        {/* Main Footer Content - Full width */}
        <div className='px-4 md:px-12 lg:px-24 py-16'>
          {/* Full-width grid without max-width constraint */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-1">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent mb-6">
                Peace-flow
              </h2>
              <p className="text-amber-200/90 text-base leading-relaxed">
                Streamlining raw material tracking and production management for small businesses worldwide.
              </p>
              <div className="mt-6 flex gap-4">
                {/* Social icons */}
                <div className="w-10 h-10 bg-amber-800/50 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors cursor-pointer">
                  <span className="text-amber-200">f</span>
                </div>
                <div className="w-10 h-10 bg-amber-800/50 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors cursor-pointer">
                  <span className="text-amber-200">t</span>
                </div>
                <div className="w-10 h-10 bg-amber-800/50 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors cursor-pointer">
                  <span className="text-amber-200">in</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-6 border-b-2 border-amber-500/50 pb-3">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-amber-200/80 hover:text-amber-300 hover:translate-x-2 inline-block transition-all duration-300">→ About Us</Link></li>
                <li><Link to="/features" className="text-amber-200/80 hover:text-amber-300 hover:translate-x-2 inline-block transition-all duration-300">→ Features</Link></li>
                <li><Link to="/pricing" className="text-amber-200/80 hover:text-amber-300 hover:translate-x-2 inline-block transition-all duration-300">→ Pricing</Link></li>
                <li><Link to="/contact" className="text-amber-200/80 hover:text-amber-300 hover:translate-x-2 inline-block transition-all duration-300">→ Contact</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-xl font-semibold mb-6 border-b-2 border-amber-500/50 pb-3">Support</h3>
              <ul className="space-y-3">
                <li><Link to="/faq" className="text-amber-200/80 hover:text-amber-300 hover:translate-x-2 inline-block transition-all duration-300">→ FAQ</Link></li>
                <li><Link to="/help" className="text-amber-200/80 hover:text-amber-300 hover:translate-x-2 inline-block transition-all duration-300">→ Help Center</Link></li>
                <li><Link to="/privacy" className="text-amber-200/80 hover:text-amber-300 hover:translate-x-2 inline-block transition-all duration-300">→ Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-amber-200/80 hover:text-amber-300 hover:translate-x-2 inline-block transition-all duration-300">→ Terms of Service</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-semibold mb-6 border-b-2 border-amber-500/50 pb-3">Contact</h3>
              <ul className="space-y-4 text-amber-200/80">
                <li className="flex items-center gap-3 hover:text-amber-300 transition-colors">
                  <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>support@peace-flow.com</span>
                </li>
                <li className="flex items-center gap-3 hover:text-amber-300 transition-colors">
                  <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3 hover:text-amber-300 transition-colors">
                  <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>123 Business Ave, Suite 100<br />New York, NY 10001</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright Bar - Full width */}
        <div className="border-t border-amber-700/50 bg-amber-950/50">
          <div className='px-4 md:px-12 lg:px-24 py-6'>
            <p className="text-amber-300/80 text-base text-center">
              &copy; {new Date().getFullYear()} Peace-flow. All rights reserved. 
              <span className="block mt-2 text-sm text-amber-400/60">Made with ❤️ for small businesses worldwide</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Add custom keyframes for animations */}
      <style jsx>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite alternate ease-in-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1.2s ease-out;
        }
      `}</style>
    </>
  )
}