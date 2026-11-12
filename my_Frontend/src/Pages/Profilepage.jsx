import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Profilepage() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState('');

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
				api.get(`/api/watchlist/${savedUser.id}`)
					.then((response) => setWatchlist(response.data))
					.catch((err) => console.error('Hiba a watchlist lekérésekor:', err));
			}
		} catch (err) {
			console.error(err);
		}
	}, []);

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
									className='bg-gray-700 p-4 rounded border border-gray-600 flex items-center space-x-3'
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
