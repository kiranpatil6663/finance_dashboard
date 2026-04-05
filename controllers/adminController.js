import userModel from '../models/User.js'
import auditLogModel from '../models/AuditLog.js'

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password')
        res.status(200).json({ success: true, users })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const updateUserRole = async (req, res) => {
    try {
        const { userId, role } = req.body

        if (!userId || !role) {
            return res.status(400).json({ success: false, message: 'Missing Details' })
        }

        const validRoles = ['admin', 'analyst', 'viewer']
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid Role' })
        }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User Not Found' })
        }

        await userModel.findByIdAndUpdate(userId, { role })

        await auditLogModel.create({
            performedBy: req.userId,
            action: 'UPDATE_USER_ROLE',
            targetId: userId,
            details: `Role updated to ${role}`,
            ipAddress: req.ip
        })

        res.status(200).json({ success: true, message: 'User Role Updated' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({ success: false, message: 'Missing Details' })
        }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User Not Found' })
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { isActive: !user.isActive },
            { returnDocument: 'after' }
        )

        await auditLogModel.create({
            performedBy: req.userId,
            action: updatedUser.isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
            targetId: userId,
            details: `User ${updatedUser.isActive ? 'activated' : 'deactivated'}`,
            ipAddress: req.ip
        })

        res.status(200).json({
            success: true,
            message: `User ${updatedUser.isActive ? 'Activated' : 'Deactivated'}`
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export { getAllUsers, updateUserRole, toggleUserStatus }