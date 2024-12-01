import { useEffect, useState } from 'react';

interface User {
  _id: string;
  username: string;
}

interface Props {
  onUserSelect: (userId: string) => void;
}

const DMList = ({ onUserSelect }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="channel-layout">
      <div className="channel-sidebar">
        <h2>Direct Messages</h2>
        {error && <p>{error}</p>}
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              onClick={() => onUserSelect(user._id)}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DMList;
