import express, { Request, Response } from 'express';
import { getAllChannels } from '../config/channels.js';
import { ObjectId } from 'mongodb';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { connectToDatabase } from '../config/database.js';
import { messageValidationSchema } from '../validation/messageValidation.js';

const router = express.Router();

router.get('/', async (_: Request, res: Response) => {
    try {
        const channels = await getAllChannels();
        res.json(channels);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch channels' });
    }
});


router.post('/send/guest', async (req: Request, res: Response) => {
    const { content, channelId } = req.body;

    const { error } = messageValidationSchema.validate(req.body);
    if (error) {
         res.status(400).json({ message: error.details[0].message });
		 return
    }

    const senderId = 'guest';

    if (!ObjectId.isValid(channelId)) {
        res.status(400).json({ message: 'Invalid channel ID' }); 
		return
    }

    try {
        const channelObjectId = new ObjectId(channelId);

        const message = {
            sender: senderId,
            channelId: channelObjectId,
            content,
            timestamp: new Date(),
            isDM: false,
        };

        const db = await connectToDatabase();
        const result = await db.collection('messages').insertOne(message);

         res.status(200).json({ messageId: result.insertedId });
		return
    } catch (error) {
        console.error('Error while sending message to channel:', error);
        res.status(500).json({ message: 'Failed to send message' }); 
		return
    }
});



router.post('/send', async (req: Request, res: Response) => {
    const { content, channelId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
         res.status(401).json({ message: 'Unauthorized' });
		 return
    }

    let decoded: JwtPayload;
    try {
        decoded = jwt.verify(token, process.env.SECRET as string) as JwtPayload;
    } catch (err) {
         res.status(403).json({ message: 'Invalid token' });
		 return
    }

    const senderId = decoded.userId;

    const { error } = messageValidationSchema.validate(req.body);
    if (error) {
         res.status(400).json({ message: error.details[0].message });
		 return
    }

    if (!ObjectId.isValid(channelId)) {
        res.status(400).json({ message: 'Invalid channel ID' });
		return 
    }

    try {
        const senderObjectId = new ObjectId(senderId);
        const channelObjectId = new ObjectId(channelId);

        const message = {
            sender: senderObjectId,
            channelId: channelObjectId,
            content,
            timestamp: new Date(),
            isDM: false,
        };

        const db = await connectToDatabase();
        const result = await db.collection('messages').insertOne(message);

         res.status(200).json({ messageId: result.insertedId });
		 return
    } catch (error) {
        console.error('Error while sending message to channel:', error);
        res.status(500).json({ message: 'Failed to send message' });
		return 
    }
});


export {router};