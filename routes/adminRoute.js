import express from 'express'
import { getAllUsers, updateUserRole, toggleUserStatus } from '../controllers/adminController.js'
import authAdmin from '../middleware/authAdmin.js'

const adminRouter = express.Router()

adminRouter.get('/users', authAdmin, getAllUsers)
adminRouter.post('/update-role', authAdmin, updateUserRole)
adminRouter.post('/toggle-status', authAdmin, toggleUserStatus)

export default adminRouter