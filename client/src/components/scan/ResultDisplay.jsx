import React from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiAlertTriangle } from 'react-icons/fi'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import OrganAnimation from './OrganAnimation'

const ResultDisplay = ({ result, onBack }) => {
  const severityData = [
    { name: 'Low', value: result.severityCounts.low, color: '#10b981' },
    { name: 'Medium', value: result.severityCounts.medium, color: '#f59e0b' },
    { name: 'High', value: result.severityCounts.high, color: '#ef4444' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={onBack}
        className="mb-6 flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
      >
        <FiArrowLeft />
        <span>Scan Another Product</span>
      </button>

      <div className="glass p-8 rounded-2xl">
        <h2 className="font-display text-3xl font-bold mb-6 text-gray-800">
          Analysis Results
        </h2>

        {/* Summary Section */}
        <div className="mb-8 p-6 bg-blue-50 rounded-xl">
          <h3 className="font-semibold text-lg mb-3 text-blue-900">Summary</h3>
          <p className="text-gray-700 leading-relaxed">{result.summary}</p>
        </div>

        {/* Severity Chart */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="glass p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-4">Ingredient Severity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Ingredients</span>
                <span className="font-bold text-xl">
                  {result.severityCounts.low + result.severityCounts.medium + result.severityCounts.high}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Safe</span>
                <span className="font-bold text-xl text-green-600">{result.severityCounts.low}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Moderate Risk</span>
                <span className="font-bold text-xl text-yellow-600">{result.severityCounts.medium}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">High Risk</span>
                <span className="font-bold text-xl text-red-600">{result.severityCounts.high}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Ingredients */}
        <div className="mb-8">
          <h3 className="font-semibold text-xl mb-4">Detailed Analysis</h3>
          <div className="space-y-4">
            {result.ingredients.map((ingredient, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  ingredient.severity === 'high'
                    ? 'bg-red-50 border-red-500'
                    : ingredient.severity === 'medium'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-green-50 border-green-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-lg">{ingredient.name}</h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      ingredient.severity === 'high'
                        ? 'bg-red-200 text-red-800'
                        : ingredient.severity === 'medium'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-green-200 text-green-800'
                    }`}
                  >
                    {ingredient.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{ingredient.health_effect}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-sm text-gray-600">
                    <strong>Affects:</strong> {ingredient.organs_affected.join(', ')}
                  </span>
                </div>
                {ingredient.alternative && (
                  <div className="mt-2 p-3 bg-white rounded-lg">
                    <p className="text-sm">
                      <strong className="text-green-700">✓ Healthier Alternative:</strong>{' '}
                      {ingredient.alternative}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Organ Animation */}
        {result.organsAffected && result.organsAffected.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold text-xl mb-4">Long-term Effects</h3>
            <OrganAnimation organs={result.organsAffected} />
          </div>
        )}

        {/* Warning */}
        {result.severityCounts.high > 0 && (
          <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl flex items-start space-x-4">
            <FiAlertTriangle className="text-red-600 text-2xl flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-red-800 mb-2">Health Warning</h4>
              <p className="text-red-700">
                This product contains {result.severityCounts.high} high-risk ingredient(s). 
                Regular consumption may pose health risks. Consider healthier alternatives.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ResultDisplay