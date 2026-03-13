import { Link, useNavigate } from "react-router-dom"
import { User, LogOut, Settings, ChevronDown, UserPlus, Menu, X } from "lucide-react"
import logo from '../../assets/logo.png'
import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role
          }
        }
      })

      if (error) throw error

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            name: formData.name,
            email: formData.email,
            role: formData.role
          }
        ])

        if (profileError) throw profileError
      }

      setIsSignupModalOpen(false)
      alert("User added successfully!")
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'staff'
      })
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate('/login')
    } catch (error) {
      alert(error.message)
    }
  }

  const closeModal = () => {
    setIsSignupModalOpen(false)
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'staff'
    })
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
          console.log("No user logged in")
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("name, email, role")
          .eq("id", user.id)
          .single()

        if (profileError) throw profileError

        setUser(profile)
      } catch (error) {
        console.error("Error fetching user:", error.message)
      }
    }

    getUser()

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getUser()
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/rawmaterial', label: 'Raw Materials' },
    { to: '/setproduction', label: 'Recipe Setup' },
    { to: '/report', label: 'Stock Report' }
  ]

  return (
    <>
      <div>
        <header className="fixed top-0 left-0 right-0 bg-linear-to-r from-amber-900 via-amber-700 to-amber-600 py-3 shadow-2xl z-50">
          <div className="flex justify-between items-center px-4 md:px-8 lg:px-12">
            {/* Logo */}
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-2 lg:gap-4 xl:gap-6 text-white">
              {navLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className="px-3 lg:px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg text-sm lg:text-base font-medium whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full pl-1 pr-3 lg:pl-2 lg:pr-4 py-1 hover:bg-white/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg group"
              >
                <div className="w-9 h-9 lg:w-10 lg:h-10 bg-linear-to-br from-amber-900 to-amber-700 rounded-full flex items-center justify-center border-2 border-white/90 shadow-md group-hover:shadow-amber-300/50 transition-all duration-300">
                  <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <span className="text-white text-sm font-medium hidden sm:block">
                  {user?.name || 'Profile'}
                </span>
                <ChevronDown className={`w-3 h-3 lg:w-4 lg:h-4 text-white transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-amber-100 overflow-hidden transform transition-all duration-300 animate-fadeIn">
                  <div className="px-4 py-3 bg-linear-to-r from-amber-50 to-white border-b border-amber-100">
                    <p className="text-sm font-semibold text-amber-900">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-600">{user?.email || "No email"}</p>
                    <p className="text-xs text-amber-600 mt-1 capitalize">{user?.role || "staff"}</p>
                  </div>

                  <div className="p-2">
                    <button 
                      onClick={() => {
                        setIsSignupModalOpen(true)
                        setIsProfileOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 rounded-lg transition-all duration-300 group"
                    >
                      <UserPlus className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform duration-300" />
                      <span>Add Member</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 rounded-lg transition-all duration-300 group"
                    >
                      <LogOut className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform duration-300" />
                      <span>Logout</span>
                    </button>
                  </div>

                  <div className="h-1 bg-linear-to-r from-amber-400 via-amber-300 to-amber-400"></div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-xl border-t border-amber-100 animate-slideDown">
              <div className="p-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-amber-50 rounded-lg transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Mobile User Info */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="px-4 py-2">
                    <p className="text-sm font-semibold text-amber-900">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-600">{user?.email || "No email"}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsSignupModalOpen(true)
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 rounded-lg transition-all duration-300"
                  >
                    <UserPlus className="w-4 h-4 text-amber-600" />
                    <span>Add Member</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 rounded-lg transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4 text-amber-600" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        <div className="h-20"></div>
      </div>

      {/* Signup Modal */}
      {isSignupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-linear-to-r from-amber-900 via-amber-700 to-amber-600 p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Add New Member</h2>
              <p className="text-amber-100 text-sm mt-1">Create a new user account</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300"
                  placeholder="Enter password (min. 6 characters)"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  User Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-300 bg-white"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-linear-to-r from-amber-900 via-amber-700 to-amber-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
        
        @keyframes slideDown {
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
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        a, button, .group, input, select {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  )
}