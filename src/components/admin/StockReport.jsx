import { useContext, useState } from "react"
import { RawMaterialContext } from "../itemContext/RawMaterialContext"
import Navbar from "./Navbar"
import { Download, FileText, Package, TrendingUp, AlertTriangle, Calendar, Printer, PieChart, BarChart3, CheckCircle, Clock } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function StockReport() {
  const { material, productionHistory } = useContext(RawMaterialContext)
  const [isGenerating, setIsGenerating] = useState(false)

  /////////////////////////////////////////////////////
  // CALCULATE STATISTICS
  /////////////////////////////////////////////////////
  
  const totalMaterials = material.length
  const lowStockItems = material.filter(
    (item) => Number(item.quantity) <= Number(item.minStock)
  ).length
  const totalProduction = productionHistory.reduce(
    (sum, p) => sum + Number(p.quantity || 0),
    0
  )
  const healthyStock = material.filter(
    (item) => Number(item.quantity) > Number(item.minStock)
  ).length
  
  const stockHealthPercentage = totalMaterials > 0 
    ? ((healthyStock / totalMaterials) * 100).toFixed(1)
    : 0

  /////////////////////////////////////////////////////
  // GENERATE PDF REPORT
  /////////////////////////////////////////////////////
  
  const generatePDF = () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const doc = new jsPDF()

      /////////////////////////////////////////////////
      // COMPANY HEADER
      /////////////////////////////////////////////////
      
      doc.setFillColor(15, 23, 42)
      doc.rect(0, 0, 210, 30, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(22)
      doc.setFont("helvetica", "bold")
      doc.text("PEACE-FLOW SYSTEMS", 105, 15, { align: "center" })
      
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text("Stock Management Report", 105, 22, { align: "center" })

      /////////////////////////////////////////////////
      // REPORT INFO
      /////////////////////////////////////////////////

      const today = new Date()
      const dateStr = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      const timeStr = today.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })

      doc.setTextColor(60, 60, 60)
      doc.setFontSize(10)
      doc.text(`Generated on: ${dateStr} at ${timeStr}`, 14, 38)
      doc.text(`Report ID: RPT-${Date.now().toString().slice(-8)}`, 14, 44)

      /////////////////////////////////////////////////
      // SUMMARY CARDS
      /////////////////////////////////////////////////

      doc.setFillColor(59, 130, 246)
      doc.roundedRect(14, 52, 85, 30, 3, 3, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.text("Total Materials", 20, 62)
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text(totalMaterials.toString(), 20, 76)

      doc.setFillColor(34, 197, 94)
      doc.roundedRect(109, 52, 85, 30, 3, 3, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text("Total Production", 115, 62)
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text(`${totalProduction} units`, 115, 76)

      /////////////////////////////////////////////////
      // MATERIAL TABLE
      /////////////////////////////////////////////////

      doc.setTextColor(30, 64, 175)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Current Materials Inventory", 14, 95)

      const materialHeaders = [["Material", "Quantity", "Unit", "Min Stock", "Status"]]

      const materialRows = material.map((item) => {
        const status = Number(item.quantity) <= Number(item.minStock) ? "Low Stock" : "In Stock"
        const statusColor = Number(item.quantity) <= Number(item.minStock) ? [239, 68, 68] : [34, 197, 94]
        
        return [
          item.item,
          item.quantity.toString(),
          item.unit,
          item.minStock.toString(),
          { content: status, styles: { textColor: statusColor, fontStyle: 'bold' } }
        ]
      })

      autoTable(doc, {
        startY: 100,
        head: materialHeaders,
        body: materialRows,
        theme: "striped",
        styles: { 
          fontSize: 9, 
          cellPadding: 4,
          lineColor: [200, 200, 200],
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 10
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250]
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 30, halign: 'center' },
          2: { cellWidth: 25, halign: 'center' },
          3: { cellWidth: 30, halign: 'center' },
          4: { cellWidth: 35, halign: 'center' }
        }
      })

      /////////////////////////////////////////////////
      // PRODUCTION TABLE
      /////////////////////////////////////////////////

      const finalY = doc.lastAutoTable?.finalY || 150

      doc.setTextColor(22, 163, 74)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Daily Production Records", 14, finalY + 15)

      const productionHeaders = [["Recipe", "Quantity", "Date", "Materials Used"]]

      const productionRows = productionHistory.length > 0
        ? productionHistory.map((p) => [
            p.recipe,
            p.quantity.toString(),
            p.date,
            p.materials?.map(m => `${m.item}: ${m.used}${m.unit}`).join(', ') || 'N/A'
          ])
        : [["No production history", "", "", ""]]

      autoTable(doc, {
        startY: finalY + 20,
        head: productionHeaders,
        body: productionRows,
        theme: "striped",
        styles: { 
          fontSize: 8, 
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [22, 163, 74],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 9
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250]
        },
        columnStyles: {
          0: { cellWidth: 45 },
          1: { cellWidth: 25, halign: 'center' },
          2: { cellWidth: 35, halign: 'center' },
          3: { cellWidth: 75 }
        }
      })

      /////////////////////////////////////////////////
      // STATISTICS SUMMARY
      /////////////////////////////////////////////////

      const summaryY = doc.lastAutoTable?.finalY + 20

      doc.setFillColor(241, 245, 249)
      doc.roundedRect(14, summaryY - 5, 180, 40, 3, 3, 'F')
      
      doc.setTextColor(15, 23, 42)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("Stock Summary", 20, summaryY)

      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      
      const summaryStats = [
        `Total Materials: ${totalMaterials}`,
        `Low Stock Items: ${lowStockItems}`,
        `Healthy Stock: ${healthyStock}`,
        `Stock Health: ${stockHealthPercentage}%`,
        `Total Production: ${totalProduction} units`,
        `Production Records: ${productionHistory.length}`
      ]

      let yPos = summaryY + 5
      summaryStats.forEach((stat, index) => {
        if (index < 3) {
          doc.text(stat, 20, yPos + (index * 5))
        } else {
          doc.text(stat, 100, yPos + ((index - 3) * 5))
        }
      })

      /////////////////////////////////////////////////
      // FOOTER
      /////////////////////////////////////////////////

      doc.setFillColor(15, 23, 42)
      doc.rect(0, 280, 210, 17, 'F')
      
      doc.setTextColor(200, 200, 200)
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.text("© 2024 Peace-Flow Stock Management System", 105, 288, { align: "center" })
      doc.text("This is a system-generated report", 105, 293, { align: "center" })

      /////////////////////////////////////////////////
      // DOWNLOAD
      /////////////////////////////////////////////////

      doc.save(`Stock_Report_${dateStr.replace(/\s/g, '_')}.pdf`)
      setIsGenerating(false)
    }, 1000)
  }

  /////////////////////////////////////////////////////
  // STATUS COLOR
  /////////////////////////////////////////////////////

  const getStatusClass = (quantity, minStock) => {
    return Number(quantity) <= Number(minStock)
      ? "bg-linear-to-r from-red-50 to-red-100 text-red-700 border-l-4 border-red-500"
      : "bg-linear-to-r from-green-50 to-green-100 text-green-700 border-l-4 border-green-500"
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        
        {/* HEADER WITH linear */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                <FileText size={32} className="text-blue-600" />
                Stock Report
              </h1>
              <p className="text-gray-600 mt-2 text-lg flex items-center gap-2">
                <Clock size={18} className="text-gray-400" />
                Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>
            
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className={`group relative px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 ${
                isGenerating ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Report...</span>
                </>
              ) : (
                <>
                  <Download size={20} className="group-hover:translate-y-1 transition-transform duration-300" />
                  <span>Download PDF Report</span>
                  <Printer size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* STATISTICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                  <Package size={14} className="text-blue-500" />
                  Total Materials
                </p>
                <p className="text-4xl font-bold text-gray-800">{totalMaterials}</p>
                <p className="text-xs text-gray-400 mt-2">Active inventory items</p>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Package className="text-white" size={28} />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                  <TrendingUp size={14} className="text-green-500" />
                  Total Production
                </p>
                <p className="text-4xl font-bold text-gray-800">{totalProduction}</p>
                <p className="text-xs text-gray-400 mt-2">Units produced</p>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="text-white" size={28} />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                  <AlertTriangle size={14} className="text-red-500" />
                  Low Stock Items
                </p>
                <p className="text-4xl font-bold text-gray-800">{lowStockItems}</p>
                <p className="text-xs text-gray-400 mt-2">Need attention</p>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="text-white" size={28} />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                  <CheckCircle size={14} className="text-purple-500" />
                  Stock Health
                </p>
                <p className="text-4xl font-bold text-gray-800">{stockHealthPercentage}%</p>
                <p className="text-xs text-gray-400 mt-2">Healthy stock ratio</p>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="text-white" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* MATERIAL TABLE */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden mb-8 border border-gray-200">
          <div className="px-8 py-6 bg-linear-to-r from-blue-600 to-indigo-600">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <Package size={24} />
              Current Materials Inventory
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full ml-2">
                {totalMaterials} items
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-linear-to-r from-gray-800 to-gray-900 text-white">
                  <th className="px-8 py-5 text-left text-sm font-semibold uppercase tracking-wider">Material</th>
                  <th className="px-8 py-5 text-left text-sm font-semibold uppercase tracking-wider">Quantity</th>
                  <th className="px-8 py-5 text-left text-sm font-semibold uppercase tracking-wider">Unit</th>
                  <th className="px-8 py-5 text-left text-sm font-semibold uppercase tracking-wider">Min Stock</th>
                  <th className="px-8 py-5 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {material.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-blue-50/50 transition-all duration-300 group ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Package size={20} className="text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-900">{item.item}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-lg font-bold text-gray-800">{item.quantity}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium">
                        {item.unit}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-lg font-bold text-gray-800">{item.minStock}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${getStatusClass(
                        item.quantity,
                        item.minStock
                      )}`}>
                        <span className={`w-2 h-2 rounded-full ${
                          Number(item.quantity) <= Number(item.minStock) ? 'bg-red-500' : 'bg-green-500'
                        }`}></span>
                        {Number(item.quantity) <= Number(item.minStock) ? 'Low Stock' : 'In Stock'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-8 py-4 bg-linear-to-r from-gray-50 to-gray-100 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 font-medium flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                Healthy Stock: {healthyStock} items
              </span>
              <span className="text-gray-600 font-medium flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500" />
                Low Stock: {lowStockItems} items
              </span>
            </div>
          </div>
        </div>

        {/* PRODUCTION TABLE */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="px-8 py-6 bg-linear-to-r from-green-600 to-emerald-600">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <Calendar size={24} />
              Daily Production Records
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full ml-2">
                {productionHistory.length} records
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-linear-to-r from-gray-800 to-gray-900 text-white">
                  <th className="px-8 py-5 text-left text-sm font-semibold uppercase tracking-wider">Recipe</th>
                  <th className="px-8 py-5 text-left text-sm font-semibold uppercase tracking-wider">Quantity</th>
                  <th className="px-8 py-5 text-left text-sm font-semibold uppercase tracking-wider">Materials Used</th>
                  <th className="px-8 py-5 text-left text-sm font-semibold uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productionHistory.length > 0 ? (
                  productionHistory.map((p, index) => (
                    <tr 
                      key={index} 
                      className={`hover:bg-green-50/50 transition-all duration-300 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                      }`}
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                            <PieChart size={20} className="text-green-600" />
                          </div>
                          <span className="font-semibold text-gray-900">{p.recipe}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold">
                          {p.quantity} units
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="space-y-2">
                          {p.materials?.map((m, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-lg">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              <span className="text-gray-600">{m.item}:</span>
                              <span className="font-semibold text-gray-900">{m.used}{m.unit}</span>
                            </div>
                          )) || 'N/A'}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-600 bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium">
                          {p.date}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Calendar size={48} className="text-gray-300" />
                        <p className="text-gray-500 text-lg">No production records available</p>
                        <p className="text-gray-400 text-sm">Start recording production to see data here</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Production Summary Footer */}
          {productionHistory.length > 0 && (
            <div className="px-8 py-4 bg-linear-to-r from-gray-50 to-gray-100 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-500" />
                  Total Production: {totalProduction} units
                </span>
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  Latest: {productionHistory[0]?.date || 'N/A'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay for PDF Generation */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl transform animate-bounce">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xl font-semibold text-gray-800">Generating Report...</p>
              <p className="text-gray-500">Please wait while we prepare your PDF</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}