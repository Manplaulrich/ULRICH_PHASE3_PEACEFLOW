import { Routes, Route} from "react-router-dom"

import Login from "../components/Login"
import Homepage from "../components/Homepage"
import SignUp from "../components/SignUp"
import Navbar from "../components/admin/Navbar"

export default function AppRouter() {
  return (
      <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>
           <Route path="/dashboard" element={<Navbar/>}/>
      </Routes>
  )
}

