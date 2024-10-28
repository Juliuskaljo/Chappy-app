import { useState } from "react";
import { Channel } from "../models/interface";

const ChannelList = ({ channels }: { channels: Channel[] }) => {
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

    return (
        <div>
            <h2>Chatkanaler</h2>
            <ul>
                {channels.map(channel => (
                    <li key={channel._id} onClick={() => setSelectedChannel(channel)}>
                        {channel.name} {channel.isLocked ? '(Locked)' : '(Unlocked)'}
                    </li>
                ))}
            </ul>

            {selectedChannel && (
                <div>
                    <h3> {selectedChannel.name}</h3>
                    <p>Status: {selectedChannel.isLocked ? 'Låst' : 'Olåst'}</p>
                </div>
            )}
        </div>
    );
};

export default ChannelList;