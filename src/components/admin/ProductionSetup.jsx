import { useContext, useState } from "react";
import { RawMaterialContext } from "../itemContext/RawMaterialContext";
import Navbar from "./Navbar";

export default function ProductionSetup() {

const [showForm, setShowForm] = useState(false);
const { recipe, material, setRecipe } = useContext(RawMaterialContext);

const [name, setName] = useState('');
const [rawMaterial, setRawMaterial] = useState("");
const [output, setOutput] = useState("");
const [quantity, setQuantity] = useState("");
const [materialsList, setMaterialsList] = useState([]);

const [editIndex,setEditIndex] = useState(null);

////////////////////////////////////////////////////////
//// TOGGLE FORM
////////////////////////////////////////////////////////

const toggleForm = () => {
setShowForm(!showForm);

if(showForm){
resetForm()
}
};

////////////////////////////////////////////////////////
//// RESET FORM
////////////////////////////////////////////////////////

const resetForm = () => {
setName('');
setRawMaterial("");
setOutput("");
setQuantity("");
setMaterialsList([]);
setEditIndex(null);
};

////////////////////////////////////////////////////////
//// ADD MATERIAL
////////////////////////////////////////////////////////

const addMaterial = () => {

if(rawMaterial && quantity){

const selectedMaterial = material.find(m => m.item === rawMaterial);

setMaterialsList([
...materialsList,
{
item: rawMaterial,
quantity: quantity,
unit: selectedMaterial?.unit || 'units'
}
]);

setRawMaterial("");
setQuantity("");

}

};

////////////////////////////////////////////////////////
//// REMOVE MATERIAL
////////////////////////////////////////////////////////

const removeMaterial = (indexToRemove) => {
setMaterialsList(materialsList.filter((_, index) => index !== indexToRemove));
};

////////////////////////////////////////////////////////
//// CREATE OR UPDATE RECIPE
////////////////////////////////////////////////////////

const saveRecipe = () => {

if (!name || !output || materialsList.length === 0) {
alert("Please fill in all fields and add at least one material");
return;
}

const formattedMaterials = materialsList.map(mat => ({
items: mat.item,
quant: mat.quantity,
units: mat.unit
}));

if(editIndex !== null){

const updated = [...recipe]

updated[editIndex] = {
...updated[editIndex],
name,
output,
materials: formattedMaterials
}

setRecipe(updated)

}else{

setRecipe((prev) => [
...prev,
{
id: Date.now(),
name,
output,
materials: formattedMaterials
}
])

}

resetForm()
setShowForm(false)

};

////////////////////////////////////////////////////////
//// DELETE RECIPE
////////////////////////////////////////////////////////

const onDelete = (index) => {
const newRecipe = recipe.filter((_,i)=> i !== index)
setRecipe(newRecipe)
};

////////////////////////////////////////////////////////
//// EDIT RECIPE
////////////////////////////////////////////////////////

const onEdit = (index) => {

const selected = recipe[index]

setName(selected.name)
setOutput(selected.output)

setMaterialsList(
selected.materials.map(m=>({
item:m.items,
quantity:m.quant,
unit:m.units
}))
)

setEditIndex(index)
setShowForm(true)

};

////////////////////////////////////////////////////////
//// UI
////////////////////////////////////////////////////////

return (

<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

<Navbar />

<div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

{/* HEADER */}

<div className="flex justify-between items-center mb-8">

<h1 className="text-3xl font-bold text-gray-800">
Production Setup
</h1>

<button
onClick={toggleForm}
className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
showForm
? "bg-red-500 hover:bg-red-600"
: "bg-blue-600 hover:bg-blue-700"
}`}
>
{showForm ? "Cancel" : "+ Add Recipe"}
</button>

</div>

{/* FORM */}

{showForm && (

<div className="bg-white rounded-xl shadow-lg p-6 mb-8 border">

<h2 className="text-xl font-semibold text-gray-700 mb-6">
{editIndex !== null ? "Edit Recipe" : "Create New Recipe"}
</h2>

<div className="grid md:grid-cols-2 gap-6 mb-6">

<div>
<label className="block text-sm font-medium mb-2">
Recipe Name
</label>
<input
value={name}
onChange={(e)=>setName(e.target.value)}
type="text"
className="w-full border rounded-lg px-4 py-2"
/>
</div>

<div>
<label className="block text-sm font-medium mb-2">
Output Quantity
</label>
<input
value={output}
onChange={(e)=>setOutput(e.target.value)}
type="number"
className="w-full border rounded-lg px-4 py-2"
/>
</div>

</div>

{/* MATERIAL INPUT */}

<div className="grid md:grid-cols-3 gap-4 mb-4">

<select
value={rawMaterial}
onChange={(e)=>setRawMaterial(e.target.value)}
className="border rounded-lg px-3 py-2"
>
<option value="">Select Material</option>

{material.map((mat,index)=>(
<option key={index} value={mat.item}>
{mat.item} ({mat.unit})
</option>
))}

</select>

<input
value={quantity}
onChange={(e)=>setQuantity(e.target.value)}
type="number"
className="border rounded-lg px-3 py-2"
placeholder="Quantity"
/>

<button
onClick={addMaterial}
className="bg-green-600 text-white rounded-lg hover:bg-green-700"
>
Add Material
</button>

</div>

{/* MATERIAL LIST */}

{materialsList.length>0 &&(

<div className="bg-gray-50 p-4 rounded-lg">

{materialsList.map((mat,index)=>(
<div key={index} className="flex justify-between mb-2">

<span>
{mat.item}: {mat.quantity} {mat.unit}
</span>

<button
onClick={()=>removeMaterial(index)}
className="text-red-500 text-sm"
>
Remove
</button>

</div>
))}

</div>

)}

<div className="flex justify-end mt-6">

<button
onClick={saveRecipe}
className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
>
{editIndex !== null ? "Update Recipe" : "Create Recipe"}
</button>

</div>

</div>

)}

{/* RECIPES */}

{recipe.length > 0 ? (

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{recipe.map((item,index)=>(

<div
key={index}
className="bg-white rounded-xl shadow-md hover:shadow-xl transition border"
>

<div className="p-6">

<h2 className="text-xl font-bold text-gray-800 mb-2">
{item.name}
</h2>

<p className="text-blue-600 font-semibold mb-4">
Output: {item.output}
</p>

<h3 className="text-sm font-semibold text-gray-600 mb-2">
Materials
</h3>

<ul className="space-y-1">

{item.materials.map((mat,i)=>(
<li key={i} className="text-sm text-gray-600">
• {mat.items}: {mat.quant} {mat.units}
</li>
))}

</ul>

</div>

{/* CARD FOOTER */}

<div className="flex justify-between px-6 py-3 bg-gray-50 border-t">

<button
onClick={()=>onEdit(index)}
className="px-4 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
>
Edit
</button>

<button
onClick={()=>onDelete(index)}
className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
>
Delete
</button>

</div>

</div>

))}

</div>

) : (

<div className="text-center py-12 bg-white rounded-xl shadow-sm border">

<p className="text-gray-500 text-lg">
No recipes created yet
</p>

</div>

)}

</div>

</div>

)
}