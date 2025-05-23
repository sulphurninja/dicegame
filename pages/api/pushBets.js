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

    const { numberBets, totalAmount, userName, winningNumber } = req.body;

    const user = await Users.findOne({ userName });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.balance < totalAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Get the current date
    const currentDate = new Date();

    // Format the current draw time
    const currentDrawTime = currentDate.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    console.log(currentDrawTime, 'current draw time')

   

    // Calculate winning amount
    let winningAmount = 0;
    for (const [number, amount] of Object.entries(numberBets)) {
      if (parseInt(number) === winningNumber) {
        winningAmount += 4 * amount;
      }
    }

    // Insert bet into bets collection
    const result = await betsCollection.insertOne({ numberBets, totalAmount, userName, createdAt: currentDate });

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
