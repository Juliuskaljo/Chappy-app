import { Collection, Db, ObjectId, WithId } from "mongodb";
import { User } from "../models/interfaces";
import { connectToDatabase } from "./database.js";

export type UserId = ObjectId
async function getAllUser(): Promise<WithId<User>[]> {
    const db: Db = await connectToDatabase();
    const col: Collection<User> = db.collection<User>('userCollection');

    const result: WithId<User>[] = await col.find({}).toArray();
    return result;
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