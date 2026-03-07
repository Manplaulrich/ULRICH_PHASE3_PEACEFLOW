import { Routes, Route} from "react-router-dom"

import Login from "../components/Login"
import Homepage from "../components/Homepage"
import SignUp from "../components/SignUp"
 import Dashboard from "../components/admin/Dashboard"
 import RawMaterial from "../components/admin/RawMaterial" 
 import Test from "../Test"

export default function AppRouter() {
  return (
      <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>
           <Route path="/dashboard" element={<Dashboard/>}/>
           <Route path="/rawmaterial" element={<RawMaterial/>}/>
           <Route path="/test" element={<Test/>}/>
           

      </Routes>
  )
}

