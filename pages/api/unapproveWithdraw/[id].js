// pages/api/approveRequest/[id].js

import Dataset from '../../../models/withdrawRequest';
import Users from '../../../models/userModel';

export default async function handler(req, res) {
  const { method } = req;

  if (method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed', message: 'Only PUT requests are allowed.' });
  }

  try {
    const { id } = req.query;

    // Find the request by ID
    const request = await Dataset.findById(id);

    if (!request) {
      return res.status(404).json({ error: 'Not Found', message: 'Request not found.' });
    }

    // Toggle the approved field
    request.unapproved = !request.unapproved;

    // Save the updated request
    await request.save();

    // Fetch the user associated with the request
    const user = await Users.findOne({ userName: request.userName });

    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: 'User not found.' });
    }

    // Add the requestedAmount to the user's balance
    user.balance += request.requestedAmount;

    // Save the updated user
    await user.save();

    res.status(200).json({ success: true, message: `Request ${request.unapproved ? 'approved' : 'unapproved'} successfully.` });
  } catch (error) {
    console.error('Error toggling approval:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to toggle approval status.' });
  }
}
