require('dotenv').config();
const express = require('express');
const db = require('./db');
const bcrypt = require('bcrypt');

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

//user regisztráció
app.post('/api/register', async (req, res) => {
	console.log('1. Kérés érkezett:', req.body);
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
	}

	try {
		console.log('2. Adatbázis keresés indul...');

		const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

		console.log('3. Adatbázis válaszolt! Találatok száma:', results.length);

		if (results.length > 0) {
			return res.status(409).json({ error: 'Ez az email cím már regisztrálva van!' });
		}

		console.log('4. Jelszó titkosítása...');
		const hashedPassword = await bcrypt.hash(password, 10);

		console.log('5. Mentés az adatbázisba...');
		await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
			name,
			email,
			hashedPassword,
		]);

		console.log('6. Sikeres mentés!');
		return res.status(201).json({ message: 'Sikeres regisztráció!' });

	} catch (error) {
		console.error('KRITIKUS HIBA A REGISZTRÁCIÓNÁL:', error);
		return res.status(500).json({ error: 'Belső szerverhiba történt.' });
	}
});

// user bejelentkezés
app.post('/api/login', async (req, res) => {
	console.log('Bejelentkezési kísérlet:', req.body.email);
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
	}

	try {
		const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

		if (results.length === 0) {
			return res.status(401).json({ error: 'Hibás email cím vagy jelszó!' });
		}

		const user = results[0];

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(401).json({ error: 'Hibás email cím vagy jelszó!' });
		}

		console.log('Sikeres bejelentkezés:', user.email);

		return res.status(200).json({
			message: 'Sikeres bejelentkezés!',
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		console.error('Kritikus hiba bejelentkezéskor:', error);
		return res.status(500).json({ error: 'Belső szerverhiba történt.' });
	}
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
