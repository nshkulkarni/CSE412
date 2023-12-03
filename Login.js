import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h2>Login or Create Account</h2>
            <form>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <br />
                <button type="button" onClick={handleLogin}>
                    Login
                </button>
                <button type="button" onClick={handleCreateAccount}>
                    Create Account
                </button>
            </form>
        </div>
    );
}

export default Login;
