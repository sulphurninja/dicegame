// pages/api/getRequests.js

import Dataset from '../../models/request';

export default async function handler(req, res) {
  try {
    const requests = await Dataset.find({ approved: false });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Unable to fetch requests.' });
  }
}
