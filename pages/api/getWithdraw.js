// pages/api/getWithdraw.js

import DatasetWithdraw from '../../models/withdrawRequest';
import DatasetKYC from '../../models/kycDocument'; // Import the KYC model

export default async function handler(req, res) {
  try {
    // Fetch withdrawal requests
    const requests = await DatasetWithdraw.find({ approved: false });

    // Extract unique user names from the withdrawal requests
    const userNames = requests.map(request => request.userName);

    // Fetch KYC information associated with each unique user
    const kycPromises = userNames.map(userName => DatasetKYC.findOne({ userName }));

    // Await all KYC queries
    const kycs = await Promise.all(kycPromises);

    // Construct the response object including both withdrawal requests and KYC information
    const responseData = {
      requests: requests,
      kyc: kycs
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Unable to fetch requests.' });
  }
}
