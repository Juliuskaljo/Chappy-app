import { useState, useEffect } from 'react';
import Login from './components/Login';
import Channels from './components/ChannelList';
import ChannelMessages from './components/ChannelMessage';
import DMList from './components/DMList';
import DMView from './components/DMView';
import "./index.css"
import "./components/login.css"

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<string>('login');
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [selectedDMUserId, setSelectedDMUserId] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsLoggedIn(true);
      setIsGuest(userId === 'guest');
      setCurrentPage('channels');
    }
  }, []);

  const handleLogin = () => {
    setCurrentPage('channels');
    setIsLoggedIn(true);
    setIsGuest(localStorage.getItem('userId') === 'guest');
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsGuest(false);
    setCurrentPage('login');
  };

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannelId(channelId);
    setCurrentPage('messages');
  };

  const handleDMUserSelect = (userId: string) => {
    if (!isGuest) {
      setSelectedDMUserId(userId);
      setCurrentPage('dmview');
    }
  };

  const handleBackToChannels = () => {
    setCurrentPage('channels');
    setSelectedChannelId(null);
    setSelectedDMUserId(null);
  };

  return (
    <div className='mainpage'>
      <h1>Chat-app</h1>

      {isLoggedIn && <button className='logout-button' onClick={handleLogout}>Logout</button>}

      {currentPage === 'login' && !isLoggedIn && <Login onLogin={handleLogin} />}
      
      {currentPage === 'channels' && isLoggedIn && (
        <div>
          <Channels onChannelSelect={handleChannelSelect} />
          {!isGuest && <DMList onUserSelect={handleDMUserSelect}/>}
        </div>
      )}

      {currentPage === 'messages' && selectedChannelId && (
        <ChannelMessages channelId={selectedChannelId} onBack={handleBackToChannels} />
      )}

      {currentPage === 'dmview' && selectedDMUserId && (
        <DMView userId={localStorage.getItem('userId') || ''} otherUserId={selectedDMUserId} onBack={handleBackToChannels} />
      )}
    </div>
  );
};

export default App;
