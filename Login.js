import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate();

    const handleLogin = async () => {
        // Make a POST request to the backend for login
        try {
            const response = await fetch('http://localhost:4000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ u_username: username, u_password: password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data.message);
                // Redirect to the home page upon successful login
                history('/home');
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCreateAccount = async () => {
        // Make a POST request to the backend for creating a new account
        try {
            const response = await fetch('http://localhost:4000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ u_username: username, u_password: password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data.message);
                // Redirect to the home page upon successful account creation
                history('/home');
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="login-container">
          <h2>Jamix</h2>
          <form>
            <label className='label'>
              Username:
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-input"/>
            </label>
            <br />
            <label className='label'>
              Password:
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-input"/>
            </label>
            <br />
            <button type="button" className='btn' onClick={handleLogin}>
              Login
            </button>
            <button type="button" className='btn' onClick={handleCreateAccount}>
              Create Account
            </button>
          </form>
        </div>
      );
    }
    
    export default Login;
