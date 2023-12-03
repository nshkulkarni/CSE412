// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';

function App() {
    const [users, setUsers] = useState([]);
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        // Fetch data from the server
        fetch('http://localhost:4000/api/users')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setUsers(data);
            })
            .catch(error => console.error('Error:', error));

        fetch('http://localhost:4000/api/songs')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setSongs(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />
                <Route
                    path="/login"
                    element={<Login setUsers={setUsers} />}
                />
                <Route
                    path="/home"
                    element={<Home songs={songs} />}
                />
            </Routes>
        </Router>
    );
}

export default App;
