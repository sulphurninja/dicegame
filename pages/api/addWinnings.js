import Users from '../../models/userModel';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {});

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db('test');
        const betsCollection = db.collection('bets');
        const fetchResultsCollection = db.collection('fetchResults');

        const { winningAmounts, userName } = req.body;

        const user = await Users.findOne({ userName });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let totalWinningAmount = 0;
        let parentUser = null;

        if (user.parent) {
            parentUser = await Users.findById(user.parent);
        }

        // Add each winning amount to user's balance and parent user's referral winnings
        winningAmounts.forEach(amount => {
            user.balance += amount;
            totalWinningAmount += amount;

            // Calculate referral winnings for the parent user based on 4:1 ratio
            const parentWinnings = amount / 4;
            const userWinnings = amount - parentWinnings;

            // Update parent user's referral winnings and win history
            if (parentUser) {
                parentUser.referralWinnings += parentWinnings;
                parentUser.balance += parentWinnings;
                parentUser.winHistory.push({ from: user.userName, amount: parentWinnings });
            }
        });

        // Save user and parent user changes
        await user.save();
        if (parentUser) {
            await parentUser.save();
        }

        return res.status(200).json({ success: true, message: 'Total winning amount added to balance successfully', totalWinningAmount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to add winning amounts to balance' });
    } finally {
        await client.close();
    }
}
