import transactionModel from '../models/Transaction.js'

// API to get dashboard summary
const getDashboardSummary = async (req, res) => {
    try {
        const filter = { isDeleted: false }

        const transactions = await transactionModel.find(filter)

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0)

        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)

        const netBalance = totalIncome - totalExpense
        const savingsRate = totalIncome > 0
            ? ((netBalance / totalIncome) * 100).toFixed(2)
            : 0

        res.json({
            success: true,
            summary: {
                totalIncome,
                totalExpense,
                netBalance,
                savingsRate: `${savingsRate}%`
            }
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get category wise totals
const getCategoryTotals = async (req, res) => {
    try {
        const categories = await transactionModel.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: { category: '$category', type: '$type' },
                    total: { $sum: '$amount' }
                }
            },
            {
                $project: {
                    category: '$_id.category',
                    type: '$_id.type',
                    total: 1,
                    _id: 0
                }
            },
            { $sort: { total: -1 } }
        ])

        res.json({ success: true, categories })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get monthly trends
const getMonthlyTrends = async (req, res) => {
    try {
        const trends = await transactionModel.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                        type: '$type'
                    },
                    total: { $sum: '$amount' }
                }
            },
            {
                $project: {
                    year: '$_id.year',
                    month: '$_id.month',
                    type: '$_id.type',
                    total: 1,
                    _id: 0
                }
            },
            { $sort: { year: 1, month: 1 } }
        ])

        res.json({ success: true, trends })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get recent transactions
const getRecentActivity = async (req, res) => {
    try {
        const recent = await transactionModel
            .find({ isDeleted: false })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(5)

        res.json({ success: true, recent })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// API to get weekly trends
const getWeeklyTrends = async (req, res) => {
    try {
        const trends = await transactionModel.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        week: { $week: '$date' },
                        type: '$type'
                    },
                    total: { $sum: '$amount' }
                }
            },
            {
                $project: {
                    year: '$_id.year',
                    week: '$_id.week',
                    type: '$_id.type',
                    total: 1,
                    _id: 0
                }
            },
            { $sort: { year: 1, week: 1 } }
        ])

        res.status(200).json({ success: true, trends })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}
export { 
    getDashboardSummary, 
    getCategoryTotals, 
    getMonthlyTrends, 
    getWeeklyTrends,
    getRecentActivity 
}