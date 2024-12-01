import { useEffect, useState } from 'react';
import './channellist.css';

interface Channel {
  _id: string;
  name: string;
  isLocked: boolean;
}

interface ChannelsProps {
  onChannelSelect: (channelId: string) => void;
}

const Channels = ({ onChannelSelect }: ChannelsProps) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'guest' | 'user' | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('role') as 'guest' | 'user' | null;
    setUserRole(role);

    const fetchChannels = async () => {
      try {
        const response = await fetch('/api/channels', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch channels');
        }

        const data = await response.json();
        setChannels(data);
      } catch (err) {
        setError('Failed to fetch channels');
        console.error(err);
      }
    };

    fetchChannels();
  }, []);

  const renderChannelStatus = (isLocked: boolean) => {
    if (userRole === 'guest') {
      return isLocked ? '🔒 Locked (Guest)' : '🔓';
    } else {
      return isLocked ? '🔓' : '🔓';
    }
  };

  return (
    <div className="channel-layout">
      <div className="channel-sidebar">
        <h2>Channels</h2>
        {error && <p>{error}</p>}
        <ul>
          {channels.map((channel) => (
            <li
              key={channel._id}
              onClick={() => {
                if (userRole === 'guest' && channel.isLocked) {
                  return;
                }
                onChannelSelect(channel._id);
              }}
              style={{
                cursor: userRole === 'guest' && channel.isLocked ? 'not-allowed' : 'pointer',
                backgroundColor: userRole === 'guest' && channel.isLocked ? '#ccc' : '',
              }}
            >
              {channel.name} {renderChannelStatus(channel.isLocked)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Channels;
