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

        //

        const song = await pool.query("SELECT * FROM song WHERE s_title ILIKE $1", 
        [`%${ title }%`]
        );
        res.json(song.rows);
    } catch (err) {
        console.error(err.message)
    }
});

// Example endpoint for song search
// query parameters- being able to send data within URL


app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
