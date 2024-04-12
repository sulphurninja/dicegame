import Users from '../../models/userModel';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {});

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db('test');
        const usersCollection = db.collection('users');

        const { userName } = req.body;

        const user = await usersCollection.findOne({ userName });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    } finally {
        await client.close();
    }
}
