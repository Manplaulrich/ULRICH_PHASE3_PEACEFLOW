// import { useState } from "react";

// export default function Test() {
//     const [show, setShow] = useState(false);

//     const toggleDiv = () => {
//         setShow(!show); // Toggle the state
//     };
//   const onCloses=()=>{
//      setShow(!show)
//   }
//     return (
//         <>
//             <button className="bg-blue-500 p-4 ml-30 mt-30" onClick={toggleDiv}>
//                 {show ? "Close" : "Add"}
//             </button>
//             {show && (
//                 <div className="bg-amber-400 h-40 w-50">
//                     Hello world
//                      {/* <button onClick={onCloses} className="bg-green-60 ml-4 bg-green-500">cancel</button> */}
//                 </div>
//             )}
//             <p>You are the best</p>
//         </>
//     );
// }

import {useState } from "react";

export default function Test() {
    const [show,setShow]=useState(false)
     const [name, setName]=useState("")
     const [number, setNumber]=useState("")
      const [editIndex, setEditIndex] = useState(null)
    const [item, setItem] = useState([
        { name: "Ulrich", age: 30 },
        { name: "manpla", age: 50 },
        {name:"tenken", age:60}
    ]);
  const handleSubmit=()=>{
    //   if(name=="" && number==""){
    //    return alert("fill all the form")
    //   }
        
    //    setItem([...item,{name:name, age:number}])
    //    setName("")
    //    setNumber("")
     if (editIndex !== null) {
            // Update existing item if in edit mode
            setItem((prev) => {
                const updatedItems = [...prev];
                updatedItems[editIndex] = { name, age: number }; // Update the item
                return updatedItems;
            });
        } else {
            // Add a new item
            setItem((prev) => [...prev, { name, age: number }]);
        }
        
        // Reset form inputs
        setName("");
        setNumber("");
        setShow(false); // Hide input fields
        setEditIndex(null); // Reset edit index
  }

    const onDelete=(toindex)=>{
        const newarray=item.filter((u,index)=> index !=toindex)
        setItem(newarray)
    }

    const states=()=>{
        setShow(!show)
    }

    
    const onEdit = (toIndex) => {
        setShow(true); // Show input fields for editing
        const editItem = item[toIndex]; // Get the item to edit
        setName(editItem.name); // Set name input to the item name
        setNumber(editItem.age); // Set age input to the item age
        setEditIndex(toIndex); // Save the index of the item being edited
    };

    const handleStatus=(age)=>{
        if(age>=50){
            return "old"
        }else{
            return "young"
        }
    }
    const handleColor=(age)=>{
        // age >=30 ? "text-green-600" : "text-red-600"
        if(age>=30){
            return "text-green-900 bg-yellow-600 rounded-4xl text-center "
        }else{
           return "text-red-500"
        }
    }
    return (
        <>
            <button className="bg-amber-700 text-white p-2 rounded-2xl" onClick={states}>{show? "Cancel" : "+Add user"}</button>
            { show &&<div>
                
            Nmae<input value={name} onChange={(e)=>setName(e.target.value)} type="text"  placeholder="name..." className="border-2"/>
            Age<input value={number} onChange={(e)=>setNumber(e.target.value)} type="number"  placeholder="age..." className="border-2"/>
             <button onClick={handleSubmit} className="bg-blue-700">Add</button>
                </div>}
            <h1 className="mb-20 mt-5 font-bold text-2xl">Items List</h1>

            {/* {item.map((u, index) => 
                <div key={index}>
                    Name: {u.name}, Age: {u.age}
                </div>
            )} */}

            <table className=" w-full text-start">
                <thead className="bg-gray-400">
                    <th>Name</th>
                    <th>Age</th>
                    <th>Status</th>
                    <th></th>
                </thead>
                <tbody>
                    {
                        item.map((u,index)=><tr key={index}>
                            <td>{u.name}</td>
                             <td>{u.age}</td>
                             <td className={handleColor(u.age)}>{handleStatus(u.age)}</td>
                             <td><button onClick={()=>onEdit(index)} className="bg-gray-300 p-3 rounded-2xl mr-2">Edit</button><button onClick={()=>onDelete(index)} className="border-red-400 rondded border-2 rounded-2xl p-2 text-red-800">Delete</button></td>
                        </tr>)
                    }
                    <tr>
                        <td>Total:{"  "}{item.length}</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}