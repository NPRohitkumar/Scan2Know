import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiCalendar, FiClock } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import API_URL from '../config/api'

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
        axios.get(`${API_URL}/api/users/recent-searches`),
        axios.get(`${API_URL}/api/users/recommendations`)
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

// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { FiUser, FiMail, FiCalendar, FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi'
// import { useAuth } from '../context/AuthContext'
// import axios from 'axios'

// const ProfilePage = () => {
//   const { user } = useAuth()
//   const [recentSearches, setRecentSearches] = useState([])
//   const [recommendations, setRecommendations] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [expandedSearch, setExpandedSearch] = useState(null)

//   useEffect(() => {
//     fetchUserData()
//   }, [])

//   const fetchUserData = async () => {
//     try {
//       const [searchesRes, recsRes] = await Promise.all([
//         axios.get('/api/users/recent-searches'),
//         axios.get('/api/users/recommendations')
//       ])
//       setRecentSearches(searchesRes.data.searches)
//       setRecommendations(recsRes.data.recommendations)
//     } catch (error) {
//       console.error('Failed to fetch user data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getSeverityColor = (rating) => {
//     switch (rating) {
//       case 'high':
//         return 'bg-red-100 text-red-700 border-red-300'
//       case 'medium':
//         return 'bg-yellow-100 text-yellow-700 border-yellow-300'
//       default:
//         return 'bg-green-100 text-green-700 border-green-300'
//     }
//   }

//   const getSeverityIcon = (rating) => {
//     switch (rating) {
//       case 'high':
//         return '⚠️'
//       case 'medium':
//         return '⚡'
//       default:
//         return '✓'
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen py-12 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* User Info Card */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="glass p-8 rounded-2xl mb-8"
//         >
//           <div className="flex items-center space-x-6">
//             <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
//               {user?.username?.charAt(0).toUpperCase()}
//             </div>
//             <div className="flex-1">
//               <h1 className="font-display text-3xl font-bold mb-2 text-gray-800">{user?.username}</h1>
//               <div className="space-y-1">
//                 <div className="flex items-center space-x-2 text-gray-600">
//                   <FiMail className="text-primary-500" />
//                   <span>{user?.email}</span>
//                 </div>
//                 <div className="flex items-center space-x-2 text-gray-600">
//                   <FiCalendar className="text-primary-500" />
//                   <span>Age: {user?.age} years</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Recent Searches - UPDATED WITH INGREDIENTS */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.1 }}
//           >
//             <div className="glass p-6 rounded-2xl">
//               <h2 className="font-display text-2xl font-bold mb-6 text-gray-800">Scan History</h2>
//               {recentSearches.length > 0 ? (
//                 <div className="space-y-4">
//                   {recentSearches.map((search, index) => (
//                     <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//                       {/* Header - Always visible */}
//                       <div 
//                         className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
//                         onClick={() => setExpandedSearch(expandedSearch === index ? null : index)}
//                       >
//                         <div className="flex justify-between items-start mb-2">
//                           <div className="flex-1">
//                             <h3 className="font-semibold text-gray-800 mb-1">{search.productName}</h3>
//                             <div className="flex items-center space-x-2 text-sm text-gray-500">
//                               <FiClock />
//                               <span>{new Date(search.timestamp).toLocaleString()}</span>
//                             </div>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(search.overallRating)}`}>
//                               {getSeverityIcon(search.overallRating)} {search.overallRating.toUpperCase()}
//                             </span>
//                             {expandedSearch === index ? <FiChevronUp /> : <FiChevronDown />}
//                           </div>
//                         </div>
                        
//                         {/* Quick summary */}
//                         <div className="flex space-x-4 text-xs text-gray-600 mt-2">
//                           <span>✓ {search.severityCounts?.low || 0} Safe</span>
//                           <span>⚡ {search.severityCounts?.medium || 0} Moderate</span>
//                           <span>⚠️ {search.severityCounts?.high || 0} High Risk</span>
//                         </div>
//                       </div>

//                       {/* Expanded Details */}
//                       {expandedSearch === index && (
//                         <motion.div
//                           initial={{ opacity: 0, height: 0 }}
//                           animate={{ opacity: 1, height: 'auto' }}
//                           exit={{ opacity: 0, height: 0 }}
//                           className="px-4 pb-4 border-t border-gray-200"
//                         >
//                           {/* Ingredients List */}
//                           {search.ingredients && search.ingredients.length > 0 && (
//                             <div className="mt-3">
//                               <h4 className="font-semibold text-sm text-gray-700 mb-2">Ingredients Analyzed:</h4>
//                               <div className="space-y-2">
//                                 {search.ingredients.map((ingredient, idx) => (
//                                   <div 
//                                     key={idx} 
//                                     className={`p-2 rounded text-xs border-l-2 ${
//                                       ingredient.severity === 'high' 
//                                         ? 'bg-red-50 border-red-400 text-red-800'
//                                         : ingredient.severity === 'medium'
//                                         ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
//                                         : 'bg-green-50 border-green-400 text-green-800'
//                                     }`}
//                                   >
//                                     <span className="font-semibold">{ingredient.name}</span>
//                                     <p className="text-xs mt-1 opacity-80">{ingredient.health_effect}</p>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}

//                           {/* Organs Affected */}
//                           {search.organsAffected && search.organsAffected.length > 0 && (
//                             <div className="mt-3">
//                               <h4 className="font-semibold text-sm text-gray-700 mb-2">Organs Affected:</h4>
//                               <div className="flex flex-wrap gap-2">
//                                 {search.organsAffected.map((organ, idx) => (
//                                   <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize">
//                                     {organ}
//                                   </span>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </motion.div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">No scan history yet. Start scanning products!</p>
//               )}
//             </div>
//           </motion.div>

//           {/* Recommendations */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2 }}
//           >
//             <div className="glass p-6 rounded-2xl">
//               <h2 className="font-display text-2xl font-bold mb-6 text-gray-800">Recommendations</h2>
//               {recommendations.length > 0 ? (
//                 <div className="space-y-4">
//                   {recommendations.map((rec, index) => (
//                     <div key={index} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
//                       <h3 className="font-semibold text-gray-800 mb-2">{rec.name}</h3>
//                       <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
//                       <span className="inline-block px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-semibold">
//                         Healthier Alternative
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">
//                   Scan products to get personalized recommendations
//                 </p>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfilePage