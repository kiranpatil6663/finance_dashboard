import transactionModel from '../models/Transaction.js'
import auditLogModel from '../models/AuditLog.js'

// API to create transaction (admin only)
const createTransaction = async (req, res) => {
    try {
        const { amount, type, category, date, notes } = req.body

        if (!amount || !type || !category || !date) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        const transactionData = {
            amount,
            type,
            category,
            date,
            notes,
            createdBy: req.userId
        }

        const newTransaction = new transactionModel(transactionData)
        const transaction = await newTransaction.save()

        // Audit log
        await auditLogModel.create({
            performedBy: req.userId,
            action: 'CREATE_TRANSACTION',
            targetId: transaction._id,
            details: `Created ${type} of ${amount}`,
            ipAddress: req.ip
        })

        res.json({ success: true, message: 'Transaction Created', transaction })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all transactions with filters
const getTransactions = async (req, res) => {
    try {
        const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query

        // Build filter object
        const filter = { isDeleted: false }

        if (type) filter.type = type
        if (category) filter.category = category
        if (startDate || endDate) {
            filter.date = {}
            if (startDate) filter.date.$gte = new Date(startDate)
            if (endDate) filter.date.$lte = new Date(endDate)
        }

        // Pagination
        const skip = (page - 1) * limit
        const total = await transactionModel.countDocuments(filter)
        const transactions = await transactionModel
            .find(filter)
            .populate('createdBy', 'name email role')
            .sort({ date: -1 })
            .skip(skip)
            .limit(Number(limit))

        res.json({
            success: true,
            transactions,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update transaction (admin only)
const updateTransaction = async (req, res) => {
    try {
        const { transactionId, amount, type, category, date, notes } = req.body

        if (!transactionId) {
            return res.json({ success: false, message: 'Transaction ID Required' })
        }

        const transaction = await transactionModel.findById(transactionId)
        if (!transaction || transaction.isDeleted) {
            return res.json({ success: false, message: 'Transaction Not Found' })
        }

        const updatedTransaction = await transactionModel.findByIdAndUpdate(
            transactionId,
            { amount, type, category, date, notes },
            { new: true }
        )

        // Audit log
        await auditLogModel.create({
            performedBy: req.userId,
            action: 'UPDATE_TRANSACTION',
            targetId: transactionId,
            details: `Updated transaction ${transactionId}`,
            ipAddress: req.ip
        })

        res.json({ success: true, message: 'Transaction Updated', transaction: updatedTransaction })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to soft delete transaction (admin only)
const deleteTransaction = async (req, res) => {
    try {
        const { transactionId } = req.body

        if (!transactionId) {
            return res.json({ success: false, message: 'Transaction ID Required' })
        }

        const transaction = await transactionModel.findById(transactionId)
        if (!transaction || transaction.isDeleted) {
            return res.json({ success: false, message: 'Transaction Not Found' })
        }

        await transactionModel.findByIdAndUpdate(transactionId, { isDeleted: true })

        // Audit log
        await auditLogModel.create({
            performedBy: req.userId,
            action: 'DELETE_TRANSACTION',
            targetId: transactionId,
            details: `Soft deleted transaction ${transactionId}`,
            ipAddress: req.ip
        })

        res.json({ success: true, message: 'Transaction Deleted' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { createTransaction, getTransactions, updateTransaction, deleteTransaction }