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
                const { userName, role, balance, password, isDeleted } = req.body;

                if (isDeleted !== undefined) {
                    // Handle user activation and deactivation
                    await collection.updateOne(
                        { _id: new ObjectId(id) },
                        { $set: { isDeleted } }
                    );

                    if (isDeleted === false) {
                        res.status(200).json({ message: 'User activated successfully' });
                    } else {
                        res.status(200).json({ message: 'User deactivated successfully' });
                    }
                } else {
                    // Handle user update with other fields
                    if (password) {
                        await collection.updateOne(
                            { _id: new ObjectId(id) },
                            { $set: { userName, role, balance, password } }
                        );
                    } else {
                        await collection.updateOne(
                            { _id: new ObjectId(id) },
                            { $set: { userName, role, balance } }
                        );
                    }

                    res.status(200).json({ message: 'User updated successfully' });
                }
                break;

            // Inside the DELETE case in your API handler
            case 'DELETE':
                const userId = req.query.id;
                await collection.updateOne(
                    { _id: new ObjectId(userId) },
                    { $set: { isDeleted: true } }
                );
                res.status(200).json({ message: 'User soft deleted successfully' });
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
