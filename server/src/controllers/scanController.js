const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')
const ScanHistory = require('../models/ScanHistory')
const Ingredient = require('../models/Ingredient')
const User = require('../models/User')

exports.uploadAndScan = async (req, res) => {
  let filePath = null
  
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' })
    }

    filePath = req.file.path
    console.log('File uploaded to:', filePath)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ message: 'File not found after upload' })
    }

    // Send image to OCR service
    const formData = new FormData()
    formData.append('image', fs.createReadStream(filePath))

    console.log('Sending to OCR service...')
    const ocrResponse = await axios.post(
      `${process.env.OCR_SERVICE_URL}/extract`,
      formData,
      { 
        headers: formData.getHeaders(),
        timeout: 30000 // 30 second timeout
      }
    )

    console.log('OCR Response:', ocrResponse.data)

    if (!ocrResponse.data.success) {
      throw new Error('OCR extraction failed')
    }

    const extractedTexts = ocrResponse.data.texts || []
    
    if (extractedTexts.length === 0) {
      return res.status(400).json({ 
        message: 'No text found in image. Please try again with a clearer image.' 
      })
    }

    console.log('Extracted texts:', extractedTexts)

    // Match ingredients with database
    const matchedIngredients = await matchIngredients(extractedTexts)
    console.log('Matched ingredients:', matchedIngredients.length)

    if (matchedIngredients.length === 0) {
      return res.status(400).json({ 
        message: 'No matching ingredients found in our database. The product may be too new or regional.' 
      })
    }

    // Generate summary
    const summaryText = generateIngredientText(matchedIngredients)
    const summary = await generateSummary(summaryText)

    // Calculate severity counts
    const severityCounts = {
      low: matchedIngredients.filter(i => i.severity === 'low').length,
      medium: matchedIngredients.filter(i => i.severity === 'medium').length,
      high: matchedIngredients.filter(i => i.severity === 'high').length
    }

    // Determine overall rating
    const overallRating = severityCounts.high > 2 ? 'high' 
      : severityCounts.medium > 3 ? 'medium' : 'low'

    // Get affected organs
    const organsAffected = [...new Set(
      matchedIngredients.flatMap(i => i.organs_affected || [])
    )]

    // Save to scan history
    const scanHistory = await ScanHistory.create({
      userId: req.user.id,
      productName: req.body.productName || 'Scanned Product',
      scannedIngredients: extractedTexts,
      ingredients: matchedIngredients,
      summary,
      severityCounts,
      overallRating,
      imageUrl: filePath
    })

    // Update user scan history
    await User.findByIdAndUpdate(req.user.id, {
      $push: { scanHistory: scanHistory._id }
    })

    // Clean up uploaded file
    try {
      fs.unlinkSync(filePath)
      console.log('Cleaned up uploaded file')
    } catch (err) {
      console.error('Error deleting file:', err)
    }

    res.json({
      summary,
      ingredients: matchedIngredients,
      severityCounts,
      organsAffected,
      overallRating
    })
  } catch (error) {
    console.error('Scan error:', error)
    
    // Clean up file on error
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath)
      } catch (err) {
        console.error('Error deleting file on error:', err)
      }
    }

    // Better error messages
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        message: 'OCR service is not running. Please start the OCR service on port 8000.' 
      })
    }

    res.status(500).json({ 
      message: error.response?.data?.message || error.message || 'Scan failed'
    })
  }
}

async function matchIngredients(texts) {
  const matched = []

  for (const text of texts) {
    const cleanText = text.trim().toLowerCase()
    
    if (cleanText.length < 3) continue // Skip very short texts
    
    // Search by name or synonyms
    const ingredient = await Ingredient.findOne({
      $or: [
        { ingredient_name: new RegExp(cleanText, 'i') },
        { synonyms: new RegExp(cleanText, 'i') }
      ]
    })

    if (ingredient) {
      matched.push({
        name: ingredient.ingredient_name,
        health_effect: ingredient.health_effect,
        severity: ingredient.severity,
        organs_affected: ingredient.organs_affected || [],
        alternative: ingredient.alternative
      })
    }
  }

  return matched
}

function generateIngredientText(ingredients) {
  return ingredients.map(ing => {
    const organs = ing.organs_affected.length > 0 
      ? ing.organs_affected.join(', ') 
      : 'general health'
    const alternative = ing.alternative || 'natural alternatives'
    
    return `The ${ing.name} is ${ing.health_effect} and will affect the ${organs}, use ${alternative} instead of ${ing.name}`
  }).join('. ')
}

async function generateSummary(text) {
  try {
    const response = await axios.post(
      `${process.env.SUMMARIZER_SERVICE_URL}/summarize`,
      { text },
      { timeout: 30000 }
    )
    return response.data.summary
  } catch (error) {
    console.error('Summarizer error:', error.message)
    // Fallback to simple summarization if service fails
    const sentences = text.split('.').filter(s => s.trim().length > 0)
    return sentences.slice(0, 3).join('.') + '.'
  }
}