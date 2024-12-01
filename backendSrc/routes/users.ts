import express, { Request, Response, Router } from "express";
import { getAllUser } from "../config/users.js";


const router: Router = express.Router();

// GET /api/users
router.get('/', async (req: Request, res: Response) => {
    const loggedInUserId = req.query.loggedInUserId as string;

    try {
        const allUsers = await getAllUser(loggedInUserId);
        res.json(allUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export { router };