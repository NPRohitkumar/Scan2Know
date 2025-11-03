const express = require('express')
const router = express.Router()
const Ingredient = require('../models/Ingredient')

router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find()
    res.json({ ingredients })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id)
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' })
    }
    res.json({ ingredient })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router