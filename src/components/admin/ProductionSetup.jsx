import { useContext, useState } from "react";
import { RawMaterialContext } from "../itemContext/RawMaterialContext";
import Navbar from "./Navbar";

export default function ProductionSetup() {
  const [showForm, setShowForm] = useState(false);
  const { recipe, material, loading, createRecipe, updateRecipe, deleteRecipe } = useContext(RawMaterialContext);
  
  const [name, setName] = useState('');
  const [rawMaterial, setRawMaterial] = useState("");
  const [output, setOutput] = useState("");
  const [quantity, setQuantity] = useState("");
  const [materialsList, setMaterialsList] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Compute filtered recipes directly
  const filteredRecipes = recipe.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.materials?.some(mat => 
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
    setEditingRecipe(null);
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
          items: rawMaterial,
          quant: parseFloat(quantity),
          units: selectedMaterial?.unit || 'units'
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
  const saveRecipe = async () => {
    if (!name || !output || materialsList.length === 0) {
      alert("Please fill in all fields and add at least one material");
      return;
    }

    setIsSubmitting(true);

    const recipeData = {
      name,
      output: parseFloat(output),
      materials: materialsList
    };

    let result;
    if (editingRecipe) {
      result = await updateRecipe(editingRecipe.id, recipeData);
    } else {
      result = await createRecipe(recipeData);
    }

    if (result.success) {
      resetForm();
      setShowForm(false);
    } else {
      alert(`Error: ${result.error}`);
    }

    setIsSubmitting(false);
  };

  ////////////////////////////////////////////////////////
  //// DELETE RECIPE
  ////////////////////////////////////////////////////////
  const onDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      const result = await deleteRecipe(id);
      if (!result.success) {
        alert(`Error: ${result.error}`);
      }
    }
  };

  ////////////////////////////////////////////////////////
  //// EDIT RECIPE
  ////////////////////////////////////////////////////////
  const onEdit = (recipe) => {
    setName(recipe.name);
    setOutput(recipe.output);
    setMaterialsList(recipe.materials || []);
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  ////////////////////////////////////////////////////////
  //// UI
  ////////////////////////////////////////////////////////
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-amber-600 text-xl">Loading recipes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-orange-50">
      <Navbar />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* HEADER WITH SEARCH */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-4xl font-bold bg-linear-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent">
              Production Setup
            </h1>
            
            <button
              onClick={toggleForm}
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                showForm
                  ? "bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
                  : "bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                className="w-full px-6 py-4 pl-14 bg-white/80 backdrop-blur-sm border-2 border-amber-200 rounded-2xl shadow-lg focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all duration-300 text-gray-700 placeholder-amber-300"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-300 hover:text-amber-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Search results count */}
            {searchTerm && (
              <div className="absolute -bottom-6 left-4 text-sm text-amber-500">
                Found {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
              </div>
            )}
          </div>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-10 border border-amber-200 transform transition-all duration-500 animate-fadeIn">
            <h2 className="text-2xl font-bold bg-linear-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent mb-6">
              {editingRecipe ? " Edit Recipe" : " Create New Recipe"}
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="group">
                <label className="block text-sm font-semibold text-amber-700 mb-2 group-focus-within:text-amber-600 transition-colors">
                  Recipe Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all duration-300 group-hover:border-amber-300"
                  placeholder="e.g., Chocolate Cake"
                  disabled={isSubmitting}
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-amber-700 mb-2 group-focus-within:text-amber-600 transition-colors">
                  Output Quantity
                </label>
                <input
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  type="number"
                  step="0.01"
                  className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all duration-300 group-hover:border-amber-300"
                  placeholder="e.g., 10"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* MATERIAL INPUT */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-amber-700 mb-2">
                Add Materials
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                <select
                  value={rawMaterial}
                  onChange={(e) => setRawMaterial(e.target.value)}
                  className="border-2 border-amber-200 rounded-xl px-4 py-3 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all duration-300"
                  disabled={isSubmitting}
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
                  step="0.01"
                  className="border-2 border-amber-200 rounded-xl px-4 py-3 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all duration-300"
                  placeholder="Quantity"
                  disabled={isSubmitting}
                />

                <button
                  onClick={addMaterial}
                  disabled={!rawMaterial || !quantity || isSubmitting}
                  className={`rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    rawMaterial && quantity && !isSubmitting
                      ? "bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg"
                      : "bg-amber-200 text-amber-400 cursor-not-allowed"
                  }`}
                >
                  + Add Material
                </button>
              </div>
            </div>

            {/* MATERIAL LIST */}
            {materialsList.length > 0 && (
              <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-6 mb-6 border border-amber-200">
                <h3 className="text-sm font-semibold text-amber-700 mb-3">Materials List:</h3>
                <div className="space-y-2">
                  {materialsList.map((mat, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group border border-amber-100"
                    >
                      <span className="text-amber-800">
                        <span className="font-medium">{mat.items}:</span> {mat.quant} {mat.units}
                      </span>
                      <button
                        onClick={() => removeMaterial(index)}
                        className="text-red-400 hover:text-red-600 transition-colors duration-300 opacity-0 group-hover:opacity-100"
                        disabled={isSubmitting}
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
                disabled={isSubmitting}
                className="px-8 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : (editingRecipe ? " Update Recipe" : " Create Recipe")}
              </button>
            </div>
          </div>
        )}

        {/* RECIPES GRID */}
        {filteredRecipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredRecipes.map((item) => {
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-amber-100 overflow-hidden"
                >
                  <div className="p-6 bg-linear-to-br from-white to-amber-50">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-bold text-amber-800 group-hover:text-amber-600 transition-colors duration-300">
                        {item.name}
                      </h2>
                      <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-xs font-semibold">
                        Recipe
                      </span>
                    </div>
                    
                    <div className="mb-4 p-3 bg-amber-500 rounded-lg text-white">
                      <p className="text-sm opacity-90">Output:</p>
                      <p className="text-2xl font-bold">{item.output}</p>
                    </div>
                    
                    <h3 className="text-sm font-semibold text-amber-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Materials
                    </h3>
                    
                    <ul className="space-y-2">
                      {item.materials?.map((mat, i) => (
                        <li key={i} className="text-sm bg-white p-2 rounded-lg shadow-sm border border-amber-100">
                          <span className="font-medium text-amber-600">{mat.items}:</span>
                          <span className="text-amber-800 ml-2">{mat.quant} {mat.units}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CARD FOOTER */}
                  <div className="flex justify-between p-4 bg-amber-50 border-t border-amber-100">
                    <button
                      onClick={() => onEdit(item)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 text-sm font-semibold shadow-md flex items-center gap-1"
                      disabled={isSubmitting}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 text-sm font-semibold shadow-md flex items-center gap-1"
                      disabled={isSubmitting}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 mt-8">
            {searchTerm ? (
              <>
                <p className="text-amber-600 text-lg mb-2">No recipes found matching "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-amber-500 hover:text-amber-600 font-semibold transition-colors"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <p className="text-amber-600 text-lg mb-2">No recipes created yet</p>
                <button
                  onClick={toggleForm}
                  className="text-amber-500 hover:text-amber-600 font-semibold transition-colors"
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