
import Navbar from "./Navbar"
import { useContext,useState } from "react"
import {RawMaterialContext} from '../itemContext/RawMaterialContext'
export default function RawMaterial() {
    const [name, setName]=useState('')
    const [quantity, setQuantity]=useState('')
    const [unit, setUnit]=useState('')
    const [stocklevel,setStock]=useState('')
    const [show, setShow]=useState(false)

    const {material, setMaterial}=useContext(RawMaterialContext)
    const onCloses=()=>{
        setShow(!show)
    }
    const onCancel=()=>{
        setShow(!show)
    }
      const handleAdd=()=>{
        const newMaterial={
            item:name,
            quantity:quantity,
            unit:unit,
            minStock:stocklevel,
            status:quantity<=stocklevel? "LowStock":" inStock"

        }
          if(name=="" || quantity==""|| unit=="" || stocklevel==""){
              alert("please fill all the field")
              return
          }

        setMaterial((prev)=>[...prev,newMaterial])

         setName("")
          setQuantity("")
          setUnit("")
          setStock("")
          setShow(show)
      
      }
       
          const handleStockColor=(quantity, minStock)=>{
           return  quantity <= minStock? "text-red-600 bg-red-300 w-10 p-1":"text-green-800  bg-green-200  "
          }
          const onDelete=(toindex)=>{
              const newArray=material.filter((item, index)=> index !==toindex)
            setMaterial(newArray)
          }


      return (
        
    <>
        <div>
            <Navbar/>
             <div className="pt-26 mx-10">
                 <div className="flex lg:justify-between mt-10">
                     <h1 className="text-2xl font-bold text-blue-700">Raw Materials</h1>
                      <button onClick={onCloses} className="bg-blue-500 p-2  text-white text-xl rounded-3xl hover:bg-blue-900 transition duration-500 ease-out">{show ? "Cancel":"+Add Material"}</button>
                 </div>
                 { show &&
            <div className=" py-4 px-4 w-1/2 rounded-2xl shadow-md shadow-black z-50">
                <div className="flex justify-between">
                 <div>
                    <label className="text-xl text-gray-900" htmlFor="name">Material name</label><br />
                    <input value={name} onChange={(e)=>setName(e.target.value)} type="text" className=" w-70 border-gray-500 border-2 rounded" required />
                 </div>
                 <div>
                    <label className="text-xl text-gray-900" htmlFor="quantity">Quantity</label><br />
                    <input value={quantity} onChange={(e)=>setQuantity(e.target.value)} type="number" className="w-70 border-gray-500 border-2 rounded" required />
                 </div>
              </div>
              <div className="flex lg:justify-between mt-5">
                 <div>
                    <label className="text-xl text-gray-900" htmlFor="unit">Unit</label><br />
                    <select value={unit} onChange={(e)=>setUnit(e.target.value)} className="w-70 border-gray-500 border-2 rounded" required>
                        <option value="">Select Unit</option>
                        <option value="kg">Kilogram(kg)</option>
                        <option value="g">Grams(g)</option>
                        <option value="L">Liter(L)</option>
                    </select>
                 </div>
                <div>
                    <label className="text-xl text-gray-900" htmlFor="minStok">Minimum Stock level</label><br />
                    <input value={stocklevel} onChange={(e)=>setStock(e.target.value)} type="number" className=" w-70 border-gray-500 border-2 rounded" required/>
                </div>
            </div>  
               <div className="flex gap-10 justify-center mt-5">
                 <button onClick={handleAdd} className="bg-blue-600 p-2 rounded-2xl text-white font-bold hover:bg-blue-800 transition ease-out duration-500">Add Material</button>
                 <button onClick={onCancel} className="bg-gray-500 px-2 rounded-2xl text-white font-bold transition hover:bg-gray-700 duration-500 ease-out">Cancel</button>
               </div>
            </div>}
            <div>
                <table className="w-full text-center mt-20 tex-xl border-separate ">
                    <thead className=" text-2xl text-gray-600 bg-gray-300 mb-10">
                        <tr>
                        <th>Material</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                         <th>Minimum Stock</th>
                        <th>Status</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                     <tbody>
                         {
                            material.map((items, index)=><tr className="bg-amber-50 border-b border-2 border-gray-300" key={index}>
                                <td className="text-xl font-bold">{items.item}</td>
                                <td className="text-xl">{items.quantity}</td>
                                <td className="text-xl">{items.unit}</td>
                                 <td className="text-xl">{items.minStock}</td>
                                <td className={`text-xl ${handleStockColor(items.quantity,items.minStock )}`}>{items.status}</td>
                                <td><button className="bg-gray-500 p-2 rounded mr-3 text-white">Edit</button><button onClick={()=>onDelete(index)} className="bg-red-600 text-white  p-2 rounded-2xl">Delete</button></td>
                            </tr>)
                         }
                     </tbody>
                </table>
            </div>
         </div>
        </div>
     </>
  )
}
