import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const uri = process.env.MONGODB_URL;

export default async function handler(req, res) {
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const collection = client.db('test').collection('users');

        switch (req.method) {
            case 'GET':
                const users = await collection.find().toArray();
                res.status(200).json(users);
                break;
            case 'PUT':
                const { id } = req.query;
                const { userName, role, balance, password } = req.body;

                // Check if password is provided
                if (password) {
                    // Hash the provided password
                    const hashedPassword = await bcrypt.hash(password, 10);
                    // Update user document with the new password
                    await collection.updateOne(
                        { _id: new ObjectId(id) },
                        { $set: { userName, role, balance, password: hashedPassword } }
                    );
                } else {
                    // Update user document without changing the password
                    await collection.updateOne(
                        { _id: new ObjectId(id) },
                        { $set: { userName, role, balance } }
                    );
                }

                res.status(200).json({ message: 'User updated successfully' });
                break;
            case 'DELETE':
                const userId = req.query.id;
                await collection.deleteOne({ _id: new ObjectId(userId) });
                res.status(200).json({ message: 'User deleted successfully' });
                break;
            default:
                res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await client.close();
    }
}
