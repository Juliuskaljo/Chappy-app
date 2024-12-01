import { ObjectId } from 'mongodb';
import { connectToDatabase } from './database.js';

export const sendMessageToChannel = async (
	senderId: ObjectId,
	content: string,
	channelId: ObjectId
  ): Promise<ObjectId> => {
	try {
	  const db = await connectToDatabase();

	  const channel = await db.collection('channelCollection').findOne({ _id: channelId });
	  if (!channel) {
		throw new Error('Channel not found');
	  }
  
	  const user = await db.collection('users').findOne({ _id: senderId });
	  if (channel.isLocked && user?.role === 'guest') {
		throw new Error('You cannot send messages to a locked channel as a guest');
	  }
  
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