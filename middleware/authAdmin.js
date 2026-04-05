import jwt from 'jsonwebtoken'
import userModel from '../models/User.js'

const authAdmin = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not Authorized, Login Again' })
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(token_decode.id)

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access Denied, Admins Only' })
        }
        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account Deactivated' })
        }

        req.userId = token_decode.id
        req.userRole = 'admin'
        next()

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export default authAdmin