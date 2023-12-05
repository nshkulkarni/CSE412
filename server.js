const express = require("express");
const cors = require("cors");
const path = require("path"); 
const pool = require("./database");

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

// app.use(express.static(path.join(__dirname, '../client/build')));

// // Handle other routes
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
// });


// Endpoint for creating a new user
app.post("/api/users", async (req, res) => {
    const username = req.body["u_username"];
    const password = req.body["u_password"];

    console.log("Username: " + username);
    console.log("Password: " + password);

    const insertSMT = `INSERT INTO users (u_username, u_password) VALUES ('${username}', '${password}');`;

    try {
        const response = await pool.query(insertSMT);
        console.log("User added successfully:", response);
        res.status(200).json({ message: 'User added successfully' });
    } catch (err) {
        // Check if the error is a unique violation
        if (err.code === '23505') {
            console.log(`Username '${username}' already exists.`);
            res.status(400).json({ error: `Username '${username}' already exists.` });
        } else {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Endpoint for user login
app.post("/api/login", async (req, res) => {
    const username = req.body["u_username"];
    const password = req.body["u_password"];

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE u_username = $1 AND u_password = $2',
            [username, password]
        );

        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/api/song", async (req, res) => {
    try{
        const { title } = req.query;

        const query = `
            SELECT s.*, a.a_name 
            FROM song s 
            JOIN artist a ON s.a_serial = a.a_serial 
            WHERE s.s_title ILIKE $1
        `;

        const song = await pool.query(query, 
        [`%${ title }%`]
        );
        res.json(song.rows);
    } catch (err) {
        console.error(err.message)
    }
});

// Endpoint for creating a new playlist
app.post("/api/playlists", async (req, res) => {
    const title = req.body.title;

    const insertSMT = `INSERT INTO playlist (P_Title) VALUES ('${title}') RETURNING *;`;

    try {
        const response = await pool.query(insertSMT);
        console.log("Playlist created successfully:", response.rows[0]);
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint for fetching all playlists
app.get("/api/playlists", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM playlist');
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint for adding a song to a playlist
app.post("/api/playlists/:playlistId/add-song", async (req, res) => {
    const playlistId = req.params.playlistId;
    const songId = req.body.songId;

    console.log("Received request to add song to playlist. Playlist ID:", playlistId, "Song ID:", songId);

    const insertSMT = `
        INSERT INTO playlist_songs (s_id, p_id)
        VALUES ('${songId}', ${playlistId})
        ON CONFLICT DO NOTHING
        RETURNING *;
    `;

    try {
        const response = await pool.query(insertSMT);
        if (response.rows.length > 0) {
            console.log("Song added to playlist successfully:", response.rows[0]);
            res.status(200).json(response.rows[0]);
        } else {
            console.log(`Song '${songId}' is already in playlist '${playlistId}'.`);
            res.status(400).json({ error: `Song '${songId}' is already in playlist '${playlistId}'.` });
        }
    } catch (err) {
        console.error(err);  // Log the error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint for fetching songs in a playlist
app.get("/api/playlists/:playlistId/songs", async (req, res) => {
    const playlistId = req.params.playlistId;

    try {
        const result = await pool.query(
            'SELECT s.* FROM playlist_songs c JOIN song s ON c.s_id = s.s_id WHERE c.p_id = $1',
            [playlistId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
