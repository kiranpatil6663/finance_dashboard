import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    type: { 
        type: String, 
        enum: ['income', 'expense'], 
        required: true 
    },
    category: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

const transactionModel = mongoose.models.transaction || mongoose.model('transaction', transactionSchema)

export default transactionModel