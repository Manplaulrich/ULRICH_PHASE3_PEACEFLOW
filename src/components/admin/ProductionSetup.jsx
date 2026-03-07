
import { useContext,useState} from "react"
import { RawMaterialContext } from "../itemContext/RawMaterialContext"
import Navbar from "./Navbar"

export default function ProductionSetup() {
    const [show,setShow]=useState(false)
    const{recipe,material,setRecipe}=useContext(RawMaterialContext)
    const [name,setNmae]=useState('')
    const [rawMaterial, setRawMaterial]=useState("")
    const [out, setOut]=useState("")
    const [quantity,setQuantity]=useState("")
     
    const onShow=()=>{
        setShow(!show)
    }
   const createRecipe=()=>{
         setRecipe((prev)=>[
            ...prev,
            {
                name:name,
                output:out,
                materials:[
                    {items:name}
                ]
            }
         ])
   }
   const onDelete=(toindex)=>{
       const newRecipe=recipe.filter((item, index)=> index==toindex)
       setRecipe(newRecipe)
   }
  return (
    <>
       <div>
         <Navbar/>
            <div className="pt-25 mx-10">
                <div className="flex  justify-between">
                    <h1 className="text-2xl font-bold text-blue-700">Production Setup</h1>
                     <button onClick={onShow} className="bg-blue-500 p-2  text-white text-xl rounded-3xl hover:bg-blue-900 transition duration-500 ease-out">{show? "cancel":"+Add Recipe"}</button>
                </div>
                      
                       {show &&<div>
                           <div className=" border p-2 mb-10 w-xl shadow-md show-black rounded-2xl ">
                            <div className="flex text-xl justify-between ">
                               <div >
                                <label htmlFor="name">Recipe Name</label><br />
                                <input value={name} onChange={(e)=>setNmae(e.target.value)} type="text" className="border border-gray-500 rounded" />
                               </div>
                               <div>
                                  <label htmlFor="output">OutPut Quantity</label><br />
                                  <input value={out} onChange={(e)=>setOut(e.target.value)} type="number" className="border border-gray-500 rounded" />
                               </div>
                             </div>  
                                <div className="flex justify-between text-xl">
                                    <div>
                                        <label htmlFor="material">Materials</label><br />
                                        <select value={rawMaterial} onChange={(e)=>setRawMaterial(e.target.value)} className="border border-gray-500 rounded">
                                            <option value="">select Material</option>
                                             {material.map((mat,index)=><option value={mat.item} key={index}>{mat.item}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="quantity">Quantity</label><br />
                                        <input value={quantity} onChange={(e)=>setQuantity(e.target.value)} type="number" className="border border-gray-500 rounded" />
                                    </div>
                                </div >
                                 <div className="mt-5">
                                    <button className="bg-gray-500 text-white p-2 m-4 rounded text-lg hover:bg-gray-700">+Add material</button>
                                    <button onClick={createRecipe} className=" bg-blue-600 p-2 text-white rounded text-xl hover:bg-blue-800">Create Recipe</button>
                                 </div>
                           </div>
                       </div>}

                  <div>
                      
                      <div className=" text-xl  pl-3 py-2 grid lg:grid-cols-3 gap-4 w-full">
                           {recipe.map((use, index) => (
                        <div className=" bg-blue-50 rounded-2xl pl-2" key={index}>
                      <div> 
                        <h1 className="text-2xl font-bold">Recipe Name: {use.name}</h1>
                      </div>
                       <div>output: {use.output}</div>
                       <h2 className="font-bold">List of Materials</h2>
                       <ul>
                        {use.materials.map((mat, index) => (
                       <li key={index}>
                         {mat.items}:  {mat.quant} {mat.units}
                         </li>
                       ))}
                     </ul>
                     <div className="text-end mr-10 mb-2">
                      <button onClick={()=>onDelete(index)} className="bg-red-500 text-white p-2 rounded-2xl hover:bg-red-700 transition ease-out duration-500">Delete</button>
                     </div>
                   </div>
      ))}
                      </div>
                       
                  </div>
            </div>
       </div>
    </>
  )
}
