import NavbarStaff from "./NavbarStaff"
import { useContext, useState, useCallback, useEffect } from "react"
import { RawMaterialContext } from "../itemContext/RawMaterialContext"
import { 
  Package, AlertTriangle, Factory, ClipboardList, Target, 
  Calendar, X, TrendingUp, Clock, CheckCircle, 
  Award, BarChart3, Eye, Info
} from "lucide-react"

export default function DashboardStaff() {
  const { material, recipe, setMaterial, productionHistory, setProductionHistory } = useContext(RawMaterialContext)

  // Form states
  const [selectedRecipe, setSelectedRecipe] = useState("")
  const [actualProduced, setActualProduced] = useState("")
  
  // Goals state - view only
  const [goals, setGoals] = useState([])
  
  // Production form visibility
  const [showProductionForm, setShowProductionForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [showGoalDetails, setShowGoalDetails] = useState(false)

  // Get today's date for filtering
  const today = new Date().toLocaleDateString()

  // Load goals from localStorage on component mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('productionGoals')
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }

    // Listen for goal updates from admin
    const handleStorageChange = () => {
      const updatedGoals = localStorage.getItem('productionGoals')
      if (updatedGoals) {
        setGoals(JSON.parse(updatedGoals))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Calculate today's production total
  const todayProduction = productionHistory
    .filter(p => p.date === today)
    .reduce((sum, p) => sum + p.quantity, 0)

  // Calculate production by recipe for today
  const todayProductionByRecipe = productionHistory
    .filter(p => p.date === today)
    .reduce((acc, p) => {
      acc[p.recipe] = (acc[p.recipe] || 0) + p.quantity
      return acc
    }, {})

  // Low stock count
  const lowStockCount = material.filter(
    item => Number(item.quantity) <= Number(item.minStock)
  ).length

  // Low stock alert component - updated with amber theme
  const LowStockAlert = () => {
    const lowStockItems = material.filter(
      item => Number(item.quantity) <= Number(item.minStock)
    )

    if (lowStockItems.length === 0) {
      return (
        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200 transition-all duration-300 hover:shadow-md">
          <CheckCircle size={24} className="text-amber-500 shrink-0" />
          <p className="text-amber-700 font-medium text-base">
            ✓ All materials are above minimum stock levels
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {lowStockItems.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200 hover:bg-amber-100 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            <AlertTriangle size={22} className="text-amber-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-amber-800 text-base">{item.item}</span>
              <span className="text-amber-600 ml-2 text-sm">
                {item.quantity} {item.unit} / Min: {item.minStock} {item.unit}
              </span>
            </div>
            <span className="px-3 py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-semibold whitespace-nowrap">
              {Math.abs(item.quantity - item.minStock)} below min
            </span>
          </div>
        ))}
      </div>
    )
  }

  // View goal details
  const handleViewGoal = (goal) => {
    setSelectedGoal(goal)
    setShowGoalDetails(true)
  }

  // End production
  const handleEndProduction = useCallback(async () => {
    if (!selectedRecipe || !actualProduced) {
      alert("Please select a recipe and enter production quantity")
      return
    }

    setIsSubmitting(true)

    try {
      const produced = Number(actualProduced)
      const recipeData = recipe.find(r => r.name === selectedRecipe)
      
      if (!recipeData) {
        alert("Recipe not found")
        return
      }

      // Check against all relevant goals
      const relevantGoal = goals.find(g => g.recipe === selectedRecipe)
      if (relevantGoal) {
        const totalProducedToday = todayProductionByRecipe[selectedRecipe] || 0
        
        if (totalProducedToday + produced > relevantGoal.quantity) {
          alert(
            `Total production (${totalProducedToday + produced}) would exceed daily goal ` +
            `of ${relevantGoal.quantity} for ${selectedRecipe}`
          )
          setIsSubmitting(false)
          return
        }
      }

      // Calculate material requirements
      const materialRequirements = recipeData.materials.map(mat => {
        const stock = material.find(m => m.item === mat.items)
        const required = mat.quant * produced
        
        return {
          item: mat.items,
          required,
          available: stock ? Number(stock.quantity) : 0,
          unit: stock ? stock.unit : 'units'
        }
      })

      // Check if enough materials are available
      const insufficientMaterials = materialRequirements.filter(
        req => req.required > req.available
      )

      if (insufficientMaterials.length > 0) {
        alert(
          "Insufficient materials for production:\n" + 
          insufficientMaterials.map(m => 
            `${m.item}: Need ${m.required} ${m.unit}, Available ${m.available} ${m.unit}`
          ).join('\n')
        )
        setIsSubmitting(false)
        return
      }

      // Prepare used materials array
      const usedMaterials = recipeData.materials.map(mat => ({
        item: mat.items,
        used: mat.quant * produced,
        unit: material.find(m => m.item === mat.items)?.unit || 'units'
      }))

      // Update material quantities
      setMaterial(prev => prev.map(mat => {
        const requirement = materialRequirements.find(req => req.item === mat.item)
        if (requirement) {
          return {
            ...mat,
            quantity: Number(mat.quantity) - requirement.required
          }
        }
        return mat
      }))

      // Check if there's already a production entry for this recipe today
      const existingEntryIndex = productionHistory.findIndex(
        p => p.recipe === selectedRecipe && p.date === today
      )

      let updatedHistory

      if (existingEntryIndex !== -1) {
        // Update existing entry
        const existingEntry = productionHistory[existingEntryIndex]
        const updatedEntry = {
          ...existingEntry,
          quantity: existingEntry.quantity + produced,
          materials: mergeMaterials(existingEntry.materials, usedMaterials),
          timestamp: new Date().toISOString()
        }

        updatedHistory = [
          updatedEntry,
          ...productionHistory.slice(0, existingEntryIndex),
          ...productionHistory.slice(existingEntryIndex + 1)
        ]
      } else {
        // Create new entry
        const newHistory = {
          id: Date.now(),
          recipe: selectedRecipe,
          quantity: produced,
          materials: usedMaterials,
          date: today,
          timestamp: new Date().toISOString()
        }
        updatedHistory = [newHistory, ...productionHistory]
      }

      // Update production history
      setProductionHistory(updatedHistory)

      // Reset form
      setSelectedRecipe("")
      setActualProduced("")
      setShowProductionForm(false)
      
    } catch (error) {
      console.error("Production error:", error)
      alert("An error occurred while recording production")
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedRecipe, actualProduced, goals, recipe, material, setMaterial, productionHistory, setProductionHistory, today, todayProductionByRecipe])

  // Helper function to merge materials from two production entries
  const mergeMaterials = (existingMaterials, newMaterials) => {
    const merged = [...existingMaterials]
    
    newMaterials.forEach(newMat => {
      const existingIndex = merged.findIndex(m => m.item === newMat.item)
      if (existingIndex !== -1) {
        // Update existing material
        merged[existingIndex] = {
          ...merged[existingIndex],
          used: merged[existingIndex].used + newMat.used
        }
      } else {
        // Add new material
        merged.push(newMat)
      }
    })
    
    return merged
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50">
      <NavbarStaff />
      
      <div className="px-4 sm:px-6 lg:px-8 py-24 max-w-7xl mx-auto">
        
        {/* Header Section - Updated to amber */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-linear-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent flex items-center gap-3">
              Staff Production Dashboard
            </h1>
            <p className="text-amber-600 mt-2 text-base sm:text-lg">
              View daily goals and record production
            </p>
          </div>
          
          <button
            onClick={() => setShowProductionForm(!showProductionForm)}
            className={`
              group w-full md:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-white 
              transition-all duration-500 transform hover:scale-105 
              shadow-lg hover:shadow-xl flex items-center justify-center gap-3
              text-sm sm:text-base
              ${showProductionForm 
                ? 'bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800' 
                : 'bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
              }
            `}
          >
            {showProductionForm ? (
              <>
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                <span>Close</span>
              </>
            ) : (
              <>
                <span>Record Production</span>
              </>
            )}
          </button>
        </div>

        {/* Production Form Section - Updated to amber */}
        <div className={`
          transition-all duration-700 ease-in-out overflow-hidden
          ${showProductionForm ? 'max-h-200 opacity-100 mb-8' : 'max-h-0 opacity-0'}
        `}>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-amber-200">
            <h2 className="text-xl sm:text-2xl font-semibold text-amber-800 mb-6 flex items-center gap-2">
              Record Production
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              
              {/* Goals Overview Card - View Only - Updated to amber */}
              <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-4 sm:p-6 border border-amber-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-amber-800 flex items-center gap-2">
                    <Award size={20} className="text-amber-500" />
                    Today's Production Goals
                  </h3>
                  <span className="text-xs text-amber-600 bg-white px-3 py-1.5 rounded-full border border-amber-200">
                    View Only
                  </span>
                </div>

                {/* Goals List - View Only */}
                <div className="space-y-4 max-h-112.5 overflow-y-auto pr-2 custom-scrollbar">
                  {goals.length > 0 ? (
                    goals.map((goal) => {
                      const produced = todayProductionByRecipe[goal.recipe] || 0
                      const progress = (produced / goal.quantity) * 100
                      
                      return (
                        <div 
                          key={goal.id} 
                          className="bg-white rounded-xl p-4 shadow-sm border border-amber-100 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                            <div>
                              <h4 className="font-semibold text-amber-800 text-base">{goal.recipe}</h4>
                              <p className="text-sm text-amber-600">Target: {goal.quantity} units</p>
                            </div>
                            <button
                              onClick={() => handleViewGoal(goal)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-all duration-300 text-xs"
                            >
                              <Eye size={14} />
                              View Details
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-amber-600">Progress</span>
                              <span className="font-medium text-amber-800">
                                {produced} / {goal.quantity} ({progress.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden">
                              <div 
                                className={`h-3 rounded-full transition-all duration-500 ${
                                  progress >= 100 
                                    ? 'bg-linear-to-r from-amber-500 to-amber-600' 
                                    : 'bg-linear-to-r from-amber-400 to-amber-500'
                                }`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-12">
                      <Target size={56} className="text-amber-300 mx-auto mb-4" />
                      <p className="text-amber-600 text-base">No goals set for today</p>
                      <p className="text-amber-400 text-sm mt-2">Check back later for production targets</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Record Production Card - Updated to amber */}
              <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-4 sm:p-6 border border-amber-200">
                <h3 className="text-base sm:text-lg font-semibold text-amber-800 mb-6 flex items-center gap-2">
                  <Calendar size={20} className="text-amber-500" />
                  Record Production
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-amber-700">
                      Select Recipe
                    </label>
                    <select
                      className="w-full p-3 sm:p-4 border-2 border-amber-200 rounded-xl 
                               focus:border-amber-400 focus:ring-4 focus:ring-amber-100 
                               outline-none transition-all duration-300 bg-white
                               hover:border-amber-300 text-sm"
                      value={selectedRecipe}
                      onChange={(e) => setSelectedRecipe(e.target.value)}
                    >
                      <option value="">Choose a recipe...</option>
                      {recipe.map((r, i) => (
                        <option key={i} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-amber-700">
                      Quantity Produced
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Enter actual quantity"
                      className="w-full p-3 sm:p-4 border-2 border-amber-200 rounded-xl 
                               focus:border-amber-400 focus:ring-4 focus:ring-amber-100 
                               outline-none transition-all duration-300
                               hover:border-amber-300 text-sm"
                      value={actualProduced}
                      onChange={(e) => setActualProduced(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleEndProduction}
                    disabled={!selectedRecipe || !actualProduced || isSubmitting}
                    className={`
                      w-full py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 
                      transform hover:scale-[1.02] active:scale-[0.98]
                      flex items-center justify-center gap-2 text-sm sm:text-base
                      ${selectedRecipe && actualProduced && !isSubmitting
                        ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Recording...</span>
                      </>
                    ) : (
                      'Save Production Record'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Updated to amber/white/gray */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm mb-1">Total Materials</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{material.length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Package className="text-amber-500" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm mb-1">Low Stock Items</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{lowStockCount}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm mb-1">Active Goals</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{goals.length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Target className="text-amber-500" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm mb-1">Today's Production</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{todayProduction}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Factory className="text-amber-500" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alert Section */}
        <div className="bg-white mt-8 rounded-xl shadow-lg overflow-hidden border border-amber-200">
          <div className="px-4 sm:px-6 py-4 bg-linear-to-r from-amber-100 to-orange-100 border-b border-amber-200">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-amber-800">
              <AlertTriangle className="text-amber-500" size={24} />
              Low Stock Alerts
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <LowStockAlert />
          </div>
        </div>

        {/* Production History Table - Updated to amber/gray */}
        <div className="bg-white mt-8 rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-4 sm:px-6 py-4 bg-linear-to-r from-gray-100 to-gray-200 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-800">
              <ClipboardList className="text-amber-500" size={24} />
              Daily Production Log
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-200">
              <thead>
                <tr className="bg-linear-to-r from-amber-700 to-amber-600 text-white">
                  <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Recipe</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Quantity</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Materials Used</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productionHistory.length > 0 ? (
                  productionHistory.map((p, index) => (
                    <tr 
                      key={p.id || index} 
                      className={`
                        hover:bg-amber-50 transition-colors duration-300
                        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      `}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <span className="font-semibold text-gray-800 text-sm sm:text-base">{p.recipe}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                          {p.quantity} units
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {p.materials && p.materials.map((m, i) => (
                            <div 
                              key={`${p.id}-${i}`} 
                              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200"
                            >
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                              <span className="text-xs sm:text-sm text-gray-600">{m.item}:</span>
                              <span className="text-xs sm:text-sm font-semibold text-gray-800">
                                {m.used}{m.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg text-xs sm:text-sm whitespace-nowrap">
                          {p.date}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 sm:px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <ClipboardList size={64} className="text-gray-300" />
                        <p className="text-gray-500 text-base sm:text-lg font-medium">No production records yet</p>
                        <p className="text-gray-400 text-sm">Complete end of day production to see records here</p>
                        {!showProductionForm && (
                          <button
                            onClick={() => setShowProductionForm(true)}
                            className="mt-4 px-6 sm:px-8 py-3 bg-linear-to-r from-amber-500 to-amber-600 
                                     text-white rounded-xl font-semibold text-sm sm:text-base
                                     hover:from-amber-600 hover:to-amber-700 
                                     transition-all duration-300 transform hover:scale-105
                                     shadow-lg hover:shadow-xl"
                          >
                            Record Production
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          {productionHistory.length > 0 && (
            <div className="px-4 sm:px-6 py-4 bg-linear-to-r from-gray-100 to-gray-200 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-gray-600 font-medium flex items-center gap-2 text-sm">
                  <BarChart3 size={16} className="text-gray-400" />
                  Total Records: {productionHistory.length}
                </span>
                <span className="text-gray-600 font-medium flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-gray-400" />
                  Last Updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Goal Details Modal - Updated to amber */}
      {showGoalDetails && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-linear-to-r from-amber-700 to-amber-500 p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Goal Details</h2>
              <p className="text-amber-100 text-sm mt-1">{selectedGoal.recipe}</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Target Quantity</p>
                  <p className="text-2xl font-bold text-gray-800">{selectedGoal.quantity} units</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Produced Today</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {todayProductionByRecipe[selectedGoal.recipe] || 0} units
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-amber-700">
                    {((todayProductionByRecipe[selectedGoal.recipe] || 0) / selectedGoal.quantity * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-4 rounded-full bg-linear-to-r from-amber-400 to-amber-500 transition-all duration-500"
                    style={{ width: `${Math.min(((todayProductionByRecipe[selectedGoal.recipe] || 0) / selectedGoal.quantity) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Material Requirements */}
              {selectedGoal.requirements && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Info size={18} className="text-amber-500" />
                    Material Requirements
                  </h3>
                  <div className="space-y-3">
                    {selectedGoal.requirements.map((req, idx) => (
                      <div key={idx} className="p-4 bg-gray-100 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-800">{req.item}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            req.sufficient ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {req.sufficient ? 'Sufficient' : 'Insufficient'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Required:</span>
                            <span className="ml-1 font-medium text-gray-800">{req.totalRequired} {req.unit}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Available:</span>
                            <span className="ml-1 font-medium text-gray-800">{req.available} {req.unit}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className={`p-4 rounded-xl ${
                selectedGoal.canComplete ? 'bg-amber-50' : 'bg-red-50'
              }`}>
                <p className={`text-sm font-medium flex items-center gap-2 ${
                  selectedGoal.canComplete ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {selectedGoal.canComplete ? (
                    <>
                      <CheckCircle size={18} />
                      Goal is achievable with current stock
                    </>
                  ) : (
                    <>
                      <AlertCircle size={18} />
                      Insufficient materials to complete goal
                    </>
                  )}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowGoalDetails(false)}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles - Updated scrollbar to amber */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
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