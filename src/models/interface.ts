

export interface User {
    username: string;
    password: string;
    role: "guest" | "user"
    channels: string[];
}

export interface Channel {
    name: string;
    isLocked: boolean;
    messages: string[];
	_id: string
}

export interface Message {
    sender: string;
    content: string;
    timestamp: Date;
    channel: string;
    isPrivate: boolean;
}