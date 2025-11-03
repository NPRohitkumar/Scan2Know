const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

router.post('/search', productController.searchProduct)
router.get('/demo', productController.getDemoProducts)

module.exports = router  // ← IMPORTANT