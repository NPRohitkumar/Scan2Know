const mongoose = require('mongoose')

const ingredientSchema = new mongoose.Schema({
  ingredient_name: {
    type: String,
    required: true,
    unique: true
  },
  synonyms: [String],
  category: String,
  function: String,
  health_effect: String,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  alternative: String,
  organs_affected: [String]
})

ingredientSchema.index({ ingredient_name: 'text', synonyms: 'text' })

module.exports = mongoose.model('Ingredient', ingredientSchema)