import { Link } from "react-router-dom"
import { Mail, Lock, User, ArrowRight } from "lucide-react"
import logo from '../assets/logo.png' // Make sure to import your logo
 import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
export default function Login() {
   const navigate = useNavigate()
  const [email, setEmail]=useState("")
  const [password, setPassword]=useState("")

   const handleLogin =async (e)=>{
    e.preventDefault()
    const {data, error} = await supabase.auth.signInWithPassword({
      email, 
      password
    })
    if(error){
      alert(error.message)
    }
    const user = data.user
    const {data: profile, error:profileError} = await supabase
     .from("profiles")
      .select("*")
      .eq("id",user.id)
      .single()

      if(profileError){
        return alert(profileError.message)
      }

      alert("Login successfully")
      if(profile.role == "admin"){
        navigate("/dashboard")
      }else{
        navigate("/dashboardstaff")
      }
   }
  return (
    <>
      {/* Navbar */}
      <nav className="bg-linear-to-r from-amber-900 via-amber-700 to-amber-600 py-3 px-4 md:px-12 lg:px-24 shadow-2xl relative">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="transform hover:scale-110 hover:rotate-3 transition-all duration-500 cursor-pointer"
          >
            <img 
              src={logo} 
              alt="Peace-flow logo" 
              className="w-16 md:w-20 rounded-full border-3 border-white/90 shadow-2xl hover:shadow-amber-300/50 hover:border-amber-300 transition-all duration-500 cursor-pointer" 
            />
          </Link>

          {/* Sign Up Button */}
          <div className="flex gap-4">
            <Link 
              to="/signup" 
              className="transform text-white bg-linear-to-r from-amber-800 to-amber-700 px-6 py-2 rounded-full border-2 border-white/50 
                         transition-all duration-300 shadow-lg text-sm md:text-base
                         hover:bg-linear-to-l hover:from-amber-900 hover:to-amber-800 
                         hover:border-amber-300 hover:shadow-2xl hover:scale-110 hover:-translate-y-1
                         cursor-pointer"
            >
              Sign Up
            </Link>
          </div>

        </div>
      </nav>

      {/* Login Form Section */}
      <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-amber-50 to-white px-4 py-12 relative">
        
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-linear(circle at 2px 2px, #92400e 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>

        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 w-full max-w-md relative transform hover:scale-105 transition-all duration-500 border border-amber-100">

          {/* Decorative top accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-amber-400 via-amber-300 to-amber-400 rounded-t-2xl"></div>
          
          {/* Profile Icon inside form */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-linear-to-br from-amber-900 to-amber-700 rounded-full flex items-center justify-center shadow-xl border-4 border-white/90 transform hover:scale-110 transition-all duration-500 hover:rotate-6 cursor-pointer">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2 bg-linear-to-r from-amber-900 to-amber-700 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-center text-gray-600 mb-8">Login to continue your journey</p>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5 group-hover:scale-110 group-hover:text-amber-700 transition-all duration-300" />
                <input
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 bg-gray-50/50 hover:border-amber-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5 group-hover:scale-110 group-hover:text-amber-700 transition-all duration-300" />
                <input
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 bg-gray-50/50 hover:border-amber-300"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
            
              type="submit"
              className="w-full bg-linear-to-r from-amber-900 via-amber-700 to-amber-600 text-white py-3 rounded-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-2 group mt-2"
            >
              <span>Login</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>

          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-amber-700 hover:text-amber-800 font-semibold hover:underline transition-all inline-flex items-center gap-1 group hover:scale-105 cursor-pointer"
              >
                Sign Up
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Custom autofill styles */}
      <style jsx>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px white inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </>
  )
}