import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import LoginLogout from './components/Login';
import ChannelList from './components/ChannelList';
import { Channel } from './models/interface';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Håller inloggningsstatus
    const [channels, setChannels] = useState<Channel[]>([]); // Lagrar kanaler

    const handleLoginStatusChange = (status: boolean) => {
        setIsLoggedIn(status);
    };

    return (
        <Router>
            <div>
                <Routes>
                    <Route 
                        path="/" 
                        element={<LoginLogout setIsLoggedIn={handleLoginStatusChange} />} 
                    />
                    <Route 
                        path="/channels" 
                        element={<ChannelList channels={channels} isLoggedIn={isLoggedIn} isGuest={false} />} 
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;