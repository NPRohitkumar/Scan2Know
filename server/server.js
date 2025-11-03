const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'))
app.use('/api/scan', require('./src/routes/scanRoutes'))
app.use('/api/products', require('./src/routes/productRoutes'))
app.use('/api/users', require('./src/routes/userRoutes'))
app.use('/api/ingredients', require('./src/routes/ingredientRoutes'))

// Error handler
app.use(require('./src/middleware/errorHandler'))

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`)
})