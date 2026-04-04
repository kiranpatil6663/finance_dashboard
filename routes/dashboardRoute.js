import express from 'express'
import {
    getDashboardSummary,
    getCategoryTotals,
    getMonthlyTrends,
    getRecentActivity
} from '../controllers/dashboardController.js'
import authViewer from '../middleware/authViewer.js'

const dashboardRouter = express.Router()

dashboardRouter.get('/summary', authViewer, getDashboardSummary)
dashboardRouter.get('/categories', authViewer, getCategoryTotals)
dashboardRouter.get('/trends', authViewer, getMonthlyTrends)
dashboardRouter.get('/recent', authViewer, getRecentActivity)

export default dashboardRouter