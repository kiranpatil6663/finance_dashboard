import jwt from 'jsonwebtoken'
import userModel from '../models/User.js'

const authViewer = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized, Login Again' })
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(token_decode.id)

        if (!user) {
            return res.json({ success: false, message: 'User Not Found' })
        }
        if (!user.isActive) {
            return res.json({ success: false, message: 'Account Deactivated' })
        }

        req.userId = token_decode.id
        req.userRole = user.role
        next()

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authViewer