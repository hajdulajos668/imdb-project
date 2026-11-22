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
				is_admin: user.is_admin,
			},
		});
	} catch (error) {
		console.error('Kritikus hiba bejelentkezéskor:', error);
		return res.status(500).json({ error: 'Belső szerverhiba történt.' });
	}
});

//Egy felhasználó watchlist lekérdezése
app.get('/api/watchlist/:userId', async (req, res) => {
	try {
		const { userId } = req.params;
		const [rows] = await db.query(
			`SELECT m.*, w.added_at 
			 FROM watchlist w 
			 JOIN movies m ON w.movie_id = m.id 
			 WHERE w.user_id = ? 
			 ORDER BY w.added_at DESC`,
			[userId],
		);
		res.json(rows);
	} catch (error) {
		console.error('Hiba a watchlist lekérdezésekor:', error);
		res.status(500).json({ error: 'Adatbázis hiba' });
	}
});

// Film hozzáadása a watchlisthez
app.post('/api/watchlist', async (req, res) => {
	const { user_id, movie_id } = req.body;

	if (!user_id || !movie_id) {
		return res.status(400).json({ error: 'Hiányzó user_id vagy movie_id!' });
	}

	try {
		await db.query('INSERT INTO watchlist (user_id, movie_id) VALUES (?, ?)', [
			user_id,
			movie_id,
		]);
		res.status(201).json({ message: 'Film hozzáadva a megtekintendőkhöz!' });
	} catch (error) {
		if (error.code === 'ER_DUP_ENTRY') {
			return res.status(409).json({ error: 'Ez a film már szerepel a listádon!' });
		}
		console.error('Hiba a watchlisthez adáskor:', error);
		res.status(500).json({ error: 'Adatbázis hiba' });
	}
});

// Film eltávolítása a watchlistről
app.delete('/api/watchlist/:userId/:movieId', async (req, res) => {
	try {
		const { userId, movieId } = req.params;
		await db.query('DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?', [userId, movieId]);
		res.json({ message: 'Film eltávolítva a listáról!' });
	} catch (error) {
		console.error('Hiba a watchlistről való törléskor:', error);
		res.status(500).json({ error: 'Adatbázis hiba' });
	}
});

// --- ÉRTÉKELÉSEK ÉS HOZZÁSZÓLÁSOK RENDSZER ---

// 1. Egy film értékeléseinek és hozzászólásainak lekérdezése (időrendben, legújabb elöl)
app.get('/api/ratings/:movieId', async (req, res) => {
	try {
		const { movieId } = req.params;
		const [rows] = await db.query(
			`SELECT r.*, u.name as user_name 
             FROM ratings r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.movie_id = ?
             ORDER BY r.created_at DESC`,
			[movieId],
		);

		// Átlag kiszámítása
		let averageRating = 0;
		if (rows.length > 0) {
			const sum = rows.reduce((acc, curr) => acc + curr.rating, 0);
			averageRating = (sum / rows.length).toFixed(1);
		}

		res.json({
			ratings: rows,
			averageRating: Number(averageRating),
			totalVotes: rows.length,
		});
	} catch (error) {
		console.error('Hiba az értékelések lekérdezésekor:', error);
		res.status(500).json({ error: 'Adatbázis hiba' });
	}
});

// 2. Értékelés és hozzászólás leadása vagy frissítése (Upsert)
app.post('/api/ratings', async (req, res) => {
	const { user_id, movie_id, rating, review_text } = req.body;

	if (!user_id || !movie_id || !rating) {
		return res.status(400).json({ error: 'Hiányzó adatok (user_id, movie_id vagy rating)!' });
	}

	if (rating < 1 || rating > 5) {
		return res.status(400).json({ error: 'Az értékelésnek 1 és 5 között kell lennie!' });
	}

	// Karakterlimit ellenőrzés (ha van megadott szöveg)
	if (review_text && review_text.trim() !== '') {
		if (review_text.length < 10 || review_text.length > 2000) {
			return res
				.status(400)
				.json({ error: 'A hozzászólásnak 10 és 2000 karakter között kell lennie!' });
		}
	}

	try {
		await db.query(
			`INSERT INTO ratings (user_id, movie_id, rating, review_text) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
                 rating = ?, 
                 review_text = ?, 
                 updated_at = CURRENT_TIMESTAMP`,
			[user_id, movie_id, rating, review_text || null, rating, review_text || null],
		);

		res.status(201).json({ message: 'Értékelés és hozzászólás sikeresen elmentve!' });
	} catch (error) {
		console.error('Hiba az értékelés mentésekor:', error);
		res.status(500).json({ error: 'Adatbázis hiba' });
	}
});

