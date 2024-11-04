import { useEffect, useState } from "react";
import { Channel, Message, User } from "../models/interface";
import './ChannelList.css';

interface ChannelListProps {
    channels: Channel[];
    users: User[];
    isLoggedIn: boolean;
    isGuest: boolean;
}

const ChannelList = ({ channels, users, isLoggedIn, isGuest }: ChannelListProps) => {
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMessages = async (channelId: string) => {
        setLoading(true); 
        setError(null); 
        try {
            const response = await fetch(`/api/messages/${channelId}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            } else {
                throw new Error("Failed to fetch messages");
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        if (selectedChannel) {
            fetchMessages(selectedChannel._id);
        }
    }, [selectedChannel]);

    const getUsernameById = (id: string) => {
        const user = users.find(user => user._id === id);
        return user ? user.username : "Okänd användare";
    };

    return (
        <div className="channel-layout">
            <aside className="channel-sidebar">
                <h2>Kanaler</h2>
                <ul>
                    {channels.map(channel => (
                        <li 
                            key={channel._id} 
                            onClick={() => {
                                if (isLoggedIn && (!isGuest || !channel.isLocked)) {

                                    setSelectedChannel(channel);
                                }
                            }}
                        >
                            {channel.name} 
                            {channel.isLocked ? (isLoggedIn && !isGuest ? '🔓' : '🔒') : '🔓'}
                        </li>
                    ))}
                </ul>
            </aside>

            <section className="channel-content">
                {selectedChannel ? (
                    <div>
                        <h3>{selectedChannel.name}</h3>
                        <p>Status: {selectedChannel.isLocked && isGuest ? 'Låst' : 'Olåst'}</p>
                        <h4>Meddelanden:</h4>
                        {loading ? (
                            <p>Laddar meddelanden...</p> 
                        ) : error ? (
                            <p style={{ color: 'red' }}>{error}</p> 
                        ) : (
                            <ul>
                                {messages.length > 0 ? (
                                    messages.map((message) => (
                                        <li className="msg-card" key={message._id}>
    										<div className="msg-header">
        										<strong>{getUsernameById(message.sender)}</strong>
        										<em>{new Date(message.timestamp).toLocaleString()}</em>
    										</div>
    										<div className="msg-content">
       											 {message.content}
    										</div>
										</li>
                                    ))
                                ) : (
                                    <li>Det finns inga meddelanden att visa för denna kanal.</li>
                                )}
                            </ul>
                        )}
                    </div>
                ) : (
                    <p>Välj en kanal för att visa detaljer.</p>
                )}
            </section>
        </div>
    );
};

export default ChannelList;