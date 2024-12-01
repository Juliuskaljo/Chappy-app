import { Collection, Db, ObjectId, WithId } from "mongodb";
import { User } from "../models/interfaces";
import { connectToDatabase } from "./database.js";

async function getAllUser(loggedInUserId?: string): Promise<WithId<User>[]> {
    const db: Db = await connectToDatabase();
    const col = db.collection<User>('userCollection');

    const query = loggedInUserId ? { _id: { $ne: new ObjectId(loggedInUserId) } } : {};
    return await col.find(query).toArray();
}

async function validateUser(username: string, password: string): Promise<ObjectId | null> {
    const db: Db = await connectToDatabase();
    const col: Collection<User> = db.collection<User>('userCollection');

    const matchingUser = await col.findOne({ username });

    if (matchingUser && matchingUser.password === password) {
        return matchingUser._id;
    }
    return null;
}

async function getUserData(userId: ObjectId): Promise<User | null> {
    const db: Db = await connectToDatabase();
    const col: Collection<User> = db.collection<User>('userCollection');

    const user = await col.findOne({ _id: userId });
    return user || null;
}

export { getAllUser, validateUser, getUserData };