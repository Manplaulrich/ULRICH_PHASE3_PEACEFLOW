
import { useState,useEffect } from "react";
 import { RawMaterialContext } from "./RawMaterialContext";
 import { supabase } from "../../lib/supabase";
 export  function AppProvider({children}) {
    // const [material, setMaterial]=useState([
    //     { item:'flour', quantity:10, unit:"kg", minStock:2 ,status:"inStock"},
    //     { item:'sugar', quantity:5, unit:"kg", minStock:5 ,status:" LowStock"},
    //     { item:'salt', quantity:3, unit:"kg", minStock:2 ,status:"inStock"},
    //     { item:'butter', quantity:3, unit:"kg", minStock:5 ,status:"LowStock"}

      
    // ])
    const [material, setMaterial]=useState([])
    const [recipe, setRecipe]=useState([])
    
     
   useEffect(()=>{
    async function fetchMaterials(){
        const {data, error}=await supabase 
        .from("materials")
        .select("*")
         .order("id", { ascending: false })
        if(error){
          alert(error.message)
        }else{
          setMaterial(data)
        }
     }
      fetchMaterials()
    },[])

    // const [recipe, setRecipe]=useState([
    //    {
    //     name:"Bread",
    //     output:1,
    //     user:[
    //        "ulrich"
    //     ],
    //     materials:[
    //       {items:"flour",quant:1, units:"kg"},
    //       {items:"salt",quant:0.5, units:"g"},
    //       {items:"butter",quant:0.6, units:"g"}
    //     ]
    //    },
    //   {
    //     name:"cake",
    //     output:1,
    //     user:[
    //        "ulrich"
    //     ],
    //     materials:[
    //       {items:"flour",quant:2, units:"kg"},
    //       {items:"salt",quant:0.5, units:"g"},
    //       {items:"butter",quant:0.8, units:"g"}
    //     ]
    //    }
       
    // ])
      useEffect(()=>{
            const fetchRecipes = async ()=>{
              const {data, error} = await supabase 
              .from("recipes")
              .select(`

                 name,
                 output,
                 recipe_materials!fk_recipe(
                  quantity,
                  unit,
                  material!fk_material(
                   name
                  )
                 )
                
                `)
              if(error){
                console.log(error.message)
                alert(error.message)
              }else{
                setRecipe(data)
              }
            }
          fetchRecipes()  
      },[])
const [productionHistory,setProductionHistory]=useState([])

  return (
    <>
       <RawMaterialContext.Provider value={{material, setMaterial,recipe,setRecipe,productionHistory,setProductionHistory}}>
           {children}
       </RawMaterialContext.Provider>
    </>
  )
}

