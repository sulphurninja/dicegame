import { MongoClient } from 'mongodb';
import User from '../../models/userModel';

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {});

export default async function handler(req, res) {
    try {
        const { userName } = req.query;

        const parentUser = await User.findOne({ userName });
        if (!parentUser) {
            return res.status(404).json({ success: false, message: 'Parent user not found' });
        }

        // Find child users of the parent
        const childUsers = await User.find({ parent: parentUser._id }).exec();

        // Get parent's winHistory
        const parentWinHistory = parentUser.winHistory;

        // Iterate over each child user to check if their userName exists in the parent's winHistory
        const childUsersWithWinnings = childUsers.map(childUser => {
            // Check if the child user's userName exists in the parent's winHistory
            const childUserWinning = parentWinHistory.find(entry => entry.from === childUser.userName);
            // If found, return the amount, otherwise return 0
            const amount = childUserWinning ? childUserWinning.amount : 0;

            // Return the child user along with the amount won
            return {
                _id: childUser._id,
                name: childUser.name,
                userName: childUser.userName,
                amountWon: amount
            };
        });

        return res.status(200).json({ success: true, data: childUsersWithWinnings });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
