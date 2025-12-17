const ScanHistory = require('../models/ScanHistory')
const Product = require('../models/Product')

exports.getRecentSearches = async (req, res) => {
  try {
    const searches = await ScanHistory
      .find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(10)
      .select('productName overallRating timestamp')

    res.json({ searches })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getRecommendations = async (req, res) => {
  try {
    // Get user's scan history
    const history = await ScanHistory
      .find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(5)

    // Find products with low severity
    const recommendations = await Product
      .find({
        'severityCounts.high': 0,
        'severityCounts.medium': { $lte: 2 }
      })
      .limit(5)
      .select('name category')

    const formattedRecs = recommendations.map(product => ({
      name: product.name,
      reason: `Based on your search history, this ${product.category} product is a healthier choice`
    }))

    res.json({ recommendations: formattedRecs })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// const ScanHistory = require('../models/ScanHistory')
// const Product = require('../models/Product')

// exports.getRecentSearches = async (req, res) => {
//   try {
//     const searches = await ScanHistory
//       .find({ userId: req.user.id })
//       .sort({ timestamp: -1 })
//       .limit(10)
//       .select('productName overallRating timestamp ingredients severityCounts')

//     // Format response with ingredient details
//     const formattedSearches = searches.map(search => ({
//       productName: search.productName,
//       overallRating: search.overallRating,
//       timestamp: search.timestamp,
//       severityCounts: search.severityCounts,
//       ingredients: search.ingredients || [],
//       organsAffected: [
//         ...new Set(
//           (search.ingredients || []).flatMap(ing => ing.organs_affected || [])
//         )
//       ]
//     }))

//     res.json({ searches: formattedSearches })
//   } catch (error) {
//     console.error('Get recent searches error:', error)
//     res.status(500).json({ message: error.message })
//   }
// }

// exports.getRecommendations = async (req, res) => {
//   try {
//     // Get user's scan history
//     const history = await ScanHistory
//       .find({ userId: req.user.id })
//       .sort({ timestamp: -1 })
//       .limit(5)

//     // Find products with low severity
//     const recommendations = await Product
//       .find({
//         'severityCounts.high': 0,
//         'severityCounts.medium': { $lte: 2 }
//       })
//       .limit(5)
//       .select('name category')

//     const formattedRecs = recommendations.map(product => ({
//       name: product.name,
//       reason: `Based on your search history, this ${product.category} product is a healthier choice`
//     }))

//     res.json({ recommendations: formattedRecs })
//   } catch (error) {
//     console.error('Get recommendations error:', error)
//     res.status(500).json({ message: error.message })
//   }
// }