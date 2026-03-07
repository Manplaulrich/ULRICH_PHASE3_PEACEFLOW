
import { useState } from "react";
 import { RawMaterialContext } from "./RawMaterialContext";
export  function AppProvider({children}) {
    const [material, setMaterial]=useState([
        { item:'flour', quantity:10, unit:"kg", minStock:2 ,status:"inStock"},
        { item:'sugar', quantity:5, unit:"kg", minStock:5 ,status:" LowStock"},
        { item:'salt', quantity:3, unit:"kg", minStock:2 ,status:"inStock"},
        { item:'butter', quantity:3, unit:"kg", minStock:5 ,status:"LowStock"}
      
    ])

    const [recipe, setRecipe]=useState([
       {
        name:"Bread",
        output:1,
        user:[
           "ulrich"
        ],
        materials:[
          {items:"flour",quant:1, units:"kg"},
          {items:"salt",quant:0.5, units:"g"},
          {items:"butter",quant:0.6, units:"g"}
        ]
       },
      {
        name:"cake",
        output:1,
        user:[
           "ulrich"
        ],
        materials:[
          {items:"flour",quant:2, units:"kg"},
          {items:"salt",quant:0.5, units:"g"},
          {items:"butter",quant:0.8, units:"g"}
        ]
       }
       
    ])
  return (
    <>
       <RawMaterialContext.Provider value={{material, setMaterial,recipe,setRecipe}}>
           {children}
       </RawMaterialContext.Provider>
    </>
  )
}

