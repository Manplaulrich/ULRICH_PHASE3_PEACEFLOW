import { useContext, useState} from "react";
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
  const [editIndex, setEditIndex] = useState(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Compute filtered recipes directly
  const filteredRecipes = recipe.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.materials.some(mat => 
      mat.items.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    item.output.toString().includes(searchTerm)
  );

  ////////////////////////////////////////////////////////
  //// TOGGLE FORM
  ////////////////////////////////////////////////////////
  const toggleForm = () => {
    setShowForm(!showForm);
    if(showForm) {
      resetForm();
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
    if(rawMaterial && quantity) {
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

    if(editIndex !== null) {
      const updated = [...recipe];
      updated[editIndex] = {
        ...updated[editIndex],
        name,
        output,
        materials: formattedMaterials
      };
      setRecipe(updated);
    } else {
      setRecipe((prev) => [
        ...prev,
        {
          id: Date.now(),
          name,
          output,
          materials: formattedMaterials
        }
      ]);
    }

    resetForm();
    setShowForm(false);
  };

  ////////////////////////////////////////////////////////
  //// DELETE RECIPE
  ////////////////////////////////////////////////////////
  const onDelete = (index) => {
    const newRecipe = recipe.filter((_,i) => i !== index);
    setRecipe(newRecipe);
  };

  ////////////////////////////////////////////////////////
  //// EDIT RECIPE
  ////////////////////////////////////////////////////////
  const onEdit = (index) => {
    const selected = recipe[index];
    setName(selected.name);
    setOutput(selected.output);
    setMaterialsList(
      selected.materials.map(m => ({
        item: m.items,
        quantity: m.quant,
        unit: m.units
      }))
    );
    setEditIndex(index);
    setShowForm(true);
  };

  ////////////////////////////////////////////////////////
  //// UI
  ////////////////////////////////////////////////////////
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* HEADER WITH SEARCH */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Production Setup
            </h1>
            
            <button
              onClick={toggleForm}
              className={`px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                showForm
                  ? "bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  : "bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              }`}
            >
              {showForm ? "✕ Cancel" : "+ Create New Recipe"}
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="relative">
            <div className={`relative transition-all duration-300 ${searchFocused ? 'transform scale-105' : ''}`}>
              <input
                type="text"
                placeholder=" Search recipes by name, ingredients, or output..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full px-6 py-4 pl-14 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Search results count */}
            {searchTerm && (
              <div className="absolute -bottom-6 left-4 text-sm text-gray-500">
                Found {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
              </div>
            )}
          </div>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-10 border border-indigo-100 transform transition-all duration-500 animate-fadeIn">
            <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              {editIndex !== null ? " Edit Recipe" : " Create New Recipe"}
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                  Recipe Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 group-hover:border-indigo-200"
                  placeholder="e.g., Chocolate Cake"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">
                  Output Quantity
                </label>
                <input
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  type="number"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 group-hover:border-indigo-200"
                  placeholder="e.g., 10"
                />
              </div>
            </div>

            {/* MATERIAL INPUT */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Add Materials
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                <select
                  value={rawMaterial}
                  onChange={(e) => setRawMaterial(e.target.value)}
                  className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300"
                >
                  <option value="">Select Material</option>
                  {material.map((mat, index) => (
                    <option key={index} value={mat.item}>
                      {mat.item} ({mat.unit})
                    </option>
                  ))}
                </select>

                <input
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  type="number"
                  className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300"
                  placeholder="Quantity"
                />

                <button
                  onClick={addMaterial}
                  disabled={!rawMaterial || !quantity}
                  className={`rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    rawMaterial && quantity
                      ? "bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  + Add Material
                </button>
              </div>
            </div>

            {/* MATERIAL LIST */}
            {materialsList.length > 0 && (
              <div className="bg-linear-to-br from-gray-50 to-indigo-50 rounded-xl p-6 mb-6 border border-indigo-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Materials List:</h3>
                <div className="space-y-2">
                  {materialsList.map((mat, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group"
                    >
                      <span className="text-gray-700">
                        <span className="font-medium">{mat.item}:</span> {mat.quantity} {mat.unit}
                      </span>
                      <button
                        onClick={() => removeMaterial(index)}
                        className="text-red-400 hover:text-red-600 transition-colors duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={saveRecipe}
                className="px-8 py-3 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {editIndex !== null ? " Update Recipe" : " Create Recipe"}
              </button>
            </div>
          </div>
        )}

        {/* RECIPES GRID */}
        {filteredRecipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredRecipes.map((item, index) => {
              // Find the original index for edit/delete functions
              const originalIndex = recipe.findIndex(r => r.id === item.id);
              
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  <div className="p-6 bg-linear-to-br from-white to-indigo-50/30">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                        {item.name}
                      </h2>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-semibold">
                        Recipe
                      </span>
                    </div>
                    
                    <div className="mb-4 p-3 bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg text-white">
                      <p className="text-sm opacity-90">Output:</p>
                      <p className="text-2xl font-bold">{item.output}</p>
                    </div>
                    
                    <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Materials
                    </h3>
                    
                    <ul className="space-y-2">
                      {item.materials.map((mat, i) => (
                        <li key={i} className="text-sm bg-white/80 p-2 rounded-lg shadow-sm border border-indigo-50">
                          <span className="font-medium text-indigo-600">{mat.items}:</span>
                          <span className="text-gray-600 ml-2">{mat.quant} {mat.units}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CARD FOOTER */}
                  <div className="flex justify-between p-4 bg-gray-50 border-t border-gray-100">
                    <button
                      onClick={() => onEdit(originalIndex)}
                      className="px-4 py-2 bg-linear-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 text-sm font-semibold shadow-md"
                    >
                       Edit
                    </button>
                    <button
                      onClick={() => onDelete(originalIndex)}
                      className="px-4 py-2 bg-linear-to-r from-red-400 to-red-500 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105 text-sm font-semibold shadow-md"
                    >
                       Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 mt-8">
            {searchTerm ? (
              <>
                <p className="text-gray-500 text-lg mb-2">No recipes found matching "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-500 text-lg mb-2">No recipes created yet</p>
                <button
                  onClick={toggleForm}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                >
                  Create your first recipe
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}