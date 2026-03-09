import Navbar from "./Navbar"
import { useContext, useState } from "react"
import { RawMaterialContext } from "../itemContext/RawMaterialContext"
import { Package, AlertTriangle, Factory, ClipboardList, Target, Calendar, ChevronRight } from "lucide-react"

export default function Dashboard() {

const { material, recipe, setMaterial,productionHistory,setProductionHistory } = useContext(RawMaterialContext)

const [selectedRecipe,setSelectedRecipe]=useState("")
const [actualProduced,setActualProduced]=useState("")

// State for goal
const [dailyGoal, setDailyGoal] = useState("")
const [goalSet, setGoalSet] = useState(false)
const [goalDetails, setGoalDetails] = useState(null)

//////////////////////////////////////////////////
// LOW STOCK COUNT
//////////////////////////////////////////////////

const handledLowStock=()=>{
return material.filter(
item=>Number(item.quantity)<=Number(item.minStock)
).length
}

//////////////////////////////////////////////////
// LOW STOCK ALERT
//////////////////////////////////////////////////

const handledAlert=()=>{

const newarray=material.filter(
item=>Number(item.quantity)<=Number(item.minStock)
)

if(newarray.length===0){
return <p className="text-green-600">✓ All materials are above minimum stock levels</p>
}

return newarray.map((items,index)=>(
<div key={index} className="flex items-center gap-2 py-1 border-b border-amber-200 last:border-0">
  <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
  <span className="text-amber-800">
    <span className="font-medium">{items.item}</span>: {items.quantity} {items.unit} | Min: {items.minStock} {items.unit}
  </span>
</div>
))
}

//////////////////////////////////////////////////
// SET DAILY GOAL
//////////////////////////////////////////////////

const handleSetGoal = () => {
  if (!selectedRecipe || !dailyGoal) {
    alert("Please select a recipe and set a daily goal")
    return
  }

  const recipeData = recipe.find(r => r.name === selectedRecipe)
  if (!recipeData) return

  const requirements = []
  let canComplete = true

  recipeData.materials.forEach(mat => {
    const stock = material.find(m => m.item === mat.items)
    const required = mat.quant * Number(dailyGoal)
    const available = stock ? stock.quantity : 0
    const needed = Math.max(0, required - available)
    const shortfall = required - available

    requirements.push({
      item: mat.items,
      required: required,
      available: available,
      needed: needed,
      unit: stock ? stock.unit : 'units',
      sufficient: available >= required,
      shortfall: shortfall > 0 ? shortfall : 0
    })

    if (available < required) {
      canComplete = false
    }
  })

  setGoalDetails({
    recipe: selectedRecipe,
    goal: dailyGoal,
    requirements: requirements,
    canComplete: canComplete
  })
  setGoalSet(true)
}

//////////////////////////////////////////////////
// END OF DAY PRODUCTION
//////////////////////////////////////////////////

const handleEndProduction=()=>{

if(!actualProduced || !selectedRecipe) {
  alert("Please select a recipe and enter production quantity")
  return
}

const produced=Number(actualProduced)

// Check if production exceeds goal
if (goalSet) {
  const totalProducedToday = productionHistory
    .filter(p => p.date === new Date().toLocaleDateString() && p.recipe === selectedRecipe)
    .reduce((sum, p) => sum + p.quantity, 0)
  
  if (totalProducedToday + produced > Number(dailyGoal)) {
    alert(`Total production (${totalProducedToday + produced}) would exceed daily goal of ${dailyGoal}`)
    return
  }
}

const recipeData=recipe.find(r=>r.name===selectedRecipe)

if(!recipeData)return

// Check if enough materials are available
let insufficientMaterials = []
recipeData.materials.forEach(mat => {
  const stock = material.find(m => m.item === mat.items)
  const required = mat.quant * produced
  if (!stock || stock.quantity < required) {
    insufficientMaterials.push({
      item: mat.items,
      required: required,
      available: stock ? stock.quantity : 0,
      unit: stock ? stock.unit : 'units'
    })
  }
})

if (insufficientMaterials.length > 0) {
  alert("Insufficient materials for production:\n" + 
    insufficientMaterials.map(m => 
      `${m.item}: Need ${m.required} ${m.unit}, Available ${m.available} ${m.unit}`
    ).join('\n'))
  return
}

let usedMaterials=[]

setMaterial(prev=>{

const updated=prev.map(mat=>{

const req=recipeData.materials.find(
m=>m.items===mat.item
)

if(req){

const used=req.quant*produced

usedMaterials.push({
item:mat.item,
used:used,
unit:mat.unit
})

return{
...mat,
quantity:mat.quantity-used
}

}

return mat

})

return updated

})

const newHistory={
id:Date.now(),
recipe:selectedRecipe,
quantity:produced,
materials:usedMaterials,
date:new Date().toLocaleDateString()
}

setProductionHistory([newHistory,...productionHistory])

// Reset form
setSelectedRecipe("")
setActualProduced("")
}

// Calculate today's production total
const todayProduction = productionHistory
  .filter(p => p.date === new Date().toLocaleDateString())
  .reduce((sum, p) => sum + p.quantity, 0)

// Calculate goal progress percentage
const goalProgress = goalSet ? (todayProduction / Number(dailyGoal)) * 100 : 0

return(

<div className="bg-gray-100 min-h-screen">

<Navbar/>

<div className="px-4 md:px-10 py-20">

<h1 className="text-3xl font-bold text-blue-800 flex items-center gap-2 mb-8">
<Factory size={28}/> Production Dashboard
</h1>

{/* SET GOAL AND END OF DAY SECTION - FLEX LAYOUT */}
<div className="flex flex-wrap gap-6">
  
  {/* SET GOAL CARD */}
  <div className="flex-1 min-w-[300px] bg-white p-6 rounded-xl shadow-lg">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <Target className="text-blue-600" /> Set Daily Goal
    </h2>
    
    <div className="flex flex-col gap-4">
      <select
        className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
        value={selectedRecipe}
        onChange={(e) => {
          setSelectedRecipe(e.target.value)
          setGoalSet(false)
          setGoalDetails(null)
        }}
      >
        <option value="">Select Recipe</option>
        {recipe.map((r,i)=>(
          <option key={i} value={r.name}>{r.name}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Daily Goal Quantity"
        className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
        value={dailyGoal}
        onChange={(e) => {
          setDailyGoal(e.target.value)
          setGoalSet(false)
          setGoalDetails(null)
        }}
      />

      <button
        onClick={handleSetGoal}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full font-medium"
      >
        Set Goal
      </button>
    </div>

    {/* GOAL REQUIREMENTS DISPLAY */}
    {goalDetails && (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <ChevronRight size={18} className="text-blue-600" />
          Material Requirements
        </h3>
        {goalDetails.requirements.map((req, index) => (
          <div key={index} className="mb-3 p-3 bg-white rounded-lg border border-gray-200">
            <p className="font-medium text-gray-800">{req.item}</p>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Required:</span>
                <span className="font-medium">{req.required} {req.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available:</span>
                <span className="font-medium">{req.available} {req.unit}</span>
              </div>
              {req.needed > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>Need more:</span>
                  <span className="font-semibold">{req.needed} {req.unit}</span>
                </div>
              )}
            </div>
            <div className={`mt-2 text-xs font-medium px-2 py-1 rounded ${
              req.sufficient ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {req.sufficient ? '✓ Sufficient stock' : `✗ Short by ${req.shortfall} ${req.unit}`}
            </div>
          </div>
        ))}
        
        <div className={`mt-4 p-3 rounded-lg text-center font-semibold ${
          goalDetails.canComplete 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {goalDetails.canComplete 
            ? '✓ Goal achievable with current stock' 
            : '✗ Insufficient materials for goal'}
        </div>
      </div>
    )}
  </div>

  {/* END OF DAY PRODUCTION CARD */}
  <div className="flex-1 min-w-[300px] bg-white p-6 rounded-xl shadow-lg">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <Calendar className="text-green-600" /> End of Day Production
    </h2>
    
    <div className="flex flex-col gap-4">
      <select
        className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-green-300 focus:border-green-400 outline-none"
        value={selectedRecipe}
        onChange={(e) => setSelectedRecipe(e.target.value)}
      >
        <option value="">Select Recipe</option>
        {recipe.map((r,i)=>(
          <option key={i} value={r.name}>{r.name}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Actual Quantity Produced"
        className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-green-300 focus:border-green-400 outline-none"
        value={actualProduced}
        onChange={(e) => setActualProduced(e.target.value)}
      />

      <button
        onClick={handleEndProduction}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full font-medium"
      >
        Save Production
      </button>
    </div>

    {/* GOAL PROGRESS */}
    {goalSet && (
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-blue-800">Today's Goal Progress</p>
          <p className="text-sm text-blue-600">
            {todayProduction} / {dailyGoal} units
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              goalProgress >= 100 ? 'bg-green-500' : 'bg-blue-600'
            }`}
            style={{ width: `${Math.min(goalProgress, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {goalProgress >= 100 
            ? '🎉 Goal achieved!' 
            : `${(100 - goalProgress).toFixed(1)}% remaining`}
        </p>
      </div>
    )}
  </div>
</div>

{/* STATS */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
  <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-shadow">
    <div className="flex flex-col items-center">
      <Package className="text-blue-600 mb-2" size={28}/>
      <p className="text-gray-600 text-sm">Total Materials</p>
      <p className="text-3xl font-bold text-gray-800">{material.length}</p>
    </div>
  </div>
  
  <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-shadow">
    <div className="flex flex-col items-center">
      <AlertTriangle className="text-amber-600 mb-2" size={28}/>
      <p className="text-gray-600 text-sm">Low Stock Items</p>
      <p className="text-3xl font-bold text-gray-800">{handledLowStock()}</p>
    </div>
  </div>
  
  <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-shadow">
    <div className="flex flex-col items-center">
      <ClipboardList className="text-purple-600 mb-2" size={28}/>
      <p className="text-gray-600 text-sm">Total Recipes</p>
      <p className="text-3xl font-bold text-gray-800">{recipe.length}</p>
    </div>
  </div>
  
  <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-shadow">
    <div className="flex flex-col items-center">
      <Factory className="text-green-600 mb-2" size={28}/>
      <p className="text-gray-600 text-sm">Today's Production</p>
      <p className="text-3xl font-bold text-gray-800">{todayProduction}</p>
    </div>
  </div>
</div>

{/* LOW STOCK ALERT */}
<div className="bg-white mt-8 p-6 rounded-xl shadow-lg">
  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
    <AlertTriangle className="text-amber-600" /> 
    Low Stock Alerts
  </h2>
  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
    {handledAlert()}
  </div>
</div>

{/* PRODUCTION TABLE */}
<div className="bg-white mt-8 rounded-xl shadow-lg overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
    <h2 className="text-xl font-semibold flex items-center gap-2">
      <ClipboardList className="text-blue-600" /> 
      Daily Production Log
    </h2>
  </div>
  
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Recipe</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Materials Used</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {productionHistory.length > 0 ? (
          productionHistory.map((p, index) => (
            <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
            }`}>
              <td className="px-6 py-4">
                <span className="font-medium text-gray-900">{p.recipe}</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {p.quantity} units
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  {p.materials.map((m,i)=>(
                    <div key={i} className="text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span className="text-gray-700">{m.item}:</span>
                      <span className="font-medium text-gray-900">{m.used}{m.unit}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-600">{p.date}</span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <ClipboardList size={40} className="text-gray-300" />
                <p>No production records yet</p>
                <p className="text-sm">Complete end of day production to see records here</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  
  {/* Table Footer with Summary */}
  {productionHistory.length > 0 && (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Total Records: {productionHistory.length}</span>
        <span className="text-gray-600">
          Last Updated: {new Date().toLocaleDateString()}
        </span>
      </div>
    </div>
  )}
</div>

</div>

</div>

)

}