
import Navbar from "./Navbar"
import { useContext } from "react"
import { RawMaterialContext} from "../itemContext/RawMaterialContext"
export default function Dashboard() {
   const {material}=useContext(RawMaterialContext)
     const handledLowStock=()=>{
            let newarray=material.filter(item=> item.status !=="inStock")
              return newarray.length 
            }
        const handledAlert=()=>{
                let newarray=material.filter(item=> item.status !=="inStock")
                return  newarray
                .map((items, index)=> <p key={index}>{items.item} current: {items.quantity} {items.unit}  MinimumStock: {items.minStock} {items.unit} </p>)
                
            }
  return (
    < >
      <div className="bg-gray-100 h-screen">
       <Navbar/> 
        <div className="mx-10 ">
             <div className=" py-25 ">
                 <h1 className="text-2xl font-bold text-blue-700">Dashboard</h1>
                  <div className="  py-4 grid lg:grid-cols-4 gap-2  mt-13 shadow-lg">
                     <div className="shadow-2xl rounded-2xl text-center pb-3">
                        <h4 className="text-2xl mb-5">Total Materials</h4>
                        <span className="text-3xl font-bold">{material.length}</span>
                     </div>
                     <div className="shadow-2xl rounded-2xl text-center pb-3">
                        <h4 className="text-2xl mb-5">Low Stock Items</h4>
                        <span className="text-2xl font-bold text-amber-500 ">{handledLowStock()}</span>
                     </div>
                     <div className="shadow-2xl rounded-2xl text-center pb-3">
                        <h4 className="text-2xl mb-5">Production Recipes</h4>
                        <span className="text-2xl font-bold">0</span>
                     </div>
                     <div className="shadow-2xl rounded-2xl text-center pb-3">
                        <h4 className="text-2xl mb-5">Recent Production</h4>
                        <span className="text-2xl font-bold">0</span>
                     </div>
                  </div>
                  
                  <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-3">Low Stock Alerts</h2>
                    <div className="bg-amber-100 border-2 border-amber-700 rounded-2xl py-4 px-2 text-xl ">{handledAlert()}</div>
                  </div>

                  <div className="mt-10">
                     <h2 className="text-2xl font-bold mb-3">Recent Activity</h2>
                      <table className="border-2 w-full">
                         <thead>
                            <th>Name</th>
                            <th>unitProduce</th>
                         </thead>
                      </table>
                  </div>
                   
             </div>
        </div>
      </div>   
    </>
  )
}
