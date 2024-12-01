import { ObjectId } from 'mongodb';
import { connectToDatabase } from './database.js';

export const sendMessage = async (
  senderId: ObjectId,
  content: string,
  channelId: ObjectId | null,
  receiverId: ObjectId
): Promise<ObjectId> => {
  try {
    const db = await connectToDatabase();

    const message = {
      sender: senderId,
      receiver: receiverId,
      content: content,
      channelId: channelId,
      timestamp: new Date(),
      isDM: true,
    };

    const result = await db.collection('messageCollection').insertOne(message);

    if (!result.insertedId) {
      throw new Error('Failed to insert message into database');
    }

    return result.insertedId;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
};
