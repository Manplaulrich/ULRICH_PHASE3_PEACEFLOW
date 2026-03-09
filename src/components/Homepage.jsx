

import backimg2 from '../assets/backimg2.jpg'
import grid1 from '../assets/grid1.jpg'
import grid2 from '../assets/gird2.jpg'
import grid5 from '../assets/grid5.jpg'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Homepage() {
  return (
    <> 
      {/* Enhanced Header with better contrast */}
      <header className="bg-linear-to-r from-amber-800 to-amber-600 py-4 px-4 md:px-15 shadow-lg">
        <nav className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <img src={logo} alt="Peace-flow logo" className="w-20 md:w-27 rounded-full border-2 border-white shadow-md hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="flex gap-4"> 
            <Link 
              className='text-lg md:text-xl text-amber-800 font-semibold bg-white px-6 py-2 rounded-full border-2 border-amber-800 hover:bg-amber-800 hover:text-white hover:border-white transition-all duration-300 shadow-md' 
              to='/login'
            >
              Login
            </Link>
            <Link 
              className='text-lg md:text-xl text-white bg-amber-800 px-6 py-2 rounded-full border-2 border-white hover:bg-white hover:text-amber-800 hover:border-amber-800 transition-all duration-300 shadow-md' 
              to='/signup'
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section with improved overlay */}
      <div className='w-full h-[85vh] relative'>
        <img 
          className='w-full h-full object-cover object-center relative rounded-b-4xl' 
          src={backimg2} 
          alt="background image" 
        />
        
        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black/30 rounded-b-4xl"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 font-bold drop-shadow-lg">
            Welcome to <span className="text-amber-300">Peace-flow</span>
          </h1>

          <p className="text-lg md:text-2xl lg:text-3xl bg-black/40 backdrop-blur-sm text-white rounded-3xl p-6 max-w-3xl shadow-xl border border-white/20">
            Automatically track raw materials and production. <br />
            Save time, reduce waste, and plan better for your small business.
          </p>
        </div>
      </div>

      {/* Features Grid with improved cards */}
      <div className='px-4 md:px-15 py-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto'>
        {/* Card 1 */}
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-500 hover:shadow-2xl'>
          <div className='h-64 overflow-hidden'>
            <img 
              src={grid1} 
              alt="Track Materials" 
              className='w-full h-full object-cover object-center hover:scale-110 transition-transform duration-700' 
            />
          </div>
          <div className='p-8'>
            <h3 className='text-2xl md:text-3xl font-bold text-center mb-3 text-gray-800'>Track Materials</h3> 
            <p className='text-lg text-center text-gray-600'>
              Easily manage your raw materials inventory with real-time updates
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-500 hover:shadow-2xl'>
          <div className='h-64 overflow-hidden'>
            <img 
              src={grid2} 
              alt="Production Recipes" 
              className='w-full h-full object-cover object-center hover:scale-110 transition-transform duration-700' 
            />
          </div>
          <div className='p-8'>
            <h3 className='text-2xl md:text-3xl font-bold text-center mb-3 text-gray-800'>Production Recipes</h3>
            <p className='text-lg text-center text-gray-600'>
              Set up recipes and automatically calculate material usage
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-500 hover:shadow-2xl'>
          <div className='h-64 overflow-hidden'>
            <img 
              src={grid5} 
              alt="Stock Alerts" 
              className='w-full h-full object-cover object-center hover:scale-110 transition-transform duration-700' 
            />
          </div>
          <div className='p-8'>
            <h3 className='text-2xl md:text-3xl font-bold text-center mb-3 text-gray-800'>Stock Alerts</h3>
            <p className='text-lg text-center text-gray-600'>
              Get instant notifications when stock runs low
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Footer with proper structure */}
      <footer className="bg-linear-to-r from-amber-900 to-amber-800 text-white">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-15 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-1">
              <h2 className="text-3xl font-serif mb-4">Peace-flow</h2>
              <p className="text-amber-200 text-sm">
                Streamlining raw material tracking and production management for small businesses.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b-2 border-amber-500 pb-2">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-amber-200 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/features" className="text-amber-200 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-amber-200 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/contact" className="text-amber-200 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b-2 border-amber-500 pb-2">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/faq" className="text-amber-200 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/help" className="text-amber-200 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/privacy" className="text-amber-200 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-amber-200 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b-2 border-amber-500 pb-2">Contact</h3>
              <ul className="space-y-2 text-amber-200">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>support@peace-flow.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-amber-700">
          <div className="max-w-7xl mx-auto px-4 md:px-15 py-4 text-center text-amber-300 text-sm">
            <p>&copy; {new Date().getFullYear()} Peace-flow. All rights reserved. Made with ❤️ for small businesses.</p>
          </div>
        </div>
      </footer>
    </>
  )
}