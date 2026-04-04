import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema({
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    action: { type: String, required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: String },
    ipAddress: { type: String }
}, { timestamps: true })

const auditLogModel = mongoose.models.auditlog || mongoose.model('auditlog', auditLogSchema)

export default auditLogModel
