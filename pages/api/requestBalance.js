import { MongoClient } from 'mongodb';
import Request from '../../models/request';

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {});

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db('test');
    // const messagesCollection = db.collection('messages');
    const { message, requestedAmount, userName, paymentProofUrl } = req.body;

    // Save the message and requested amount to the database
    await Request.create({ message, requestedAmount, userName, paymentProofUrl });

    // Send a response indicating success
    res.status(200).json({ success: true, message: 'Request received successfully.' });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Unable to process the request.' });
  } finally {
    await client.close();
  }
}
