import { MongoClient } from 'mongodb';
import User from '../../models/userModel';

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {});

export default async function handler(req, res) {
    try {

        const { userName } = req.query;

        const parentUser = await User.findOne({ userName });
        if (!parentUser) {
            return res.status(404).json({ success: false, message: 'Parent user not found' });
        }

        const childUsers = await User.find({ parent: parentUser._id }).exec();

        return res.status(200).json({ success: true, data: childUsers });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}