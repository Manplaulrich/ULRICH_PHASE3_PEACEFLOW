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
                updatedItems[editIndex] = { name:name, age: number }; // Update the item
                return updatedItems;
            });
        } else {
            // Add a new item
            setItem((prev) => [...prev, { name:name, age: number }]);
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

// import logo from './assets/logo.png'
// import { Link } from "react-router-dom";

// export default function Test() {
//     const [names, setName]=useState('')
//     const[town,setTown]=useState('')
//     const[region,setRegion]=useState('')
//     const [show, setShow]=useState(false)
//     const [inputs, setInputs] = useState([""])
//     const[user, setUser]=useState([
//        {
//         name:"ulrich",
//          address:[
//             {town:"limber",region:"south west", quantity:3},
//             {town:"Douala",region:"littoral"}

//          ]
//        }
//     ])
        
//        const onAdd = () => {
//   setUser((prev) => [
//     ...prev,
//     {
//       name: names,
//       address: [
//         {
//           town: town,
//           region: region
//         }
//       ]
//     }
//   ])
// }
//     const onToggle=()=>{
//          setShow(!show)
//     } 
//     const addInput=()=>{
//       setInputs((prev)=>[...prev,""])
//     }
//   return (
//      <>
//          <header className="bg-amber-600 py-4 px-5">
//           <nav className="flex justify-between ">
//               <div><img src={logo} alt="img1" className="w-25 rounded-full" /></div>
//                <div className="my-8"> 
//                <Link className='text-2xl mr-5 text-amber-700 font-bold bg-white p-2 border-2 border-amber-950 rounded-4xl  transition duration-500 ease-in  transform hover:scale-110 hover:border-2' to='/login'>Login</Link>
//                <Link className='text-2xl text-white bg-amber-900 p-2  rounded-3xl border-2 border-white font-bold transition duration-500 ease-in-out transform hover:scale-110 hover:opacity-80' to='/signup'>SignUp</Link>
//                </div>
//           </nav>
//          </header>
//       user<input value={names} onChange={(e)=>setName(e.target.value)} type="text" className="border-2 mt-20 ml-3"/>
//       town<input value={town} onChange={(e)=>setTown(e.target.value)} type="text" className="border-2 mt-20 ml-3"/>
//       town<input value={region} onChange={(e)=>setRegion(e.target.value)} type="text" className="border-2 mt-20 ml-3"/>
//        <button onClick={onAdd} className="m-5 bg-blue-400 p-2">Add</button>
//      <div>
//      {user.map((use, index) => (
//         <div className=" w-md bg-amber-400" key={index}>
//           <p>{use.name}</p>
//           {use.address.map((addr, i) => (
//             <p key={i}>
//               {addr.town} - {addr.region} {addr.quantity}
//             </p>
//           ))}
//         </div>
//       ))}
//       </div>

//       <div>
//          hello<input type="text" className="border mt-10" />
//           {show &&<div>
//             <input type="text" className="border-2" />
//                {inputs.map((value,index)=>(
//                 <input
//                   key={index}  
//                 type="text" value={value}
//                 onChange={(e)=>{
//                     const newInputs=[...inputs]
//                     newInputs[index]=e.target.value
//                     setInputs(newInputs)
//                 }}
//                className="border-2" />
//                ))}
//               <button onClick={addInput} className="p-2 bg-blue-300 m-3" >Add</button>
//           </div>}
//       </div>
//        <button onClick={onToggle} className="p-2 bg-blue-300 m-3">{show ? "cancle":"Add"}</button>
//     </>
//   )
// }
