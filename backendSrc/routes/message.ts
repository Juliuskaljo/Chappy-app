import express, { Request, Response } from 'express';
import { getMessagesByChannel } from '../config/messages.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.get('/:channelId', async (req: Request, res: Response) => {
    const { channelId } = req.params;

    try {
        if (!ObjectId.isValid(channelId)) {
             res.status(400).json({ message: 'Invalid channel ID' });
			 return
        }

        const channelObjectId = new ObjectId(channelId);
        const messages = await getMessagesByChannel(channelObjectId);
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export { router };