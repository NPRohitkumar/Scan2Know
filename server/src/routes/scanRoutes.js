const express = require('express')
const router = express.Router()
const scanController = require('../controllers/scanController')
const auth = require('../middleware/auth')
const upload = require('../config/multer')

router.post('/upload', auth, upload.single('image'), scanController.uploadAndScan)

module.exports = router  // ← IMPORTANT