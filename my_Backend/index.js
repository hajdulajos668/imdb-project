require('dotenv').config();
const express = require('express');
const db = require('./db');

const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

//lekérdezés gyak string/json
app.get('/', (req, res) => {
	res.send('HELLO SERVER!');
	//res.json({ message: 'Server is running succesfully', sender: 'Lajos' });
});

//Az összes film lekérdezése
app.get('/api/movies', async (req, res) => {
	try {
		const [rows] = await db.query('SELECT * FROM movies');
		res.json(rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
});

// Egy konkrét film lekérdezése ID alapján
app.get('/api/movies/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const [rows] = await db.query('SELECT * FROM movies WHERE id = ?', [id]);

		if (rows.length === 0) {
			return res.status(404).json({ error: 'A film nem található' });
		}

		res.json(rows[0]);
	} catch (error) {
		console.error('Adatbázis hiba:', error);
		res.status(500).json({ error: 'Database error' });
	}
});

/*
// ez majd a userek lesznek
app.get('/users', async (req, res) => {
	try {
		const [rows] = await db.query('SELECT * FROM users');
		res.json(rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Database error' });
	}
});

// POST: Create a new user
app.post('/usersup', async (req, res) => {
	const { name, email } = req.body;

	if (!name || !email) {
		return res.status(400).json({ error: 'Name and email are required' });
	}

	try {
		const [result] = await db.query(
			'INSERT INTO users (name, email) VALUES (?, ?)',
			[name, email], // Using parameterized queries to prevent SQL injection
		);
		res.status(201).json({ id: result.insertId, name, email });
	} catch (error) {
		console.error(error);
		if (error.code === 'ER_DUP_ENTRY') {
			return res.status(409).json({ error: 'Email already exists' });
		}
		res.status(500).json({ error: 'Database error' });
	}
});
*/

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
