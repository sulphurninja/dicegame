import Users from '../../models/userModel';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {});

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db('test');
    const betsCollection = db.collection('bets');

    const { userName } = req.body;

    const user = await Users.findOne({ userName });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find all bets placed by the user
    const userBets = await betsCollection.find({ userName }).toArray();

    return res.status(200).json({ success: true, bets: userBets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch user bets' });
  } finally {
    await client.close();
  }
}
