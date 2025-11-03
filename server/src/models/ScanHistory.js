const mongoose = require('mongoose')

const scanHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  scannedIngredients: [String],
  ingredients: [{
    name: String,
    health_effect: String,
    severity: String,
    organs_affected: [String],
    alternative: String
  }],
  summary: String,
  severityCounts: {
    low: Number,
    medium: Number,
    high: Number
  },
  overallRating: {
    type: String,
    enum: ['low', 'medium', 'high']
  },
  imageUrl: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('ScanHistory', scanHistorySchema)