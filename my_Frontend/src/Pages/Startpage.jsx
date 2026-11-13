import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Startpage() {
	const [movies, setMovies] = useState([]);
	const [movieRatings, setMovieRatings] = useState({});
	const [error, setError] = useState(null);

	const [selectedGenre, setSelectedGenre] = useState('Minden');
	const [selectedYear, setSelectedYear] = useState('Minden');
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		const fetchMoviesAndRatings = async () => {
			try {
				// 1. Filmek lekérése
				const response = await api.get('/api/movies');
				const moviesList = response.data;
				setMovies(moviesList);

				// 2. Minden filmhez lekérjük az értékeléseket a meglévő API-val
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

				// Objektumba rendezzük ID alapján
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

	return (
		<div className='w-full p-6'>
			<h1 className='text-3xl font-bold mb-8 text-center'>Elérhető Filmek</h1>

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
				{filteredMovies.map((movie) => {
					const stats = movieRatings[movie.id] || { averageRating: 0, totalVotes: 0 };

					return (
						<Link
							to={`/movie/${movie.id}`}
							key={movie.id}
							className='card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col border border-base-200 overflow-hidden'
						>
							<figure className='w-full aspect-[2/3] m-0 rounded-t-2xl'>
								<img
									src={
										movie.poster_url ||
										'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F048%2F910%2F778%2Fnon_2x%2Fdefault-image-missing-placeholder-free-vector.jpg&f=1&nofb=1&ipt=93339020a140657a560ee8c01ec1a6a81156aded326d1ae7d41e8912d97d5896&ipo=images'
									}
									alt={movie.title || 'Film poszter'}
									className='w-full h-full object-cover'
								/>
							</figure>

							<div className='card-body p-5 flex flex-col justify-between flex-grow text-center'>
								<div>
									{/* Cím és az ÚJ jelzés egymás mellett */}
									<h2 className='card-title text-base justify-center text-center mb-1 flex items-center flex-wrap gap-2'>
										<span>{movie.title || 'Ismeretlen cím'}</span>
										{movie.isNew === 1 && (
											<span className='badge badge-secondary badge-sm font-bold'>
												ÚJ
											</span>
										)}
									</h2>

									{/* Átlagos értékelés */}
									<div className='flex justify-center items-center gap-1 text-sm font-semibold mb-2 text-warning'>
										<span>
											⭐{' '}
											{stats.averageRating > 0 ? stats.averageRating : 'Nincs értékelés'}
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
				})}
			</div>
		</div>
	);
}

export default Startpage;
