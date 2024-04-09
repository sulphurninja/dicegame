import Users from '../../models/userModel';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {

});

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db('test');
        const betsCollection = db.collection('bets');
        const fetchResultsCollection = db.collection('fetchResults');

        const { winningAmounts, userName } = req.body; // Change winningAmount to winningAmounts
        console.log(winningAmounts, 'winningamounts'); // Correct console log

        const user = await Users.findOne({ userName });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let totalWinningAmount = 0;
        // Add each winning amount to user's balance
        winningAmounts.forEach(amount => {
            user.balance += amount;
            totalWinningAmount += amount; // Calculate total winning amount
        });

        await user.save();

        return res.status(200).json({ success: true, message: 'Total winning amount added to balance successfully', totalWinningAmount }); // Correct response message
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to add winning amounts to balance' }); // Correct error message
    } finally {
        await client.close();
    }
}
