import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="text-9xl mb-4">🍕</div>
        <h1 className="font-display text-6xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Oops! This page doesn't exist</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
        >
          <FiHome />
          <span>Go Home</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound