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