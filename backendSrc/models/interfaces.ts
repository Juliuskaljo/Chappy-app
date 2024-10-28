import { ObjectId } from "mongodb";

export interface User {
    username: string;
    password: string;
    role: "guest" | "user"
    channels: ObjectId[];
	_id?: ObjectId;
}

export interface Channel {
    name: string;
    isLocked: boolean;
    messages: ObjectId[];
}

export interface Message {
    sender: ObjectId;
    content: string;
    timestamp: Date;
    channel: ObjectId;
    isPrivate: boolean;
}