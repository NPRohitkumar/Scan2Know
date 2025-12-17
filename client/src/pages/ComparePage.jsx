import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiPlus, FiX, FiAward } from 'react-icons/fi'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import axios from 'axios'
import toast from 'react-hot-toast'

const ComparePage = () => {
  const [productInputs, setProductInputs] = useState(['', ''])
  const [comparisonResults, setComparisonResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const addProductInput = () => {
    if (productInputs.length < 4) {
      setProductInputs([...productInputs, ''])
    } else {
      toast.error('Maximum 4 products can be compared')
    }
  }

  const removeProductInput = (index) => {
    if (productInputs.length > 2) {
      setProductInputs(productInputs.filter((_, i) => i !== index))
    }
  }

  const updateProductInput = (index, value) => {
    const newInputs = [...productInputs]
    newInputs[index] = value
    setProductInputs(newInputs)
  }

  const handleCompare = async () => {
    const filledInputs = productInputs.filter(input => input.trim() !== '')
    
    if (filledInputs.length < 2) {
      toast.error('Please enter at least 2 product names')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post('http://localhost:5000/api/products/compare', {
        productNames: filledInputs
      })
      
      setComparisonResults(response.data)
      toast.success('Products compared successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Comparison failed')
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      default: return '#10b981'
    }
  }

  const getRecommendationColor = (rec) => {
    switch (rec) {
      case 'Excellent': return 'bg-green-100 text-green-800 border-green-300'
      case 'Good': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-red-100 text-red-800 border-red-300'
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Compare Products
          </h1>
          <p className="text-xl text-gray-600">
            Compare up to 4 products side-by-side to make healthier choices
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 rounded-2xl mb-8"
        >
          <h2 className="font-semibold text-xl mb-4">Enter Product Names</h2>
          <div className="space-y-4">
            {productInputs.map((input, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => updateProductInput(index, e.target.value)}
                    placeholder={`Product ${index + 1} (e.g., Coca Cola)`}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
                {productInputs.length > 2 && (
                  <button
                    onClick={() => removeProductInput(index)}
                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex space-x-4 mt-6">
            {productInputs.length < 4 && (
              <button
                onClick={addProductInput}
                className="flex items-center space-x-2 px-4 py-2 border-2 border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <FiPlus />
                <span>Add Product</span>
              </button>
            )}
            <button
              onClick={handleCompare}
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {loading ? 'Comparing...' : 'Compare Products'}
            </button>
          </div>
        </motion.div>

        {/* Comparison Results */}
        {comparisonResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Winner Badge */}
            <div className="glass p-6 rounded-2xl text-center bg-gradient-to-br from-green-50 to-blue-50">
              <FiAward className="mx-auto text-6xl text-green-600 mb-3" />
              <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">
                Healthiest Choice
              </h2>
              <p className="text-3xl font-bold text-green-600">
                {comparisonResults.healthiest}
              </p>
            </div>

            {/* Comparison Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Health Score Comparison */}
              <div className="glass p-6 rounded-2xl">
                <h3 className="font-semibold text-lg mb-4">Health Score Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonResults.products}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="healthScore" fill="#f59e0b" name="Health Score (Lower is Better)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Safety Rating */}
              <div className="glass p-6 rounded-2xl">
                <h3 className="font-semibold text-lg mb-4">Safety Rating</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonResults.products}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="safetyRating" fill="#10b981" name="Safety Rating (Higher is Better)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Comparison Table */}
            <div className="glass p-6 rounded-2xl overflow-x-auto">
              <h3 className="font-semibold text-xl mb-6">Detailed Comparison</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-3 font-semibold">Metric</th>
                    {comparisonResults.products.map((product, index) => (
                      <th key={index} className="text-center p-3 font-semibold">
                        {product.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-medium">Category</td>
                    {comparisonResults.products.map((product, index) => (
                      <td key={index} className="text-center p-3 capitalize">{product.category}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-medium">Health Score</td>
                    {comparisonResults.products.map((product, index) => (
                      <td key={index} className="text-center p-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.healthScore < 10 ? 'bg-green-100 text-green-800' :
                          product.healthScore < 20 ? 'bg-blue-100 text-blue-800' :
                          product.healthScore < 30 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.healthScore}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-medium">Safety Rating</td>
                    {comparisonResults.products.map((product, index) => (
                      <td key={index} className="text-center p-3 font-semibold text-green-600">
                        {product.safetyRating}%
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-medium">Safe Ingredients</td>
                    {comparisonResults.products.map((product, index) => (
                      <td key={index} className="text-center p-3 text-green-600">
                        {product.severityCounts.low}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-medium">Moderate Risk</td>
                    {comparisonResults.products.map((product, index) => (
                      <td key={index} className="text-center p-3 text-yellow-600">
                        {product.severityCounts.medium}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-medium">High Risk</td>
                    {comparisonResults.products.map((product, index) => (
                      <td key={index} className="text-center p-3 text-red-600">
                        {product.severityCounts.high}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-medium">Additives</td>
                    {comparisonResults.products.map((product, index) => (
                      <td key={index} className="text-center p-3">{product.additiveCount}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-medium">Organs Affected</td>
                    {comparisonResults.products.map((product, index) => (
                      <td key={index} className="text-center p-3">{product.organsAffected.length}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Recommendation</td>
                    {comparisonResults.products.map((product, index) => (
                      <td key={index} className="text-center p-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRecommendationColor(product.recommendation)}`}>
                          {product.recommendation}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Individual Product Details */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comparisonResults.products.map((product, index) => (
                <div key={index} className="glass p-6 rounded-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    {product.name === comparisonResults.healthiest && (
                      <FiAward className="text-2xl text-green-600" />
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{product.summary}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Health Score:</span>
                      <span className="font-semibold">{product.healthScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Safety Rating:</span>
                      <span className="font-semibold text-green-600">{product.safetyRating}%</span>
                    </div>
                  </div>

                  {product.organsAffected.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Organs Affected:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.organsAffected.map((organ, i) => (
                          <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs capitalize">
                            {organ}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ComparePage