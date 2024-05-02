import connectDB from "../../../utils/connectDB";
import Users from '../../../models/userModel'
import bcrypt from 'bcrypt'
import { createAccessToken, createRefreshToken } from '../../../utils/generateToken'

connectDB()

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await login(req, res)
            break;
    }
}

const login = async (req, res) => {
    try {
        const { userName, password } = req.body

        const user = await Users.findOne({ userName })

        if (!user) {
            return res.status(400).json({ err: 'You are not registered!' })
        }

        // Check if the user is deactivated
        if (user.isDeleted) {
            return res.status(400).json({ err: 'Your account has been deactivated. Please contact support for assistance.' })
        }

        const access_token = createAccessToken({ id: user._id })
        const refresh_token = createRefreshToken({ id: user._id })

        res.json({
            msg: "Login Successful!!",
            refresh_token,
            access_token,
            user: {
                userName: user.userName,
                balance: user.balance,
                name: user.name,
                role: user.role,
                root: user.root,
                referralCode: user.referralCode,
                winHistory: user.winHistory,
                referralWinnings: user.referralWinnings,
                kycApproved: user.kycApproved,
                kycSubmitted: user.kycSubmitted,
            }
        })

    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}
