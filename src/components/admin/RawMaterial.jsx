import Navbar from "./Navbar"
import { useContext, useState } from "react"
import { RawMaterialContext } from '../itemContext/RawMaterialContext'

export default function RawMaterial() {

    const [name, setName] = useState('')
    const [quantity, setQuantity] = useState('')
    const [unit, setUnit] = useState('')
    const [stocklevel, setStock] = useState('')
    const [show, setShow] = useState(false)
    const [editIndex, setEditIndex] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    const { material, setMaterial } = useContext(RawMaterialContext)

    //////////////////////////////////////////////////////
    // TOGGLE FORM
    //////////////////////////////////////////////////////

    const onCloses = () => {
        setShow(!show)
        resetForm()
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

    const handleAdd = () => {

        if (name.trim() === "" || quantity === "" || unit === "" || stocklevel === "") {
            alert("Please fill all the fields")
            return
        }

        const newMaterial = {
            item: name,
            quantity: Number(quantity),
            unit: unit,
            minStock: Number(stocklevel)
        }

        if (editIndex !== null) {

            setMaterial(prev => {
                const updated = [...prev]
                updated[editIndex] = newMaterial
                return updated
            })

        } else {

            setMaterial(prev => [newMaterial, ...prev])

        }

        resetForm()
        setShow(false)
    }

    //////////////////////////////////////////////////////
    // STATUS COLOR
    //////////////////////////////////////////////////////

    const handleStockColor = (quantity, minStock) => {

        return Number(quantity) <= Number(minStock)
            ? "text-red-700 bg-red-100 font-semibold px-3 py-1 rounded-full"
            : "text-green-700 bg-green-100 font-semibold px-3 py-1 rounded-full"
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

    const onDelete = (toindex) => {

        if (window.confirm('Are you sure you want to delete this item?')) {

            const newArray = material.filter((_, index) => index !== toindex)

            setMaterial(newArray)
        }
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
    }

    //////////////////////////////////////////////////////
    // SEARCH FILTER
    //////////////////////////////////////////////////////

    const filteredMaterials = material.filter(item =>
        item.item.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">

            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

                {/* HEADER */}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Raw Materials
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage your inventory materials
                        </p>
                    </div>

                    <button
                        onClick={onCloses}
                        className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg ${
                            show
                                ? 'bg-gray-600 hover:bg-gray-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {show ? "✕ Cancel" : "+ Add New Material"}
                    </button>

                </div>

                {/* SEARCH */}

                <div className="mb-6">

                    <input
                        type="text"
                        placeholder="🔍 Search materials..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                </div>

                {/* FORM */}

                {show && (

                    <div className="bg-white rounded-xl shadow-2xl p-8 mb-8 border-t-4 border-blue-500">

                        <h2 className="text-2xl font-bold text-gray-800 mb-6">

                            {editIndex !== null ? '✏️ Edit Material' : '➕ Add New Material'}

                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Material Name"
                                className="p-3 border rounded-lg"
                            />

                            <input
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                type="number"
                                placeholder="Quantity"
                                className="p-3 border rounded-lg"
                            />

                            <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="p-3 border rounded-lg"
                            >

                                <option value="">Select Unit</option>
                                <option value="kg">Kilogram (kg)</option>
                                <option value="g">Grams (g)</option>
                                <option value="L">Liter (L)</option>
                                <option value="pcs">Pieces (pcs)</option>

                            </select>

                            <input
                                value={stocklevel}
                                onChange={(e) => setStock(e.target.value)}
                                type="number"
                                placeholder="Minimum Stock"
                                className="p-3 border rounded-lg"
                            />

                        </div>

                        <div className="flex gap-4 justify-end mt-8">

                            <button
                                onClick={handleAdd}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            >

                                {editIndex !== null ? 'Update Material' : 'Add Material'}

                            </button>

                            <button
                                onClick={onCancel}
                                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                )}

                {/* TABLE */}

                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-800 text-white">

                            <tr>
                                <th className="py-3">Material</th>
                                <th className="py-3">Quantity</th>
                                <th className="py-3">Unit</th>
                                <th className="py-3">Minimum Stock</th>
                                <th className="py-3">Status</th>
                                <th className="py-3">Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {filteredMaterials.length > 0 ? (

                                filteredMaterials.map((items, index) => (

                                    <tr key={index} className="text-center border-b">

                                        <td className="py-3">{items.item}</td>
                                        <td>{items.quantity}</td>
                                        <td>{items.unit}</td>
                                        <td>{items.minStock}</td>

                                        <td>

                                            <span
                                                className={handleStockColor(
                                                    items.quantity,
                                                    items.minStock
                                                )}
                                            >
                                                {getStockStatus(
                                                    items.quantity,
                                                    items.minStock
                                                )}
                                            </span>

                                        </td>

                                        <td>

                                            <button
                                                onClick={() => onEdit(index)}
                                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded mr-2"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => onDelete(index)}
                                                className="bg-red-100 text-red-700 px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="6" className="py-8 text-gray-500">

                                        {material.length === 0
                                            ? "No materials added yet"
                                            : "No materials match your search"}

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    )
}