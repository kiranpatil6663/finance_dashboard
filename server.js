import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import authRouter from './routes/authRoute.js'
import adminRouter from './routes/adminRoute.js'
import transactionRouter from './routes/transactionRoute.js'
import dashboardRouter from './routes/dashboardRoute.js'
import analystRouter from './routes/analystRoute.js'

// App config
const app = express()
const PORT = process.env.PORT || 5000
connectDB()

// Middleware
app.use(cors())
app.use(express.json())

// API endpoints
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/transactions', transactionRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/analyst', analystRouter)

// Health check
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Finance Dashboard API is running' })
})

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))