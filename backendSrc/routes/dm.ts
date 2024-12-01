import express, { Request, Response } from 'express';
import { connectToDatabase } from '../config/database.js';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const router = express.Router();

interface JwtPayload {
    userId: string;
}

// Skicka meddelande
router.post('/dm/send', async (req: Request, res: Response) => {
    const { content, receiverId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    let decoded: JwtPayload;
    try {
        decoded = jwt.verify(token, process.env.SECRET as string) as JwtPayload;
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
        return;
    }

    const senderId = decoded.userId;

    if (!ObjectId.isValid(receiverId)) {
        res.status(400).json({ message: 'Invalid receiver ID' });
        return;
    }

    try {
        const senderObjectId = new ObjectId(senderId);
        const receiverObjectId = new ObjectId(receiverId);

        const message = {
            sender: senderObjectId,
            receiver: receiverObjectId,
            content,
            timestamp: new Date(),
            isDM: true,
        };

        const db = await connectToDatabase();
        const result = await db.collection('messages').insertOne(message);

        res.status(200).json({ messageId: result.insertedId });
    } catch (error) {
        console.error('Error while sending message:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

// Hämta DM mellan två användare
router.get('/dm/:receiverId', async (req: Request, res: Response) => {
    const { receiverId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    let decoded: JwtPayload;
    try {
        decoded = jwt.verify(token, process.env.SECRET as string) as JwtPayload;
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
        return;
    }

    const senderId = decoded.userId;

    if (!ObjectId.isValid(receiverId)) {
        res.status(400).json({ message: 'Invalid receiver ID' });
        return;
    }

    try {
        const db = await connectToDatabase();

        const messages = await db.collection('messages').find({
            isDM: true,
            $or: [
                { sender: new ObjectId(senderId), receiver: new ObjectId(receiverId) },
                { sender: new ObjectId(receiverId), receiver: new ObjectId(senderId) },
            ],
        }).sort({ timestamp: 1 }).toArray();

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export { router };
