import { Routes, Route} from "react-router-dom"

import Login from "../components/Login"
import Homepage from "../components/Homepage"
import SignUp from "../components/SignUp"
 import Dashboard from "../components/admin/Dashboard"
 import RawMaterial from "../components/admin/RawMaterial" 
 import ProductionSetup from "../components/admin/ProductionSetup"
 import StockReport from "../components/admin/StockReport"
 import Test from "../Test"

export default function AppRouter() {
  return (
      <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>
           <Route path="/dashboard" element={<Dashboard/>}/>
           <Route path="/rawmaterial" element={<RawMaterial/>}/>
           <Route path="/setproduction" element={<ProductionSetup/>}/>
           <Route path="/report" element={<StockReport/>}/>

           <Route path="/test" element={<Test/>}/>
           

      </Routes>
  )
}

