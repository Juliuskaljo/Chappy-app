import { useState } from "react";
import { Channel } from "../models/interface";
import './ChannelList.css';

const ChannelList = ({ channels, isLoggedIn, isGuest }: { channels: Channel[], isLoggedIn: boolean, isGuest: boolean }) => {
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

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
                    </div>
                ) : (
                    <p>Välj en kanal för att visa detaljer.</p>
                )}
            </section>
        </div>
    );
};

export default ChannelList;