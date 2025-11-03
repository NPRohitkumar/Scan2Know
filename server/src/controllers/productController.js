const Product = require('../models/Product')
const Ingredient = require('../models/Ingredient')

exports.searchProduct = async (req, res) => {
  try {
    const { productName } = req.body

    const product = await Product.findOne({
      name: new RegExp(productName, 'i')
    }).populate('ingredients')

    if (!product) {
      return res.json({ found: false })
    }

    const result = {
      productName: product.name,
      summary: product.summary,
      ingredients: product.ingredients.map(ing => ({
        name: ing.ingredient_name,
        health_effect: ing.health_effect,
        severity: ing.severity,
        organs_affected: ing.organs_affected,
        alternative: ing.alternative
      })),
      severityCounts: product.severityCounts,
      organsAffected: product.organsAffected
    }

    res.json({ found: true, result })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getDemoProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('ingredients').limit(20)
    res.json({ products })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}