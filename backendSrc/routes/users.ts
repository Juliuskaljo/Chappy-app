import express, { Request, Response, Router } from "express";
import { Db, ObjectId, WithId } from "mongodb";
import { User } from "../models/interfaces.js";
import { getAllUser } from "../config/users.js";
import { connectToDatabase } from "../config/database.js";

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


export async function getUserById(userId: ObjectId) {
    const db: Db = await connectToDatabase();
    return await db.collection('userCollection').findOne({ _id: userId }); // Anta att du har en 'usersCollection'
}

export { router };