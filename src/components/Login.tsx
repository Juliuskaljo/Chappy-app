import React, { useState } from 'react';
import './login.css';

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setUsernameError(!username);
    setPasswordError(!password);

    if (!username || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('userId', data.userId);
        onLogin();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Error logging in');
      console.error(err);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'guest', password: '' }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userId', 'guest');
        localStorage.setItem('role', 'guest');
        onLogin();
      } else {
        setError(data.message || 'Guest login failed');
      }
    } catch (err) {
      setError('Error logging in as guest');
      console.error(err);
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleLogin}>
        <div className="input-wrapper">
          <input
            className={`login-input ${usernameError ? 'error' : ''}`}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameError(false);
            }}
          />
          {usernameError && <span className="error-text">Username is required</span>}
        </div>
        <div className="input-wrapper">
          <input
            className={`login-input ${passwordError ? 'error' : ''}`}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(false);
            }}
          />
          {passwordError && <span className="error-text">Password is required</span>}
        </div>
        <button className="login-button" type="submit">
          Login
        </button>
      </form>

      <button className="guest-login-button" onClick={handleGuestLogin}>
        Log in as Guest
      </button>

      {error && <p className="general-error">{error}</p>}
    </div>
  );
};

export default Login;
