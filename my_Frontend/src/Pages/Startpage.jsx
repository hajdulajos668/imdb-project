import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

// --- Oldalról benyíló menü (SideMenu) komponens ---
function SideMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();

	return (
		<div className='relative'>
			<button
				onClick={() => setIsOpen(true)}
				className='btn btn-square btn-ghost text-base-content'
				title='Menü megnyitása'
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					className='inline-block w-6 h-6 stroke-current'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M4 6h16M4 12h16M4 18h16'
					></path>
				</svg>
			</button>

			{isOpen && (
				<div
					onClick={() => setIsOpen(false)}
					className='fixed inset-0 bg-black/50 z-40 transition-opacity'
				></div>
			)}

			<div
				className={`fixed top-0 left-0 h-full w-80 bg-base-100 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out p-6 flex flex-col justify-between ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				<div>
					<div className='flex justify-between items-center mb-8 border-b border-base-200 pb-4'>
						<h3 className='text-xl font-extrabold text-base-content'>Menü</h3>
						<button
							onClick={() => setIsOpen(false)}
							className='btn btn-sm btn-circle btn-ghost'
						>
							✕
						</button>
					</div>

					<div className='flex flex-col gap-3'>
						<button className='btn btn-ghost justify-start text-base'>🏠 Főoldal</button>
						<button
							onClick={() => {
								setIsOpen(false);
								navigate('/profile');
							}}
							className='btn btn-ghost justify-start text-base'
						>
							👤 Profil
						</button>
						<button className='btn btn-ghost justify-start text-base'>⭐ Toplista</button>
						<button className='btn btn-ghost justify-start text-base'>
							📊 Nézői statisztika
						</button>
					</div>
				</div>

				<div className='text-xs text-gray-400 text-center border-t border-base-200 pt-4'>
					FilmApp &copy; 2026
				</div>
			</div>
		</div>
	);
}

// --- Főoldal (Startpage) komponens ---
function Startpage() {
	const [movies, setMovies] = useState([]);
	const [movieRatings, setMovieRatings] = useState({});
	const [userFavorites, setUserFavorites] = useState([]);
	const [error, setError] = useState(null);

	// --- ÚJ: Ajánló szekció állapota ---
	const [recommendedMovies, setRecommendedMovies] = useState([]);
	const [recommendationMode, setRecommendationMode] = useState('personalized');

	const [selectedGenre, setSelectedGenre] = useState('Minden');
	const [selectedYear, setSelectedYear] = useState('Minden');
	const [searchTerm, setSearchTerm] = useState('');

	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem('user'));

	useEffect(() => {
		const fetchMoviesAndRatings = async () => {
			try {
				// 1. Filmek lekérése
				const response = await api.get('/api/movies');
				const moviesList = response.data;
				setMovies(moviesList);

				// 2. Ha be van jelentkezve a user, lekérjük a kedvenceit és az ajánlásait
				if (user) {
					try {
						const favRes = await api.get(`/api/favorites/${user.id}`);
						setUserFavorites(favRes.data.map((fav) => fav.id));
					} catch (err) {
						console.error('Hiba a kedvencek lekérésekor:', err);
					}

					// --- ÚJ: Személyre szabott ajánlások / Top lista fallback lekérése ---
					try {
						const recRes = await api.get(`/api/recommendations/${user.id}`);
						setRecommendedMovies(recRes.data.recommendations || []);
						setRecommendationMode(recRes.data.mode || 'personalized');
					} catch (err) {
						console.error('Hiba az ajánlások lekérésekor:', err);
					}
				}

				// 3. Minden filmhez lekérjük az értékeléseket
				const ratingsPromises = moviesList.map(async (movie) => {
					try {
						const ratingRes = await api.get(`/api/ratings/${movie.id}`);
						return {
							movieId: movie.id,
							averageRating: ratingRes.data.averageRating,
							totalVotes: ratingRes.data.totalVotes,
						};
					} catch (err) {
						return { movieId: movie.id, averageRating: 0, totalVotes: 0 };
					}
				});

				const ratingsResults = await Promise.all(ratingsPromises);

				const ratingsObj = {};
				ratingsResults.forEach((r) => {
					ratingsObj[r.movieId] = {
						averageRating: r.averageRating,
						totalVotes: r.totalVotes,
					};
				});

				setMovieRatings(ratingsObj);
			} catch (err) {
				console.error('Hiba a filmek vagy értékelések lekérésekor:', err);
				setError('Nem sikerült csatlakozni a szerverhez.');
			}
		};

		fetchMoviesAndRatings();
	}, []);

	// Kedvencek toggle funkció a kártyákhoz
	const handleFavoriteToggle = async (movieId, e) => {
		e.preventDefault();
		e.stopPropagation();

		if (!user) {
			navigate('/login');
			return;
		}

		const isFav = userFavorites.includes(movieId);

		try {
			if (isFav) {
				await api.delete(`/api/favorites/${user.id}/${movieId}`);
				setUserFavorites(userFavorites.filter((id) => id !== movieId));
			} else {
				await api.post('/api/favorites', {
					user_id: user.id,
					movie_id: movieId,
				});
				setUserFavorites([...userFavorites, movieId]);
			}
		} catch (err) {
			console.error('Hiba a kedvencek módosításakor:', err);
		}
	};

	// Összes műfaj kigyűjtése
	const uniqueGenres = ['Minden', ...new Set(movies.map((movie) => movie.genre).filter(Boolean))];

	// Összes megjelenési év kigyűjtése
	const extractedYears = movies
		.map((movie) => (movie.release_date ? movie.release_date.substring(0, 4) : null))
		.filter(Boolean);
	const uniqueYears = ['Minden', ...[...new Set(extractedYears)].sort((a, b) => b - a)];

	// Szűrés logika
	const filteredMovies = movies.filter((movie) => {
		const matchGenre = selectedGenre === 'Minden' || movie.genre === selectedGenre;
		const movieYear = movie.release_date ? movie.release_date.substring(0, 4) : null;
		const matchYear = selectedYear === 'Minden' || movieYear === selectedYear;
		const matchTitle = movie.title
			? movie.title.toLowerCase().includes(searchTerm.toLowerCase())
			: false;
		return matchGenre && matchYear && matchTitle;
	});

	// --- ÚJ: Segédfüggvény egy filmkártya kirajzolásához (hogy ne duplikáljuk a kártyakódot) ---
	const renderMovieCard = (movie) => {
		const stats = movieRatings[movie.id] || { averageRating: 0, totalVotes: 0 };
		const isFavorite = userFavorites.includes(movie.id);

		return (
			<Link
				to={`/movie/${movie.id}`}
				key={movie.id}
				className='card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col border border-base-200 overflow-hidden relative'
			>
				<figure className='w-full aspect-[2/3] m-0 rounded-t-2xl relative'>
					<img
						src={
							movie.poster_url ||
							'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F048%2F910%2F778%2Fnon_2x%2Fdefault-image-missing-placeholder-free-vector.jpg&f=1&nofb=1&ipt=93339020a140657a560ee8c01ec1a6a81156aded326d1ae7d41e8912d97d5896&ipo=images'
						}
						alt={movie.title || 'Film poszter'}
						className='w-full h-full object-cover'
					/>

					<button
						onClick={(e) => handleFavoriteToggle(movie.id, e)}
						className='absolute top-3 right-3 btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100 border-none shadow-md text-lg'
						title={isFavorite ? 'Eltávolítás a kedvencekből' : 'Hozzáadás a kedvencekhez'}
					>
						{isFavorite ? '❤️' : '🤍'}
					</button>
				</figure>

				<div className='card-body p-5 flex flex-col justify-between flex-grow text-center'>
					<div>
						<h2 className='card-title text-base justify-center text-center mb-1 flex items-center flex-wrap gap-2'>
							<span>{movie.title || 'Ismeretlen cím'}</span>
							{movie.isNew === 1 && (
								<span className='badge badge-secondary badge-sm font-bold'>ÚJ</span>
							)}
						</h2>

						<div className='flex justify-center items-center gap-1 text-sm font-semibold mb-2 text-warning'>
							<span>
								⭐ {stats.averageRating > 0 ? stats.averageRating : 'Nincs értékelés'}
							</span>
							{stats.totalVotes > 0 && (
								<span className='text-xs text-gray-500 font-normal'>
									({stats.totalVotes})
								</span>
							)}
						</div>

						<p className='text-xs text-gray-500 line-clamp-2'>
							{movie.description || 'Nincs elérhető leírás a filmhez.'}
						</p>
					</div>
				</div>
			</Link>
		);
	};

	return (
		<div className='w-full p-6'>
			<div className='flex items-center justify-between mb-8 max-w-7xl mx-auto'>
				<SideMenu />
				<h1 className='text-3xl font-bold flex-1 text-center'>Elérhető Filmek</h1>
				<div className='w-10'></div>
			</div>

			{/* --- ÚJ: "Neked ajánljuk" szekció --- */}
			{user && recommendedMovies.length > 0 && (
				<section className='max-w-7xl mx-auto mb-12'>
					<div className='flex flex-wrap items-center justify-between gap-2 mb-4 px-1'>
						<div className='flex items-center gap-3'>
							<h2 className='text-2xl font-bold'>Neked ajánljuk ✨</h2>
							<span className='badge badge-outline badge-sm'>
								{recommendationMode === 'top_fallback'
									? 'Globális Top lista'
									: 'Személyre szabott'}
							</span>
						</div>
						<span className='text-xs text-gray-500'>
							{recommendedMovies.length} ajánlott film
						</span>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
						{recommendedMovies.map((movie) => renderMovieCard(movie))}
					</div>

					<div className='divider my-10'>Összes film</div>
				</section>
			)}

			<div className='flex flex-col md:flex-row flex-wrap justify-center md:justify-end gap-4 mb-8 px-4'>
				<input
					type='text'
					placeholder='Keresés cím alapján...'
					className='input input-bordered w-full max-w-xs'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>

				<select
					className='select select-bordered w-full max-w-xs'
					value={selectedGenre}
					onChange={(e) => setSelectedGenre(e.target.value)}
				>
					{uniqueGenres.map((genre) => (
						<option key={genre} value={genre}>
							{genre === 'Minden' ? 'Minden műfaj' : genre}
						</option>
					))}
				</select>

				<select
					className='select select-bordered w-full max-w-xs'
					value={selectedYear}
					onChange={(e) => setSelectedYear(e.target.value)}
				>
					{uniqueYears.map((year) => (
						<option key={year} value={year}>
							{year === 'Minden' ? 'Minden év' : year}
						</option>
					))}
				</select>
			</div>

			{error && (
				<div className='alert alert-error shadow-lg max-w-md mx-auto mb-6'>
					<span>{error}</span>
				</div>
			)}

			{filteredMovies.length === 0 && !error && (
				<p className='text-gray-500 mt-10 text-center'>
					Nincs találat a megadott feltételekkel.
				</p>
			)}

			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto'>
				{filteredMovies.map((movie) => renderMovieCard(movie))}
			</div>
		</div>
	);
}

export default Startpage;
