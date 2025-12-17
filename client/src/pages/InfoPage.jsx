import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { FiSearch } from 'react-icons/fi'

const InfoPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products/demo')
      setProducts(response.data.products)
    } catch (error) {
      console.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

const categories = React.useMemo(() => {
  const set = new Set(products.map(p => p.category))
  return ['all', ...Array.from(set)]
}, [products])


  const filteredProducts = filter == 'all' 
    ? products 
    : products.filter(p => p.category == filter)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Product Information
          </h1>
          <p className="text-xl text-gray-600">
            Browse our demo database of analyzed products
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8 overflow-x-auto scrollbar-hide">
          <div className="glass p-2 rounded-full inline-flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-full font-medium capitalize transition-all whitespace-nowrap ${
                  filter === category
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-2xl hover:shadow-xl transition-shadow"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display text-xl font-bold text-gray-800">{product.name}</h3>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                    {product.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3">{product.summary}</p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Safe Ingredients:</span>
                  <span className="font-semibold text-green-600">{product.severityCounts.low}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Moderate Risk:</span>
                  <span className="font-semibold text-yellow-600">{product.severityCounts.medium}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">High Risk:</span>
                  <span className="font-semibold text-red-600">{product.severityCounts.high}</span>
                </div>
              </div>

              {product.organsAffected && product.organsAffected.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Organs Affected:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.organsAffected.map((organ, i) => (
                      <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs capitalize">
                        {organ}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className={`p-3 rounded-lg text-center font-semibold ${
                product.severityCounts.high > 2
                  ? 'bg-red-100 text-red-700'
                  : product.severityCounts.medium > 3
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {product.severityCounts.high > 1
                  ? 'Not Recommended'
                  : product.severityCounts.medium > 0
                  ? 'Consume Moderately'
                  : 'Generally Safe'} 
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InfoPage

