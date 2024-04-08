import Users from '../../models/userModel';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db('test');
        const betsCollection = db.collection('bets');
        const fetchResultsCollection = db.collection('fetchResults');

        const { winningAmount, userName } = req.body;

        const user = await Users.findOne({ userName });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.balance += winningAmount;
        await user.save();

        return res.status(200).json({ success: true, message: 'Winning amount added to balance successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to add winning amount to balance' });
    } finally {
        await client.close();
    }
}