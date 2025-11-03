const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Ingredient = require('../models/Ingredient')
const Product = require('../models/Product')
const ingredientsData = require('../../../data/ingredients.json')

dotenv.config()

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await Ingredient.deleteMany({})
    await Product.deleteMany({})
    console.log('Cleared existing data')

    // Seed ingredients
    const ingredients = await Ingredient.insertMany(ingredientsData)
    console.log(`Seeded ${ingredients.length} ingredients`)

    // Create demo products
    const demoProducts = [
      {
        name: 'Coca Cola',
        category: 'beverages',
        ingredients: ingredients.filter(i => 
          ['High Fructose Corn Syrup', 'Artificial Red 40', 'Sodium Benzoate'].includes(i.ingredient_name)
        ).map(i => i._id),
        summary: 'Popular carbonated soft drink containing high levels of sugar and artificial ingredients. Regular consumption may lead to weight gain and dental problems.',
        severityCounts: { low: 0, medium: 1, high: 2 },
        organsAffected: ['liver', 'pancreas', 'heart', 'brain']
      },
      {
        name: 'Lays Classic Chips',
        category: 'snacks',
        ingredients: ingredients.filter(i => 
          ['Monosodium Glutamate', 'Artificial Red 40'].includes(i.ingredient_name)
        ).map(i => i._id),
        summary: 'Crispy potato chips with added flavoring. Contains MSG and artificial colors which may cause adverse reactions in sensitive individuals.',
        severityCounts: { low: 1, medium: 1, high: 1 },
        organsAffected: ['brain', 'nervous system']
      },
      {
        name: 'Processed Cheese Slices',
        category: 'dairy',
        ingredients: ingredients.filter(i => 
          ['Sodium Benzoate', 'Artificial Vanilla', 'BHT'].includes(i.ingredient_name)
        ).map(i => i._id),
        summary: 'Convenience cheese product with preservatives. Contains several artificial ingredients to maintain shelf life and texture.',
        severityCounts: { low: 1, medium: 1, high: 1 },
        organsAffected: ['liver', 'kidneys']
      },
      {
        name: 'Energy Drink',
        category: 'beverages',
        ingredients: ingredients.filter(i => 
          ['Aspartame', 'Sodium Benzoate', 'Artificial Red 40'].includes(i.ingredient_name)
        ).map(i => i._id),
        summary: 'High caffeine beverage with artificial sweeteners. May cause jitteriness, heart palpitations, and sleep disturbances.',
        severityCounts: { low: 0, medium: 2, high: 1 },
        organsAffected: ['heart', 'brain', 'nervous system']
      },
      {
        name: 'Yogurt with Fruit',
        category: 'dairy',
        ingredients: ingredients.filter(i => 
          ['Potassium Sorbate', 'Artificial Vanilla'].includes(i.ingredient_name)
        ).map(i => i._id),
        summary: 'Dairy product with minimal preservatives. Generally safe for consumption with low-risk ingredients.',
        severityCounts: { low: 2, medium: 0, high: 0 },
        organsAffected: []
      },
      {
        name: 'Hot Dogs',
        category: 'packaged foods',
        ingredients: ingredients.filter(i => 
          ['Sodium Nitrite', 'BHT', 'Monosodium Glutamate'].includes(i.ingredient_name)
        ).map(i => i._id),
        summary: 'Processed meat product with preservatives. Contains sodium nitrite which can form carcinogenic compounds.',
        severityCounts: { low: 0, medium: 1, high: 2 },
        organsAffected: ['digestive', 'liver', 'cells']
      }
    ]

    await Product.insertMany(demoProducts)
    console.log(`Seeded ${demoProducts.length} demo products`)

    console.log('✓ Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seedDatabase()