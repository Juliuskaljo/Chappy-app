import express, { Request, Response, Router } from "express";
import { WithId } from "mongodb";
import { User } from "../models/interfaces.js";
import { getAllUser } from "../config/users.js";

const router: Router = express.Router();

// GET /api/users
router.get('/', async (_: Request, res: Response<WithId<User>[]>) => {
    try {
        const allUsers: WithId<User>[] = await getAllUser();
        res.send(allUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.sendStatus(500);
    }
});

export { router };