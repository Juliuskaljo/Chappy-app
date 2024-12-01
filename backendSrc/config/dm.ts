import { Db, ObjectId } from 'mongodb';
import { connectToDatabase } from './database.js';
import { Message } from '../models/interfaces.js';

export async function getDMs(userId: ObjectId | string, otherUserId: ObjectId | string): Promise<Message[]> {
    const db: Db = await connectToDatabase();

    const querySender = typeof userId === 'string' ? new ObjectId(userId) : userId;
    const queryReceiver = typeof otherUserId === 'string' ? new ObjectId(otherUserId) : otherUserId;

    try {
        const messages = await db.collection<Message>('messageCollection')
            .find({
                isDM: true,
                $or: [
                    { sender: querySender, receiver: queryReceiver },
                    { sender: queryReceiver, receiver: querySender }
                ],
            })
            .toArray();

        return messages;
    } catch (error) {
        console.error('Error fetching DMs:', error);
        throw new Error('Could not fetch DMs');
    }
}
