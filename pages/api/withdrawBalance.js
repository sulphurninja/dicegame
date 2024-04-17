import { MongoClient } from 'mongodb';
import Withdraw from '../../models/withdrawRequest'; // Import the Withdraw model
import User from '../../models/userModel'; // Import the User model

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {});

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db('test');
        const { message, requestedAmount, userName } = req.body;

        // Find the user
        const user = await User.findOne({ userName });
        if (!user) {
            throw new Error('User not found');
        }

        // Deduct the requestedAmount from the user's balance, ensuring it doesn't go below zero
        const updatedBalance = Math.max(user.balance - requestedAmount, 0);

        // Create a new Withdraw document
        await Withdraw.create({ message, requestedAmount, userName });

        // Update the user's balance
        await User.updateOne({ userName }, { $set: { balance: updatedBalance } });

        // Send a response indicating success
        res.status(200).json({ success: true, message: 'Withdraw request processed successfully.' });
    } catch (error) {
        console.error('Error processing withdraw request:', error);
        res.status(500).json({ error: error.message || 'Unable to process the withdraw request.' });
    } finally {
        await client.close();
    }
}
