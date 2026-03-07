
import { useState } from "react";
 import { RawMaterialContext } from "./RawMaterialContext";
export  function AppProvider({children}) {
    const [material, setMaterial]=useState([
        { item:'flour', quantity:10, unit:"kg", minStock:2 ,status:"inStock"},
        { item:'sugar', quantity:5, unit:"kg", minStock:5 ,status:" LowStock"},
        { item:'salt', quantity:3, unit:"kg", minStock:2 ,status:"inStock"},
        { item:'butter', quantity:3, unit:"kg", minStock:5 ,status:"LowStock"}
      
    ])
  return (
    <>
       <RawMaterialContext.Provider value={{material, setMaterial}}>
           {children}
       </RawMaterialContext.Provider>
    </>
  )
}

