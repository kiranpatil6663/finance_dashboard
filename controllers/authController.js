import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/User.js'

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: 'User Already Exists' })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Save user
        const userData = {
            name,
            email,
            password: hashedPassword,
            role: role || 'viewer'
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.json({ success: true, token, role: user.role })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: 'User Not Found' })
        }

        if (!user.isActive) {
            return res.json({ success: false, message: 'Account Deactivated' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid Credentials' })
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.json({ success: true, token, role: user.role })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { registerUser, loginUser }