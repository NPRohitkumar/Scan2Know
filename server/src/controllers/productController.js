// const Product = require('../models/Product')
// const Ingredient = require('../models/Ingredient')

// exports.searchProduct = async (req, res) => {
//   try {
//     const { productName } = req.body

//     const product = await Product.findOne({
//       name: new RegExp(productName, 'i')
//     }).populate('ingredients')

//     if (!product) {
//       return res.json({ found: false })
//     }

//     const result = {
//       productName: product.name,
//       summary: product.summary,
//       ingredients: product.ingredients.map(ing => ({
//         name: ing.ingredient_name,
//         health_effect: ing.health_effect,
//         severity: ing.severity,
//         organs_affected: ing.organs_affected,
//         alternative: ing.alternative
//       })),
//       severityCounts: product.severityCounts,
//       organsAffected: product.organsAffected
//     }

//     res.json({ found: true, result })
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }

// exports.getDemoProducts = async (req, res) => {
//   try {
//     const products = await Product.find().populate('ingredients').limit(20)
//     res.json({ products })
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }

const Product = require('../models/Product')
const Ingredient = require('../models/Ingredient')

exports.searchProduct = async (req, res) => {
  try {
    const { productName } = req.body

    // Find product and populate full ingredient details
    const product = await Product.findOne({
      name: new RegExp(productName, 'i')
    }).populate('ingredients')

    if (!product) {
      return res.json({ found: false, message: 'Product not found in database' })
    }

    // Format ingredients with full details
    const formattedIngredients = product.ingredients.map(ing => ({
      name: ing.ingredient_name,
      health_effect: ing.health_effect,
      severity: ing.severity,
      organs_affected: ing.organs_affected || [],
      alternative: ing.alternative || 'Natural alternatives',
      category: ing.category,
      function: ing.function
    }))

    // Calculate severity counts if not present
    let severityCounts = product.severityCounts
    if (!severityCounts || (severityCounts.low === 0 && severityCounts.medium === 0 && severityCounts.high === 0)) {
      severityCounts = {
        low: formattedIngredients.filter(i => i.severity === 'low').length,
        medium: formattedIngredients.filter(i => i.severity === 'medium').length,
        high: formattedIngredients.filter(i => i.severity === 'high').length
      }
    }

    const result = {
      productName: product.name,
      summary: product.summary || 'No summary available for this product.',
      ingredients: formattedIngredients,
      severityCounts: severityCounts,
      organsAffected: product.organsAffected || [],
      category: product.category
    }

    res.json({ found: true, result })
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ message: error.message })
  }
}

exports.getDemoProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('ingredients').limit(20)
    
    const formattedProducts = products.map(product => ({
      _id: product._id,
      name: product.name,
      category: product.category,
      summary: product.summary,
      severityCounts: product.severityCounts,
      organsAffected: product.organsAffected,
      imageUrl: product.imageUrl
    }))
    
    res.json({ products: formattedProducts })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({ message: error.message })
  }
}

exports.compareProducts = async (req, res) => {
  try {
    const { productNames } = req.body // Array of 2-4 product names

    if (!productNames || productNames.length < 2) {
      return res.status(400).json({ 
        message: 'Please provide at least 2 products to compare' 
      })
    }

    if (productNames.length > 4) {
      return res.status(400).json({ 
        message: 'Maximum 4 products can be compared at once' 
      })
    }

    // Find all products
    const products = await Promise.all(
      productNames.map(name => 
        Product.findOne({ name: new RegExp(name, 'i') }).populate('ingredients')
      )
    )

    // Filter out null results
    const foundProducts = products.filter(p => p !== null)

    if (foundProducts.length < 2) {
      return res.status(404).json({ 
        message: 'Could not find enough products to compare' 
      })
    }

    // Calculate comparison metrics for each product
    const comparison = foundProducts.map(product => {
      const severityCounts = product.severityCounts || { low: 0, medium: 0, high: 0 }
      
      // Health Score (lower is better)
      const healthScore = (
        severityCounts.low * 1 +
        severityCounts.medium * 3 +
        severityCounts.high * 5
      )

      // Safety Rating (0-100, higher is better)
      const totalIngredients = severityCounts.low + severityCounts.medium + severityCounts.high
      const safetyRating = totalIngredients > 0 
        ? Math.round(((severityCounts.low + severityCounts.medium * 0.5) / totalIngredients) * 100)
        : 0

      // Additive Score (count of artificial additives)
      const additiveCount = product.ingredients.filter(ing => 
        ['Preservative', 'Emulsifier', 'Food Coloring', 'Artificial Sweetener'].includes(ing.category)
      ).length

      return {
        name: product.name,
        category: product.category,
        summary: product.summary,
        severityCounts,
        healthScore,
        safetyRating,
        additiveCount,
        organsAffected: product.organsAffected || [],
        ingredients: product.ingredients.map(ing => ({
          name: ing.ingredient_name,
          severity: ing.severity,
          category: ing.category
        })),
        recommendation: healthScore < 10 ? 'Excellent' : 
                       healthScore < 20 ? 'Good' : 
                       healthScore < 30 ? 'Moderate' : 'Avoid'
      }
    })

    // Find the healthiest option
    const healthiest = comparison.reduce((best, current) => 
      current.healthScore < best.healthScore ? current : best
    )

    res.json({
      products: comparison,
      healthiest: healthiest.name,
      comparison_date: new Date()
    })

  } catch (error) {
    console.error('Comparison error:', error)
    res.status(500).json({ message: error.message })
  }
}