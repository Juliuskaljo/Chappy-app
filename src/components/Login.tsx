import { useState, useEffect } from "react";
import { Channel } from "../models/interface";
import ChannelList from "./ChannelList";
import './login.css'

const LS_KEY = 'JWT-DEMO--TOKEN';
const USERNAME_KEY = 'USERNAME';

const LoginLogout = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        refreshLoginStatus();
        if (isLoggedIn) {
            fetchChannels(); 
        }
    }, [isLoggedIn]);

    const refreshLoginStatus = () => {
        setIsLoggedIn(localStorage.getItem(LS_KEY) !== null);
        setUsername(localStorage.getItem(USERNAME_KEY) || '');
    };

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
        setIsLoggedIn(true);
        setSuccessMessage('Thank you for logging in.');
        setError(null);
        await fetchChannels();
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
        setIsLoggedIn(false);
        setSuccessMessage('You are logged out.');
        setChannels([]);
    };

    return (
        <div>
            <main>
				<h1 className="logo">
					ChatApp!
				</h1>
                {isLoggedIn ? (
                    <div className="logged-in-div">
                        <p>Användare: <br/> <strong>{username}</strong></p>
                        <button id="logout-button" onClick={handleLogout}>Log out</button>
                    </div>
                ) : (
                    
					<div className="login-form">
                        <input className="login-input"
                            id="username" 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="Username"
                        />
                        <input className="login-input"
                            id="password" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Password"
                        />
                        <button id="login-button" onClick={handleLogin} disabled={isLoggedIn}>Log in</button>
						</div>
                )}
            </main>

            <div className="channels-result">
                {successMessage && <p>{successMessage}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                {isLoggedIn && channels.length > 0 && (
                    <ChannelList channels={channels} />
                )}
            </div>
        </div>
    );
};

export default LoginLogout;