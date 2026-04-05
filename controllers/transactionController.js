import transactionModel from '../models/Transaction.js'
import auditLogModel from '../models/AuditLog.js'

const createTransaction = async (req, res) => {
    try {
        const { amount, type, category, date, notes } = req.body

        if (!amount || !type || !category || !date) {
            return res.status(400).json({ success: false, message: 'Missing Details' })
        }

        if (amount <= 0) {
            return res.status(400).json({ success: false, message: 'Amount must be greater than zero' })
        }

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ success: false, message: 'Type must be income or expense' })
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

        await auditLogModel.create({
            performedBy: req.userId,
            action: 'CREATE_TRANSACTION',
            targetId: transaction._id,
            details: `Created ${type} of ${amount}`,
            ipAddress: req.ip
        })

        res.status(201).json({ success: true, message: 'Transaction Created', transaction })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const getTransactions = async (req, res) => {
    try {
        const { type, category, startDate, endDate, search, page = 1, limit = 10 } = req.query

        const filter = { isDeleted: false }

        if (type) filter.type = type
        if (category) filter.category = category
        if (search) filter.notes = { $regex: search, $options: 'i' }
        if (startDate || endDate) {
            filter.date = {}
            if (startDate) filter.date.$gte = new Date(startDate)
            if (endDate) filter.date.$lte = new Date(endDate)
        }

        const skip = (page - 1) * limit
        const total = await transactionModel.countDocuments(filter)
        const transactions = await transactionModel
            .find(filter)
            .populate('createdBy', 'name email role')
            .sort({ date: -1 })
            .skip(skip)
            .limit(Number(limit))

        res.status(200).json({
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
        res.status(500).json({ success: false, message: error.message })
    }
}

const updateTransaction = async (req, res) => {
    try {
        const { transactionId, amount, type, category, date, notes } = req.body

        if (!transactionId) {
            return res.status(400).json({ success: false, message: 'Transaction ID Required' })
        }

        if (amount && amount <= 0) {
            return res.status(400).json({ success: false, message: 'Amount must be greater than zero' })
        }

        if (type && !['income', 'expense'].includes(type)) {
            return res.status(400).json({ success: false, message: 'Type must be income or expense' })
        }

        const transaction = await transactionModel.findById(transactionId)
        if (!transaction || transaction.isDeleted) {
            return res.status(404).json({ success: false, message: 'Transaction Not Found' })
        }

        const updatedTransaction = await transactionModel.findByIdAndUpdate(
            transactionId,
            { amount, type, category, date, notes },
            { returnDocument: 'after' }
        )

        await auditLogModel.create({
            performedBy: req.userId,
            action: 'UPDATE_TRANSACTION',
            targetId: transactionId,
            details: `Updated transaction ${transactionId}`,
            ipAddress: req.ip
        })

        res.status(200).json({ success: true, message: 'Transaction Updated', transaction: updatedTransaction })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const deleteTransaction = async (req, res) => {
    try {
        const { transactionId } = req.body

        if (!transactionId) {
            return res.status(400).json({ success: false, message: 'Transaction ID Required' })
        }

        const transaction = await transactionModel.findById(transactionId)
        if (!transaction || transaction.isDeleted) {
            return res.status(404).json({ success: false, message: 'Transaction Not Found' })
        }

        await transactionModel.findByIdAndUpdate(transactionId, { isDeleted: true })

        await auditLogModel.create({
            performedBy: req.userId,
            action: 'DELETE_TRANSACTION',
            targetId: transactionId,
            details: `Soft deleted transaction ${transactionId}`,
            ipAddress: req.ip
        })

        res.status(200).json({ success: true, message: 'Transaction Deleted' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export { createTransaction, getTransactions, updateTransaction, deleteTransaction }