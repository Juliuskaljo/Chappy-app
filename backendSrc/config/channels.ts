import { Db, ObjectId } from 'mongodb';
import { connectToDatabase } from './database.js';
import { Channel } from '../models/interfaces.js';

export async function getAllChannels(): Promise<Channel[]> {
	try {
	  const db: Db = await connectToDatabase();
	  const channels = await db.collection<Channel>('channelCollection').find({}).toArray();
	  return channels;
	} catch (error) {
	  console.error('Error fetching channels:', error);
	  throw new Error('Could not fetch channels');
	}
  }

export const sendMessageToChannel = async (
  senderId: ObjectId,
  content: string,
  channelId: ObjectId
): Promise<ObjectId> => {
  try {
    const db = await connectToDatabase();

    const message = {
      sender: senderId,
      content: content,
      channelId: channelId,
      timestamp: new Date(),
      isDM: false,
    };

    const result = await db.collection('messages').insertOne(message);

    if (!result.insertedId) {
      throw new Error('Failed to insert message into database');
    }

    return result.insertedId;
  } catch (error) {
    console.error('Error in sendMessageToChannel:', error);
    throw error;
  }
};
