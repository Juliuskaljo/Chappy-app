import { ObjectId } from "mongodb";

export interface User {
    username: string;
    password: string;
    role: "guest" | "user";
	_id?: ObjectId;
}

export interface Channel {
    name: string;
    isLocked: boolean;
    messages: ObjectId[];
}

export interface Message {
    _id: ObjectId;
    sender: string;
    content: string;
    timestamp: Date;
    channel: ObjectId;
    isDM: boolean;
    receiver?: ObjectId | null;
}