// 3. Értékelés és hozzászólás törlése
app.delete('/api/ratings/:userId/:movieId', async (req, res) => {
	try {
		const { userId, movieId } = req.params;
		await db.query('DELETE FROM ratings WHERE user_id = ? AND movie_id = ?', [userId, movieId]);
		res.json({ message: 'Értékelés sikeresen törölve!' });
	} catch (error) {
		console.error('Hiba az értékelés törlésekor:', error);
		res.status(500).json({ error: 'Adatbázis hiba' });
	}
});

// --- KEDVENCEK RENDSZER ---

// 1. Felhasználó kedvenceinek lekérdezése
app.get('/api/favorites/:userId', async (req, res) => {
	try {
		const { userId } = req.params;
		const [rows] = await db.query(
			`SELECT m.*, f.added_at 
             FROM favorites f 
             JOIN movies m ON f.movie_id = m.id 
             WHERE f.user_id = ? 
             ORDER BY f.added_at DESC`,
			[userId],
		);
		res.json(rows);
	} catch (error) {
		console.error('Hiba a kedvencek lekérdezésekor:', error);
		res.status(500).json({ error: 'Adatbázis hiba' });
	}
});

// 2. Film hozzáadása a kedvencekhez
app.post('/api/favorites', async (req, res) => {
	const { user_id, movie_id } = req.body;

	if (!user_id || !movie_id) {
		return res.status(400).json({ error: 'Hiányzó user_id vagy movie_id!' });
	}

	try {
		await db.query('INSERT INTO favorites (user_id, movie_id) VALUES (?, ?)', [
			user_id,
			movie_id,
		]);
		res.status(201).json({ message: 'Film hozzáadva a kedvencekhez!' });
	} catch (error) {
		if (error.code === 'ER_DUP_ENTRY') {
			return res.status(409).json({ error: 'Ez a film már szerepel a kedvenceid között!' });
		}
		console.error('Hiba a kedvencekhez adáskor:', error);
		res.status(500).json({ error: 'Adatbázis hiba' });
	}
});

// 3. Film eltávolítása a kedvencekből
app.delete('/api/favorites/:userId/:movieId', async (req, res) => {
	try {
		const { userId, movieId } = req.params;
		await db.query('DELETE FROM favorites WHERE user_id = ? AND movie_id = ?', [userId, movieId]);
		res.json({ message: 'Film eltávolítva a kedvencekből!' });
	} catch (error) {
		console.error('Hiba a kedvencekből való törléskor:', error);
		res.status(500).json({ error: 'Adatbázis hiba' });
	}
});

// --- SZEMÉLYES STATISZTIKA RENDSZER ---

app.get('/api/users/:userId/stats', async (req, res) => {
	try {
		const { userId } = req.params;

		// 1. Összes megtekintett film (Watchlist alapján) hossza percben és darabszáma
		const [watchlistRows] = await db.query(
			`SELECT COUNT(m.id) as watched_count, COALESCE(SUM(m.duration), 0) as total_minutes
             FROM watchlist w 
             JOIN movies m ON w.movie_id = m.id 
             WHERE w.user_id = ?`,
			[userId],
		);

		// 2. Értékelt filmek darabszáma
		const [ratedRows] = await db.query(
			`SELECT COUNT(DISTINCT movie_id) as rated_count 
             FROM ratings 
             WHERE user_id = ?`,
			[userId],
		);

		// 3. ÚJ: Kedvenc műfajok lekérdezése a watchlist alapján
		const [genreRows] = await db.query(
			`SELECT m.genre, COUNT(*) as count
             FROM watchlist w
             JOIN movies m ON w.movie_id = m.id
             WHERE w.user_id = ? AND m.genre IS NOT NULL AND m.genre != ''
             GROUP BY m.genre
             ORDER BY count DESC`,
			[userId],
		);

		res.json({
			total_minutes: Number(watchlistRows[0].total_minutes),
			watched_movies_count: Number(watchlistRows[0].watched_count),
			rated_movies_count: Number(ratedRows[0].rated_count),
			genres: genreRows, // Műfajok listája [{ genre: 'Sci-Fi', count: 3 }, ...]
		});
	} catch (error) {
		console.error('Hiba a statisztika lekérésekor:', error);
		res.status(500).json({ error: 'Adatbázis hiba' });
	}
});

