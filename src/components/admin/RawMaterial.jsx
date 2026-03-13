import Navbar from "./Navbar"
import { useContext, useState } from "react"
import { supabase } from "../../lib/supabase"
import { RawMaterialContext } from '../itemContext/RawMaterialContext'

export default function RawMaterial() {
    const [name, setName] = useState('')
    const [quantity, setQuantity] = useState('')
    const [unit, setUnit] = useState('')
    const [stocklevel, setStock] = useState('')
    const [show, setShow] = useState(false)
    const [editIndex, setEditIndex] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchFocused, setSearchFocused] = useState(false)

    const { material, setMaterial } = useContext(RawMaterialContext)

    //////////////////////////////////////////////////////
    // TOGGLE FORM
    //////////////////////////////////////////////////////

    const onCloses = () => {
        setShow(!show)
        if (!show) resetForm()
    }

    const onCancel = () => {
        setShow(false)
        resetForm()
    }

    //////////////////////////////////////////////////////
    // RESET FORM
    //////////////////////////////////////////////////////

    const resetForm = () => {
        setName('')
        setQuantity('')
        setUnit('')
        setStock('')
        setEditIndex(null)
    }

    //////////////////////////////////////////////////////
    // ADD OR UPDATE MATERIAL
    //////////////////////////////////////////////////////

    // const handleAdd = () => {
    //     if (name.trim() === "" || quantity === "" || unit === "" || stocklevel === "") {
    //         alert("Please fill all the fields")
    //         return
    //     }

    //     const newMaterial = {
    //         item: name,
    //         quantity: Number(quantity),
    //         unit: unit,
    //         minStock: Number(stocklevel)
    //     }

    //     if (editIndex !== null) {
    //         setMaterial(prev => {
    //             const updated = [...prev]
    //             updated[editIndex] = newMaterial
    //             return updated
    //         })
    //     } else {
    //         setMaterial(prev => [newMaterial, ...prev])
    //     }

    //     resetForm()
    //     setShow(false)
    // }

                                               async function fetchMaterials(){

 const { data, error } = await supabase
 .from("materials")
 .select("*")
 .order("id", { ascending: false })
 if(!error){
   setMaterial(data)
 }

}

                  const handleAdd = async () => {

    if (name.trim() === "" || quantity === "" || unit === "" || stocklevel === "") {
        alert("Please fill all the fields")
        return
    }

    const newMaterial = {
        item: name,
        quantity: Number(quantity),
        unit: unit,
        minStock: Number(stocklevel) // must match Supabase column
    }

    try {

        if (editIndex !== null) {

            // UPDATE MATERIAL
            const materialId = material[editIndex].id

            const { error } = await supabase
                .from("materials")
                .update(newMaterial)
                .eq("id", materialId)

            if (error) throw error

            alert("Material updated successfully")

        } else {

            // ADD MATERIAL
            const { error } = await supabase
                .from("materials")
                .insert([newMaterial])

            if (error) throw error

            alert("Material added successfully")

        }

        // Refresh materials
        fetchMaterials()

    } catch (error) {

        alert(error.message)

    }
    setMaterial((prev)=>[newMaterial, ...prev])
    resetForm()
    setShow(false)
}

    //////////////////////////////////////////////////////
    // STATUS COLOR - Keeping red for low stock
    //////////////////////////////////////////////////////

    const handleStockColor = (quantity, minStock) => {
        return Number(quantity) <= Number(minStock)
            ? "text-red-700 bg-red-100 font-semibold px-4 py-2 rounded-full text-sm"
            : "text-amber-700 bg-amber-100 font-semibold px-4 py-2 rounded-full text-sm"
    }

    //////////////////////////////////////////////////////
    // STATUS TEXT
    //////////////////////////////////////////////////////

    const getStockStatus = (quantity, minStock) => {
        return Number(quantity) <= Number(minStock) ? "Low Stock" : "In Stock"
    }

    //////////////////////////////////////////////////////
    // DELETE
    //////////////////////////////////////////////////////

    // const onDelete = (toindex) => {
    //     if (window.confirm('Are you sure you want to delete this item?')) {
    //         const newArray = material.filter((_, index) => index !== toindex)
    //         setMaterial(newArray)
    //     }
    // }

             const onDelete = async (toIndex) => {

  if (!window.confirm("Are you sure you want to delete this item?")) return

  const materialId = material[toIndex].id

  const { error } = await supabase
    .from("materials")
    .delete()
    .eq("id", materialId)

  if (error) {
    alert("Error deleting material: " + error.message)
    return
  }

  // update UI after delete
  setMaterial(prev => prev.filter((_, index) => index !== toIndex))

}

    //////////////////////////////////////////////////////
    // EDIT
    //////////////////////////////////////////////////////

    const onEdit = (toindex) => {
        setShow(true)
        const editItem = material[toindex]
        setName(editItem.item)
        setQuantity(editItem.quantity)
        setUnit(editItem.unit)
        setStock(editItem.minStock)
        setEditIndex(toindex)
        
        // Smooth scroll to form
        setTimeout(() => {
            document.getElementById('material-form')?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            })
        }, 100)
    }

    //////////////////////////////////////////////////////
    // SEARCH FILTER
    //////////////////////////////////////////////////////

    const filteredMaterials = material.filter(item =>
        item.item.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50">
            <Navbar />
            
            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
                
                {/* HEADER WITH GRADIENT */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-bold bg-linear-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent">
                                Raw Materials
                            </h1>
                            <p className="text-amber-600 mt-2 text-lg">
                                Manage your inventory materials efficiently
                            </p>
                        </div>
                        
                        <button
                            onClick={onCloses}
                            className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg ${
                                show
                                    ? 'bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800'
                                    : 'bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                            }`}
                        >
                            {show ? (
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancel
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add New Material
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* ENHANCED SEARCH BAR */}
                <div className="mb-10">
                    <div className={`relative transition-all duration-500 ${searchFocused ? 'transform scale-105' : ''}`}>
                        <input
                            type="text"
                            placeholder=" Search materials by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className="w-full px-8 py-5 pl-14 bg-white/80 backdrop-blur-sm border-2 border-amber-200 rounded-2xl shadow-lg focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all duration-300 text-gray-700 placeholder-amber-300 text-lg"
                        />
                        <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-amber-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-amber-300 hover:text-amber-500 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    
                    {/* Search results count */}
                    {searchTerm && (
                        <div className="mt-3 text-sm text-amber-500 ml-2">
                            Found {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material' : 'materials'}
                        </div>
                    )}
                </div>

                {/* FORM WITH ANIMATION */}
                {show && (
                    <div 
                        id="material-form"
                        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-10 border border-amber-200 transform transition-all duration-500 animate-slideDown"
                    >
                        <h2 className="text-2xl font-bold bg-linear-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent mb-8 flex items-center gap-2">
                            {editIndex !== null ? (
                                <>
                                    <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Material
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Add New Material
                                </>
                            )}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="group">
                                <label className="block text-sm font-semibold text-amber-700 mb-2 group-focus-within:text-amber-600 transition-colors">
                                    Material Name
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Wheat Flour"
                                    className="w-full p-4 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all duration-300 group-hover:border-amber-300"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-sm font-semibold text-amber-700 mb-2 group-focus-within:text-amber-600 transition-colors">
                                    Quantity
                                </label>
                                <input
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    type="number"
                                    placeholder="e.g., 100"
                                    className="w-full p-4 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all duration-300 group-hover:border-amber-300"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-sm font-semibold text-amber-700 mb-2 group-focus-within:text-amber-600 transition-colors">
                                    Unit
                                </label>
                                <select
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="w-full p-4 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all duration-300 group-hover:border-amber-300 bg-white"
                                >
                                    <option value="">Select Unit</option>
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="g">Grams (g)</option>
                                    <option value="L">Liter (L)</option>
                                    <option value="pcs">Pieces (pcs)</option>
                                    <option value="ml">Milliliter (ml)</option>
                                    <option value="dozen">Dozen</option>
                                </select>
                            </div>

                            <div className="group">
                                <label className="block text-sm font-semibold text-amber-700 mb-2 group-focus-within:text-amber-600 transition-colors">
                                    Minimum Stock Level
                                </label>
                                <input
                                    value={stocklevel}
                                    onChange={(e) => setStock(e.target.value)}
                                    type="number"
                                    placeholder="e.g., 20"
                                    className="w-full p-4 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all duration-300 group-hover:border-amber-300"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end mt-8">
                            <button
                                onClick={handleAdd}
                                className="px-8 py-4 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                            >
                                {editIndex !== null ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        Update Material
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Material
                                    </>
                                )}
                            </button>
                            <button
                                onClick={onCancel}
                                className="px-8 py-4 bg-amber-200 hover:bg-amber-300 text-amber-700 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* ENHANCED TABLE */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-amber-100">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-linear-to-r from-amber-700 to-amber-600 text-white">
                                <th className="py-5 px-6 text-left text-sm font-semibold uppercase tracking-wider">Material</th>
                                <th className="py-5 px-6 text-left text-sm font-semibold uppercase tracking-wider">Quantity</th>
                                <th className="py-5 px-6 text-left text-sm font-semibold uppercase tracking-wider">Unit</th>
                                <th className="py-5 px-6 text-left text-sm font-semibold uppercase tracking-wider">Min Stock</th>
                                <th className="py-5 px-6 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                                <th className="py-5 px-6 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-amber-100">
                            {filteredMaterials.length > 0 ? (
                                filteredMaterials.map((items, index) => (
                                    <tr 
                                        key={index} 
                                        className="hover:bg-amber-50 transition-all duration-300 group"
                                    >
                                        <td className="py-5 px-6">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-linear-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                                                    <span className="text-amber-600 font-semibold">
                                                        {items.item.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-amber-800 text-lg">{items.item}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className="text-lg font-semibold text-amber-800">{items.quantity}</span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className="px-4 py-2 bg-amber-100 rounded-lg text-amber-700 font-medium">
                                                {items.unit}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className="text-lg font-semibold text-amber-800">{items.minStock}</span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className={handleStockColor(items.quantity, items.minStock)}>
                                                {getStockStatus(items.quantity, items.minStock)}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => onEdit(index)}
                                                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-2 text-sm font-semibold"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => onDelete(index)}
                                                    className="px-5 py-2.5 bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-2 text-sm font-semibold"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-16 h-16 text-amber-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <p className="text-amber-600 text-xl mb-2">
                                                {material.length === 0 
                                                    ? "No materials added yet" 
                                                    : `No materials match "${searchTerm}"`}
                                            </p>
                                            {material.length === 0 ? (
                                                <button
                                                    onClick={onCloses}
                                                    className="mt-4 px-6 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105"
                                                >
                                                    Add Your First Material
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setSearchTerm("")}
                                                    className="mt-4 text-amber-500 hover:text-amber-600 font-semibold transition-colors"
                                                >
                                                    Clear Search
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Animation keyframes */}
            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.5s ease-out;
                }
            `}</style>
        </div>
    )
}