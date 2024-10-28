import { BrowserRouter as Router , Route, Routes } from 'react-router-dom';
import LoginLogout from './components/Login';
import ChannelList from './components/ChannelList';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<LoginLogout />} />
                    
                    <Route path="/channels" element={<ChannelList channels={[]} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