// --- ADMIN ---

const verifyAdmin = async (req, res, next) => {
	const userId = req.headers['user-id'];

	if (!userId) {
		return res.status(401).json({ error: 'Hiányzó felhasználói azonosító!' });
	}

	try {
		const [users] = await db.query('SELECT is_admin FROM users WHERE id = ?', [userId]);
		if (users.length === 0 || users[0].is_admin !== 1) {
			return res.status(403).json({ error: 'Nincs adminisztrátori jogosultságod!' });
		}
		next();
	} catch (err) {
		console.error('Admin ellenőrzési hiba:', err);
		res.status(500).json({ error: 'Szerverhiba a jogosultság ellenőrzésekor.' });
	}
};

// Új film hozzáadása (Csak adminoknak)
app.post('/api/movies', verifyAdmin, async (req, res) => {
	const { title, genre, description, release_date, poster_url, isNew } = req.body;

	if (!title || !genre) {
		return res.status(400).json({ error: 'A cím és a műfaj megadása kötelező!' });
	}

	try {
		const [result] = await db.query(
			'INSERT INTO movies (title, genre, description, release_date, poster_url, isNew) VALUES (?, ?, ?, ?, ?, ?)',
			[title, genre, description || null, release_date, poster_url || null, isNew ? 1 : 0],
		);
		res.status(201).json({ message: 'Film sikeresen hozzáadva!', id: result.insertId });
	} catch (err) {
		console.error('Hiba a film mentésekor:', err);
		res.status(500).json({ error: 'Adatbázis hiba a film létrehozásakor.' });
	}
});

// Film törlése (Csak adminoknak)
app.delete('/api/movies/:id', verifyAdmin, async (req, res) => {
	const movieId = req.params.id;

	try {
		await db.query('DELETE FROM movies WHERE id = ?', [movieId]);
		res.status(200).json({ message: 'Film sikeresen törölve!' });
	} catch (err) {
		console.error('Hiba a film törlésekor:', err);
		res.status(500).json({
			error: 'Nem sikerült törölni a filmet.',
		});
	}
});

// Összes vélemény lekérése (Csak adminoknak)
app.get('/api/admin/ratings', verifyAdmin, async (req, res) => {
	try {
		const [ratings] = await db.query(`
            SELECT 
                r.id, 
                r.rating, 
                r.review_text, 
                r.created_at, 
                u.name AS user_name, 
                m.title AS movie_title
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            JOIN movies m ON r.movie_id = m.id
            ORDER BY r.created_at DESC
        `);
		res.status(200).json(ratings);
	} catch (err) {
		console.error('Hiba a vélemények lekérésekor:', err);
		res.status(500).json({ error: 'Adatbázis hiba a vélemények betöltésekor.' });
	}
});

// Konkrét vélemény törlése ID alapján (Csak adminoknak)
app.delete('/api/admin/ratings/:id', verifyAdmin, async (req, res) => {
	const ratingId = req.params.id;
	try {
		await db.query('DELETE FROM ratings WHERE id = ?', [ratingId]);
		res.status(200).json({ message: 'Vélemény sikeresen törölve!' });
	} catch (err) {
		console.error('Hiba a vélemény törlésekor:', err);
		res.status(500).json({ error: 'Nem sikerült törölni a véleményt.' });
	}
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
