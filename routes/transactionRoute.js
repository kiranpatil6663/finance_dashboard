import express from 'express'
import {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
} from '../controllers/transactionController.js'
import authAdmin from '../middleware/authAdmin.js'
import authViewer from '../middleware/authViewer.js'

const transactionRouter = express.Router()

// Any logged in user can view
transactionRouter.get('/list', authViewer, getTransactions)

// Only admin can create, update, delete
transactionRouter.post('/create', authAdmin, createTransaction)
transactionRouter.post('/update', authAdmin, updateTransaction)
transactionRouter.post('/delete', authAdmin, deleteTransaction)

export default transactionRouter