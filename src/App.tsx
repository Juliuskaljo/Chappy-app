import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginLogout from './components/Login';
import ChannelList from './components/ChannelList';
import { Channel, User } from './models/interface'; // Importera User också

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 
    const [channels, setChannels] = useState<Channel[]>([]);
    const [users, setUsers] = useState<User[]>([]); // Lägg till detta för att hålla användarna

    const handleLoginStatusChange = (status: boolean) => {
        setIsLoggedIn(status);
    };

    // Ny funktion för att hämta användare
    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users'); // Anta att du har en API-endpoint för att hämta användare
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchUsers(); // Hämta användare när någon är inloggad
        }
    }, [isLoggedIn]);

    return (
        <Router>
            <div>
                <Routes>
                    <Route 
                        path="/" 
                        element={<LoginLogout setIsLoggedIn={handleLoginStatusChange} />} 
                    />
                    <Route 
                        path="channels" 
                        element={<ChannelList channels={channels} users={users} isLoggedIn={isLoggedIn} isGuest={false} />} 
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;