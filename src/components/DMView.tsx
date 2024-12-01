import { useState, useEffect } from 'react';
import './messages.css';

interface Message {
  _id: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface DMViewProps {
  userId: string;
  otherUserId: string;
  onBack: () => void;
}

const DMView = ({ userId, otherUserId, onBack }: DMViewProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/dm/${otherUserId}`, {
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
        console.error(err);
      }
    };

    fetchMessages();
  }, [userId, otherUserId]);

  const handleSendMessage = async () => {
    const senderId = localStorage.getItem('userId');

    if (!senderId) {
      console.error('User is not logged in or senderId is missing.');
      return;
    }

    const data = {
      senderId: senderId,
      receiverId: otherUserId,
      content: newMessage,
    };

    try {
      const response = await fetch('/api/messages/dm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();

      const messageToAdd = {
        _id: result.messageId,
        sender: senderId,
        receiver: otherUserId,
        content: newMessage,
        timestamp: new Date().toString(),
      };

      setMessages((prev) => [...prev, messageToAdd]);
      setNewMessage('');
    } catch (err) {
      console.error('Error while sending message:', err);
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
            className={`message-item ${msg.sender === userId ? 'sent' : 'received'}`}
          >
            <div className="message-header">
              {msg.sender === userId ? 'You' : msg.sender} -{' '}
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
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default DMView;
