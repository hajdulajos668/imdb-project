import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Startpage() {
	const [movies, setMovies] = useState([]);
	const [error, setError] = useState(null);
	const [selectedGenre, setSelectedGenre] = useState('Minden');

	useEffect(() => {
		const fetchMovies = async () => {
			try {
				const response = await api.get('/api/movies');
				setMovies(response.data);
			} catch (err) {
				console.error('Hiba a filmek lekérésekor:', err);
				setError('Nem sikerült csatlakozni a szerverhez.');
			}
		};

		fetchMovies();
	}, []);

	const uniqueGenres = ['Minden', ...new Set(movies.map((movie) => movie.genre).filter(Boolean))];

	const filteredMovies =
		selectedGenre === 'Minden' ? movies : movies.filter((movie) => movie.genre === selectedGenre);

	return (
		<div className='w-full p-6 text-center'>
			<h1 className='text-3xl font-bold mb-8 text-center'>Elérhető Filmek</h1>

			<div className='flex justify-center md:justify-end mb-8 px-4'>
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
			</div>

			{error && (
				<div className='alert alert-error shadow-lg'>
					<span>{error}</span>
				</div>
			)}

			{filteredMovies.length === 0 && !error && (
				<p className='text-gray-500 mt-10'>Nincs találat ebben a műfajban.</p>
			)}

			<div className=' grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
				{filteredMovies.map((movie) => (
					<Link
						to={`/movie/${movie.id}`}
						key={movie.id}
						className='p-6 card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 block text-left'
					>
						<figure>
							<img
								src={
									movie.poster_url ||
									'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F048%2F910%2F778%2Fnon_2x%2Fdefault-image-missing-placeholder-free-vector.jpg&f=1&nofb=1&ipt=93339020a140657a560ee8c01ec1a6a81156aded326d1ae7d41e8912d97d5896&ipo=images'
								}
								alt={movie.title || 'Film poszter'}
								className='h-72 object-cover'
							/>
						</figure>
						<div className='card-body'>
							<h2 className='card-title'>
								{movie.title || 'Ismeretlen cím'}
								{movie.isNew === 1 && <div className='badge badge-secondary ml-3'>ÚJ</div>}
							</h2>
							<p className='text-sm text-gray-500 line-clamp-3'>
								{movie.description || 'Nincs elérhető leírás a filmhez.'}
							</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}

export default Startpage;
