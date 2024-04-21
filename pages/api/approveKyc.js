// pages/api/approveKyc.js

import Dataset from '../../models/kycDocument';
import User from '../../models/userModel';

export default async function handler(req, res) {
  try {
    const { id } = req.body;

    // Find the KYC document by ID and update the approved field to true
    const updatedKycDoc = await Dataset.findByIdAndUpdate(id, { approved: true });

    // Find the user associated with the KYC document's userName
    const user = await User.findOne({ userName: updatedKycDoc.userName });

    // Update the user's kycApproved field to true
    if (user) {
      user.kycApproved = true;
      await user.save();
    } else {
      console.error('Associated user not found for KYC document:', updatedKycDoc._id);
    }

    res.status(200).json({ message: 'KYC document approved successfully.' });
  } catch (error) {
    console.error('Error approving KYC document:', error);
    res.status(500).json({ error: 'Unable to approve KYC document.' });
  }
}
