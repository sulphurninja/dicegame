// pages/api/rejectKyc.js

import Dataset from '../../models/kycDocument';

export default async function handler(req, res) {
  try {
    const { id } = req.body;

    // Find the KYC document by ID and delete it
    await Dataset.findByIdAndDelete(id);

    res.status(200).json({ message: 'KYC document rejected and deleted successfully.' });
  } catch (error) {
    console.error('Error rejecting KYC document:', error);
    res.status(500).json({ error: 'Unable to reject KYC document.' });
  }
}
