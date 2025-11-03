import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiLoader } from 'react-icons/fi'
import axios from 'axios'
import toast from 'react-hot-toast'

const ProductSearch = ({ onResult }) => {
  const [productName, setProductName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!productName.trim()) {
      toast.error('Please enter a product name')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post('/api/products/search', { productName })
      if (response.data.found) {
        onResult(response.data.result)
      } else {
        toast.error('Product not found. Please use camera scan.')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="glass p-8 rounded-2xl">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name (e.g., Coca Cola, Lays Chips)"
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <FiSearch />
                <span>Search Product</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> If the product is not found in our database, 
            you can scan the product label using the camera option.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductSearch