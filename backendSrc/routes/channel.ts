import express, { Request, Response } from 'express';
import { getAllChannels } from '../config/channels.js';

const router = express.Router();

// GET /api/channels
router.get('/', async (_: Request, res: Response) => {
    try {
        const channels = await getAllChannels();
        res.json(channels);
    } catch (error) {
        console.error('Error getting channels:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export { router };