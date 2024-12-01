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
	userIds: ObjectId[]
}

export interface Message {
	_id?: ObjectId;
    sender: ObjectId;
    content: string;
    timestamp: Date;
    channel: ObjectId | null;
    isDM: boolean;
    receiver: ObjectId | null;
}