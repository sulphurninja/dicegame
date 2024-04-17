// pages/api/approveRequest/[id].js

import Dataset from '../../../models/request';

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
    request.approved = !request.approved;

    // Save the updated request
    await request.save();

    res.status(200).json({ success: true, message: `Request ${request.approved ? 'approved' : 'unapproved'} successfully.` });
  } catch (error) {
    console.error('Error toggling approval:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Unable to toggle approval status.' });
  }
}
