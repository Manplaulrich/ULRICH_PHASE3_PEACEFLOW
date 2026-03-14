import NavbarStaff from "./NavbarStaff"
import { useContext, useState } from "react"
import { RawMaterialContext } from '../itemContext/RawMaterialContext'
import { Package, Search, X, AlertTriangle, CheckCircle } from "lucide-react"

export default function RawMaterialStaff() {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchFocused, setSearchFocused] = useState(false)

    const { material } = useContext(RawMaterialContext)

    //////////////////////////////////////////////////////
    // STATUS COLOR - Keeping original green/red
    //////////////////////////////////////////////////////

    const handleStockColor = (quantity, minStock) => {
        return Number(quantity) <= Number(minStock)
            ? "text-red-700 bg-red-100 font-semibold px-4 py-2 rounded-full text-sm"
            : "text-green-700 bg-green-100 font-semibold px-4 py-2 rounded-full text-sm"
    }

    //////////////////////////////////////////////////////
    // STATUS TEXT
    //////////////////////////////////////////////////////

    const getStockStatus = (quantity, minStock) => {
        return Number(quantity) <= Number(minStock) ? "Low Stock" : "In Stock"
    }

    //////////////////////////////////////////////////////
    // SEARCH FILTER
    //////////////////////////////////////////////////////

    const filteredMaterials = material.filter(item =>
        item.item.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Low stock count for summary
    const lowStockCount = material.filter(
        item => Number(item.quantity) <= Number(item.minStock)
    ).length

    return (
        <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50">
            <NavbarStaff />
            
            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
                
                {/* HEADER WITH STATS - Updated to amber */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-bold bg-linear-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent flex items-center gap-3">
                                Raw Materials Inventory
                            </h1>
                            <p className="text-amber-600 mt-2 text-lg">
                                View available materials and stock levels
                            </p>
                        </div>
                        
                        {/* Quick Stats - Updated to amber theme */}
                        <div className="flex gap-4">
                            <div className="bg-white rounded-xl shadow-md px-6 py-3 border border-amber-200">
                                <p className="text-sm text-amber-600">Total Materials</p>
                                <p className="text-2xl font-bold text-amber-800">{material.length}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md px-6 py-3 border border-amber-200">
                                <p className="text-sm text-amber-600">Low Stock Items</p>
                                <p className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {lowStockCount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ENHANCED SEARCH BAR - Updated to amber */}
                <div className="mb-8">
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
                            <Search className="w-6 h-6" />
                        </div>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-amber-300 hover:text-amber-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
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

                {/* LOW STOCK ALERT BANNER - Keeping amber theme with red accent */}
                {lowStockCount > 0 && (
                    <div className="mb-6 p-4 bg-amber-50 border-l-4 border-red-500 rounded-r-xl shadow-md animate-pulse">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="text-red-500" size={24} />
                            <div>
                                <p className="font-semibold text-amber-800">Low Stock Alert</p>
                                <p className="text-sm text-amber-700">
                                    {lowStockCount} {lowStockCount === 1 ? 'item' : 'items'} are below minimum stock level
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* MATERIALS TABLE - VIEW ONLY - Updated to amber */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-amber-200">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-linear-to-r from-amber-700 to-amber-600 text-white">
                                <th className="py-5 px-6 text-left text-sm font-semibold uppercase tracking-wider">Material</th>
                                <th className="py-5 px-6 text-left text-sm font-semibold uppercase tracking-wider">Quantity</th>
                                <th className="py-5 px-6 text-left text-sm font-semibold uppercase tracking-wider">Unit</th>
                                <th className="py-5 px-6 text-left text-sm font-semibold uppercase tracking-wider">Min Stock</th>
                                <th className="py-5 px-6 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-amber-100">
                            {filteredMaterials.length > 0 ? (
                                filteredMaterials.map((items, index) => {
                                    const isLowStock = Number(items.quantity) <= Number(items.minStock)
                                    
                                    return (
                                        <tr 
                                            key={index} 
                                            className={`hover:bg-amber-50 transition-all duration-300 group
                                                ${isLowStock ? 'bg-red-50/30' : ''}`}
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
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Package className="w-16 h-16 text-amber-300 mb-4" />
                                            <p className="text-amber-600 text-xl mb-2">
                                                {material.length === 0 
                                                    ? "No materials available" 
                                                    : `No materials match "${searchTerm}"`}
                                            </p>
                                            {material.length === 0 ? (
                                                <p className="text-amber-500 text-sm">
                                                    Materials will appear here once added by admin
                                                </p>
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

                    {/* Table Footer with Summary - Updated to amber */}
                    {filteredMaterials.length > 0 && (
                        <div className="px-6 py-4 bg-amber-50 border-t border-amber-200">
                            <div className="flex flex-wrap justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-amber-700">In Stock</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <span className="text-sm text-amber-700">Low Stock</span>
                                    </div>
                                </div>
                                <div className="text-sm text-amber-600">
                                    Showing {filteredMaterials.length} of {material.length} materials
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* INFO CARD - Updated to amber theme */}
                {/* <div className="mt-8 bg-amber-50 rounded-xl p-6 border border-amber-200">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-amber-100 rounded-lg">
                            <CheckCircle className="text-amber-600" size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-amber-800 text-lg mb-1">View-Only Access</h3>
                            <p className="text-amber-600">
                                You're currently in view-only mode. Materials are managed by administrators. 
                                If you notice any discrepancies or need to request new materials, please contact your supervisor.
                            </p>
                        </div>
                    </div>
                </div> */}
            </div>

            {/* Custom Scrollbar Styles - Updated to amber */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #fef3c7;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #f59e0b;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d97706;
                }
            `}</style>
        </div>
    )
}