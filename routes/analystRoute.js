import express from 'express'
import { getInsights } from '../controllers/analystController.js'
import authAnalyst from '../middleware/authAnalyst.js'

const analystRouter = express.Router()

analystRouter.get('/insights', authAnalyst, getInsights)

export default analystRouter