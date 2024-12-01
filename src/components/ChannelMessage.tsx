import { useEffect, useState } from 'react';
import './messages.css';

interface Message {
  _id: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface ChannelMessagesProps {
  channelId: string;
  onBack: () => void;
}

const ChannelMessages = ({ channelId, onBack }: ChannelMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${channelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching messages');
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError('Error fetching messages');
      console.error(err);
    }
  };

  useEffect(() => {
    if (channelId) {
      fetchMessages();
    }
  }, [channelId]);

  const sendMessageToChannel = async (content: string, channelId: string): Promise<void> => {
    const token = localStorage.getItem('jwt');
    const isGuest = localStorage.getItem('role') === 'guest';

    const body = {
      content,
      channelId,
    };

    try {
      const response = await fetch(isGuest ? '/api/channels/send/guest' : '/api/channels/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && !isGuest ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        fetchMessages();
      } else {
        console.error('Failed to send message:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <button className="go-back-button" onClick={onBack}>
        Go back
      </button>
      <div className="messages-container">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message-item ${
              msg.sender === localStorage.getItem('userId') ? 'sent' : 'received'
            }`}
          >
            <div className="message-header">
              {msg.sender === localStorage.getItem('userId') ? 'You' : msg.sender} -{' '}
              {new Date(msg.timestamp).toLocaleString()}
            </div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
      </div>
      <div className="new-message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message..."
        />
        <button onClick={() => sendMessageToChannel(newMessage, channelId)}>Send</button>
      </div>
    </div>
  );
};

export default ChannelMessages;
