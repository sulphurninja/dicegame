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

    const { numberBets, totalAmount, userName } = req.body;

    const user = await Users.findOne({ userName });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.balance < totalAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Get the current draw time
    const currentDrawTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    // Fetch the winning number for the current draw time
    const fetchResult = await fetchResultsCollection.findOne({ drawTime: currentDrawTime });
    if (!fetchResult) {
      return res.status(404).json({ error: 'Winning number not found for current draw time' });
    }
    const winningNumber = fetchResult.couponNum;

    // Calculate winning amount
    let winningAmount = 0;
    for (const [number, amount] of Object.entries(numberBets)) {
      if (parseInt(number) === winningNumber) {
        winningAmount += 4 * amount;
      }
    }

    // Insert bet into bets collection
    const result = await betsCollection.insertOne({ numberBets, totalAmount, userName, createdAt: new Date() });

    // Deduct totalAmount from user balance
    user.balance -= totalAmount;
    await user.save();

    // Return response with winningAmount but don't update user's balance yet
    return res.status(200).json({ success: true, data: result, balance: user.balance, winningAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to connect to database' });
  } finally {
    await client.close();
  }
};
