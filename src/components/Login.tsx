import { useState, useEffect } from "react";
import { Channel } from "../models/interface";
import ChannelList from "./ChannelList";
import './login.css';

const LS_KEY = 'JWT-DEMO--TOKEN';
const USERNAME_KEY = 'USERNAME';

const LoginLogout = ({ setIsLoggedIn }: { setIsLoggedIn: (status: boolean) => void }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const [isGuest, setIsGuest] = useState<boolean>(false); 
    const [channels, setChannels] = useState<Channel[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem(LS_KEY);
        const storedUsername = localStorage.getItem(USERNAME_KEY);
        if (token) {
            setLoggedIn(true);
            setIsGuest(token === 'guest');
            setUsername(storedUsername || '');
            setIsLoggedIn(true);
            fetchChannels();
        }
    }, []);

    const handleLogin = async () => {
        const data = { username, password };
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.status !== 200) {
            const errorData = await response.json();
            setError(errorData.message || 'Please log in again.');
            return;
        }

        const token: { jwt: string } = await response.json();
        localStorage.setItem(LS_KEY, token.jwt);
        localStorage.setItem(USERNAME_KEY, username);
        setLoggedIn(true);
        setIsGuest(false);
        setSuccessMessage(`Välkommen ${username}!`);
        setError(null);
        await fetchChannels();
    };

    const handleLoginAsGuest = () => {
        localStorage.setItem(LS_KEY, 'guest');
        localStorage.setItem(USERNAME_KEY, 'Guest');
        setLoggedIn(true);
        setIsGuest(true); 
        setUsername('Guest');
        setIsLoggedIn(true); 
        fetchChannels();
    };

    const fetchChannels = async () => {
        const response = await fetch('/api/channels', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(LS_KEY)}`,
            },
        });

        if (response.status !== 200) {
            const errorData = await response.json();
            setError(errorData.message || 'Could not fetch channels');
            return;
        }

        const data: Channel[] = await response.json();
        setChannels(data);
        setError(null);
    };

    const handleLogout = () => {
        localStorage.removeItem(LS_KEY);
        localStorage.removeItem(USERNAME_KEY);
        setLoggedIn(false);
        setIsGuest(false);
        setIsLoggedIn(false);
        setChannels([]);
    };

    return (
        <div>
            <main className={isLoggedIn ? 'logged-in' : 'logged-out'}>
                <h1 className="logo">ChatApp!</h1>
                {isLoggedIn ? (
                    <div className='logged-in-div'>
                        <p><strong>{username}</strong></p>
                        <button id="logout-button" onClick={handleLogout}>Logga ut</button>
                    </div>
                ) : (
                    <div className="login-form">
                        <input 
                            className="login-input"
                            id="username" 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="Username"
                        />
                        <input 
                            className="login-input"
                            id="password" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Password"
                        />
                        <button id="guest-login-button" onClick={handleLoginAsGuest}>Logga in som gäst</button>
                        <button id="login-button" onClick={handleLogin} disabled={isLoggedIn}>Logga in</button>
                    </div>
                )}
            </main>

            <div className="channels-result">
                {successMessage && <p>{successMessage}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                {isLoggedIn && channels.length > 0 && (
                    <ChannelList channels={channels} isLoggedIn={isLoggedIn} isGuest={isGuest} />
                )}
            </div>
        </div>
    );
};

export default LoginLogout;