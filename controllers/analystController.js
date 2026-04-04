import transactionModel from '../models/Transaction.js'

// API to get insights
const getInsights = async (req, res) => {
    try {
        // Highest spending category
        const highestSpending = await transactionModel.aggregate([
            { $match: { isDeleted: false, type: 'expense' } },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { total: -1 } },
            { $limit: 1 }
        ])

        // Highest income category
        const highestIncome = await transactionModel.aggregate([
            { $match: { isDeleted: false, type: 'income' } },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { total: -1 } },
            { $limit: 1 }
        ])

        // Average transaction amount
        const avgTransaction = await transactionModel.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: '$type',
                    average: { $avg: '$amount' }
                }
            }
        ])

        // Total transactions count
        const totalCount = await transactionModel.countDocuments({
            isDeleted: false
        })

        res.json({
            success: true,
            insights: {
                highestSpendingCategory: highestSpending[0] || null,
                highestIncomeCategory: highestIncome[0] || null,
                averageTransactions: avgTransaction,
                totalTransactions: totalCount
            }
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { getInsights }
