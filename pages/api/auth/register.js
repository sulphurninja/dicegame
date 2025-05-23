import connectDB from "../../../utils/connectDB";
import Users from '../../../models/userModel'
import bcrypt from 'bcrypt'

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await register(req, res)
            break;
    }
}

const generateReferralCode = () => {
    // Generate a random alphanumeric referral code
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const register = async (req, res) => {
    try {
        let { userName, password, role, name, balance, referralCode } = req.body

        // Trim extra spaces from the userName
        userName = userName.trim();

        // Check if userName already exists (after trimming)
        const user = await Users.findOne({ userName });
        if (user) {
            return res.status(400).json({ err: 'Username already exists!' });
        }

        let parentUser = null;

        if (referralCode) {
            // Find the parent user by referral code
            parentUser = await Users.findOne({ referralCode });

            if (!parentUser) {
                return res.status(400).json({ err: 'Invalid referral code!' });
            }
        }

        const newUser = new Users({
            userName,
            password,
            role,
            name,
            balance,
            referralCode: generateReferralCode(), // Generate referral code for the new user
            parent: parentUser ? parentUser._id : null // Set parent reference
        });

        await newUser.save();

        res.json({ msg: "Successful Registration!", referralCode: newUser.referralCode });
    } catch (err) {
        return res.status(500).json({ err: err.message });
    }
}
