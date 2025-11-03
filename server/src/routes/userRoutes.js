const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')

router.get('/recent-searches', auth, userController.getRecentSearches)
router.get('/recommendations', auth, userController.getRecommendations)

module.exports = router