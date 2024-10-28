import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
    if (db) {
        return db;
    }

    const con: string | undefined = process.env.CONNECTION_STRING;
    if (!con) {
        throw new Error('ERROR: Connection string not found!');
    }

    try {
        client = new MongoClient(con);
        await client.connect();
        db = client.db('ChappyDB');
        console.log('Successfully connected to ChappyDB');
        return db;
    } catch (error: any) {
        console.log('Error connecting to database:', error.message);
        throw error;
    }
}

export async function disconnectFromDatabase(): Promise<void> {
    if (client) {
        await client.close();
        console.log('Database connection closed.');
        client = null;
        db = null;
    }
}