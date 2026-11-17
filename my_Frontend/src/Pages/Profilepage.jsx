import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Profilepage() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState('');

	// ÚJ: Statisztika state
	const [stats, setStats] = useState({ total_minutes: 0, total_movies: 0, genres: [] });

	const [name] = useState(() => {
		try {
			const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
			return (
				localStorage.getItem('name') ||
				savedUser.name ||
				savedUser.username ||
				'Ismeretlen felhasználó'
			);
		} catch {
			return localStorage.getItem('name') || 'Ismeretlen felhasználó';
		}
	});

	const [email] = useState(() => {
		try {
			const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
			return localStorage.getItem('email') || savedUser.email || 'Nincs megadva e-mail';
		} catch {
			return localStorage.getItem('email') || 'Nincs megadva e-mail';
		}
	});

	const [favorites, setFavorites] = useState([]);
	const [watchlist, setWatchlist] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		try {
			const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
			if (savedUser.id) {
				// Watchlist lekérése
				api.get(`/api/watchlist/${savedUser.id}`)
					.then((response) => setWatchlist(response.data))
					.catch((err) => console.error('Hiba a watchlist lekérésekor:', err));

				// Kedvencek lekérése
				api.get(`/api/favorites/${savedUser.id}`)
					.then((response) => setFavorites(response.data))
					.catch((err) => console.error('Hiba a kedvencek lekérésekor:', err));

				// ÚJ: Statisztika lekérése a saját profilból
				api.get(`/api/users/${savedUser.id}/stats`)
					.then((response) => setStats(response.data))
					.catch((err) => console.error('Hiba a statisztika lekérésekor:', err));
			}
		} catch (err) {
			console.error(err);
		}
	}, []);

	// Segédfüggvény perc -> óra és perc átváltáshoz
	const formatWatchTime = (totalMinutes) => {
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		return `${hours} óra ${minutes} perc`;
	};

	return (
		<div className='min-h-screen text-white p-6'>
			<div className='max-w-4xl mx-auto space-y-8'>
				<div className='bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700'>
					<h2 className='text-3xl font-bold mb-6 border-b border-gray-700 pb-4'>
						Felhasználói Profil
					</h2>

					<div className='space-y-4'>
						<div>
							<span className='block text-sm font-medium text-gray-400'>
								Felhasználónév:
							</span>
							<p className='text-xl font-semibold text-white mt-1'>{name}</p>
						</div>

						<div>
							<span className='block text-sm font-medium text-gray-400'>E-mail cím:</span>
							<p className='text-xl font-semibold text-white mt-1'>{email}</p>
						</div>
					</div>
				</div>

				{/* ÚJ: SAJÁT STATISZTIKA SZEKCIÓ (Kizárólag innen érhető el) */}
				<div className='bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700'>
					<h3 className='text-2xl font-bold mb-4 border-b border-gray-700 pb-3'>
						Személyes Statisztika 📊
					</h3>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
						<div className='bg-gray-700 p-4 rounded-lg border border-gray-600'>
							<span className='block text-sm text-gray-400'>
								Filmnézéssel töltött összes idő:
							</span>
							<p className='text-2xl font-bold text-indigo-400 mt-1'>
								{formatWatchTime(stats.total_minutes || 0)}
							</p>
						</div>
						<div className='bg-gray-700 p-4 rounded-lg border border-gray-600'>
							<span className='block text-sm text-gray-400'>Megtekintett filmek:</span>
							<p className='text-xl font-bold text-indigo-400 mt-1'>
								{stats.watched_movies_count || 0} db
							</p>
						</div>
						<div className='bg-gray-700 p-4 rounded-lg border border-gray-600'>
							<span className='block text-sm text-gray-400'>Értékelt filmek:</span>
							<p className='text-xl font-bold text-indigo-400 mt-1'>
								{stats.rated_movies_count || 0} db
							</p>
						</div>
					</div>
					{/* KÜLÖN KÁRTYA: Kedvenc Műfajok eloszlása (Szép térközzel elválasztva) */}
					<div className='bg-gray-700 p-6 rounded-lg border border-gray-600 mt-6'>
						<h4 className='text-lg font-semibold mb-4 text-gray-200'>
							Kedvenc Műfajok eloszlása 🎬
						</h4>
						{!stats.genres || stats.genres.length === 0 ? (
							<p className='text-gray-400 text-sm'>
								Még nincsenek adatok a műfajok diagramjához (adj filmeket a watchlisthez).
							</p>
						) : (
							<div className='space-y-3'>
								{stats.genres.map((item, index) => {
									const maxCount = stats.genres[0].count;
									const percentage = Math.round((item.count / maxCount) * 100);

									return (
										<div key={index} className='space-y-1'>
											<div className='flex justify-between text-sm'>
												<span className='font-medium text-white'>
													{item.genre || 'Egyéb'}
												</span>
												<span className='text-gray-400'>{item.count} db film</span>
											</div>
											<div className='w-full bg-gray-800 rounded-full h-3 overflow-hidden'>
												<div
													className='bg-indigo-500 h-3 rounded-full transition-all duration-500'
													style={{ width: `${percentage}%` }}
												></div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>

				<div className='bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700'>
					<h3 className='text-2xl font-bold mb-4 border-b border-gray-700 pb-3'>
						Kedvenc Filmjeim ❤️
					</h3>
					{favorites.length === 0 ? (
						<p className='text-gray-400 text-sm'>Még nincsenek kedvencnek jelölt filmjeid.</p>
					) : (
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
							{favorites.map((movie) => (
								<div
									key={movie.id}
									onClick={() => navigate(`/movie/${movie.id}`)}
									className='bg-gray-700 p-4 rounded border border-gray-600 flex items-center space-x-3 cursor-pointer hover:bg-gray-600 transition'
								>
									{movie.poster_url && (
										<img
											src={movie.poster_url}
											alt={movie.title}
											className='w-12 h-16 object-cover rounded'
										/>
									)}
									<div>
										<h4 className='font-semibold text-sm'>{movie.title}</h4>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				<div className='bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700'>
					<h3 className='text-2xl font-bold mb-4 border-b border-gray-700 pb-3'>
						Kívánságlista (Watchlist) 🎬
					</h3>
					{watchlist.length === 0 ? (
						<p className='text-gray-400 text-sm'>A kívánságlistád jelenleg üres.</p>
					) : (
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
							{watchlist.map((movie) => (
								<div
									key={movie.id}
									onClick={() => navigate(`/movie/${movie.id}`)}
									className='bg-gray-700 p-4 rounded border border-gray-600 flex items-center space-x-3 cursor-pointer hover:bg-gray-600 transition'
								>
									{movie.poster_url && (
										<img
											src={movie.poster_url}
											alt={movie.title}
											className='w-12 h-16 object-cover rounded'
										/>
									)}
									<div>
										<h4 className='font-semibold text-sm'>{movie.title}</h4>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Profilepage;
