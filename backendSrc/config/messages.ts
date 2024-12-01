import { Db, ObjectId } from 'mongodb';
import { connectToDatabase } from './database.js';
import { Message } from '../models/interfaces.js';

export async function getMessagesByChannel(channelId: ObjectId): Promise<Message[]> {
    const db: Db = await connectToDatabase();
    
    const messages = await db.collection<Message>('messages')
        .find({ channelId })  
        .toArray();
    
    return messages;
}
