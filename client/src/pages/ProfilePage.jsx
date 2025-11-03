import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiCalendar, FiClock } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const ProfilePage = () => {
  const { user } = useAuth()
  const [recentSearches, setRecentSearches] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const [searchesRes, recsRes] = await Promise.all([
        axios.get('/api/users/recent-searches'),
        axios.get('/api/users/recommendations')
      ])
      setRecentSearches(searchesRes.data.searches)
      setRecommendations(recsRes.data.recommendations)
    } catch (error) {
      console.error('Failed to fetch user data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl mb-8"
        >
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold mb-2 text-gray-800">{user?.username}</h1>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-gray-600">
                  <FiMail className="text-primary-500" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <FiCalendar className="text-primary-500" />
                  <span>Age: {user?.age} years</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Searches */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="glass p-6 rounded-2xl">
              <h2 className="font-display text-2xl font-bold mb-6 text-gray-800">Recent Searches</h2>
              {recentSearches.length > 0 ? (
                <div className="space-y-4">
                  {recentSearches.map((search, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800">{search.productName}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          search.overallRating === 'high'
                            ? 'bg-red-100 text-red-700'
                            : search.overallRating === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {search.overallRating}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FiClock />
                        <span>{new Date(search.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No searches yet. Start scanning products!</p>
              )}
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass p-6 rounded-2xl">
              <h2 className="font-display text-2xl font-bold mb-6 text-gray-800">Recommendations</h2>
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <h3 className="font-semibold text-gray-800 mb-2">{rec.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                      <span className="inline-block px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-semibold">
                        Healthier Alternative
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Scan products to get personalized recommendations
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage