import { MongoClient } from 'mongodb';
import KYCDocument from '../../models/kycDocument';
import Users from '../../models/userModel';
import cloudinary from '../../utils/cloudinary.config';

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {});

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db('test');
        const { userName, aadharUrl, panUrl, cancelledCheckUrl, mobNo, bankingName, AccountNo, IFSCCode } = req.body;
        const user = await Users.findOne({ userName }); // Use await since findOne returns a promise

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a new KYC document
        await KYCDocument.create({
            userName,
            aadharImage: aadharUrl,
            panImage: panUrl,
            cancelledCheckImage: cancelledCheckUrl,
            mobNo,
            bankingName,
            AccountNo,
            IFSCCode,
        });

        // Update user's kycSubmitted field to true
        await Users.updateOne({ userName }, { $set: { kycSubmitted: true } });

        // Send a response indicating success
        res.status(200).json({ success: true, message: 'KYC documents uploaded successfully.' });
    } catch (error) {
        console.error('Error uploading KYC documents:', error);
        res.status(500).json({ error: error.message || 'Unable to upload KYC documents.' });
    } finally {
        await client.close();
    }
}
