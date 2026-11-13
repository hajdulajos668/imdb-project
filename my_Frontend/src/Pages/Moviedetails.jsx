import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';

function MovieDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [movie, setMovie] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [inWatchlist, setInWatchlist] = useState(false);
	const [watchlistMsg, setWatchlistMsg] = useState('');

	// Új state-ek az értékelésekhez
	const [ratingsData, setRatingsData] = useState({ ratings: [], averageRating: 0, totalVotes: 0 });
	const [userRating, setUserRating] = useState(5); // Alapértelmezett értékelési érték (1-5)
	const [ratingMsg, setRatingMsg] = useState('');

	const user = JSON.parse(localStorage.getItem('user'));

	const fetchData = async () => {
		try {
			setLoading(true);
			// Film adatok lekérése
			const movieRes = await api.get(`/api/movies/${id}`);
			setMovie(movieRes.data);

			// Értékelések lekérése
			const ratingsRes = await api.get(`/api/ratings/${id}`);
			setRatingsData(ratingsRes.data);

			// Ha be van jelentkezve a user, ellenőrizzük, hogy értékelt-e már
			if (user) {
				const existingVote = ratingsRes.data.ratings.find((r) => r.user_id === user.id);
				if (existingVote) {
					setUserRating(existingVote.rating);
				}

				const wlRes = await api.get(`/api/watchlist/${user.id}`);
				const exists = wlRes.data.some((item) => item.id === Number(id));
				setInWatchlist(exists);
			}
		} catch (err) {
			console.error('Hiba az adatok lekérésekor:', err);
			setError('Nem sikerült betölteni a film adatait.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (id) {
			fetchData();
		}
	}, [id, user?.id]);

	const handleWatchlistToggle = async () => {
		if (!user) {
			navigate('/login');
			return;
		}

		try {
			if (inWatchlist) {
				await api.delete(`/api/watchlist/${user.id}/${movie.id}`);
				setInWatchlist(false);
				setWatchlistMsg('Eltávolítva a Watchlistről.');
			} else {
				await api.post('/api/watchlist', {
					user_id: user.id,
					movie_id: movie.id,
				});
				setInWatchlist(true);
				setWatchlistMsg('Hozzáadva a Watchlisthez!');
			}
			setTimeout(() => setWatchlistMsg(''), 3000);
		} catch (err) {
			console.error('Hiba a watchlist módosításakor:', err);
			setWatchlistMsg(err.response?.data?.error || 'Hiba történt a művelet során.');
		}
	};

	// Értékelés elküldése / módosítása
	const handleRatingSubmit = async (e) => {
		e.preventDefault();
		if (!user) {
			navigate('/login');
			return;
		}

		try {
			await api.post('/api/ratings', {
				user_id: user.id,
				movie_id: movie.id,
				rating: Number(userRating),
			});
			setRatingMsg('Értékelés sikeresen elmentve!');
			setTimeout(() => setRatingMsg(''), 3000);

			// Frissítjük az értékeléseket, hogy az átlag azonnal frissüljön
			const ratingsRes = await api.get(`/api/ratings/${id}`);
			setRatingsData(ratingsRes.data);
		} catch (err) {
			console.error('Hiba az értékelés mentésekor:', err);
			setRatingMsg(err.response?.data?.error || 'Hiba történt az értékelés során.');
		}
	};

	// Értékelés törlése
	const handleRatingDelete = async () => {
		if (!user) return;

		try {
			await api.delete(`/api/ratings/${user.id}/${movie.id}`);
			setRatingMsg('Értékelés törölve.');
			setTimeout(() => setRatingMsg(''), 3000);
			setUserRating(5);

			// Újratöltjük az adatokat
			const ratingsRes = await api.get(`/api/ratings/${id}`);
			setRatingsData(ratingsRes.data);
		} catch (err) {
			console.error('Hiba az értékelés törlésekor:', err);
			setRatingMsg('Nem sikerült törölni az értékelést.');
		}
	};

	if (loading) {
		return (
			<div className='flex flex-col justify-center items-center min-h-[60vh] gap-3'>
				<span className='loading loading-spinner loading-lg text-primary'></span>
				<p className='text-gray-500 font-medium'>Film betöltése...</p>
			</div>
		);
	}

	if (error || !movie) {
		return (
			<div className='flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4'>
				<div className='alert alert-error max-w-md shadow-lg text-center'>
					<span>{error || 'A keresett film nem található.'}</span>
				</div>
				<Link to='/' className='btn btn-primary btn-sm'>
					&larr; Vissza a főoldalra
				</Link>
			</div>
		);
	}

	const defaultPoster =
		'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F048%2F910%2F778%2Fnon_2x%2Fdefault-image-missing-placeholder-free-vector.jpg&f=1&nofb=1&ipt=93339020a140657a560ee8c01ec1a6a81156aded326d1ae7d41e8912d97d5896&ipo=images';

	const poster = movie.poster_url || defaultPoster;
	const hasUserVoted = ratingsData.ratings.some((r) => r.user_id === user?.id);

	return (
		<div className='max-w-5xl mx-auto px-4 py-8'>
			<div className='mb-6'>
				<Link to='/' className='btn btn-ghost btn-sm gap-2'>
					&larr; Vissza a filmekhez
				</Link>
			</div>

			<div className='bg-base-100 rounded-3xl shadow-xl border border-base-200 overflow-hidden p-6 md:p-8'>
				<div className='flex flex-col md:flex-row gap-8 items-start'>
					<div className='w-full md:w-72 flex-shrink-0 flex justify-center'>
						<div className='relative rounded-2xl overflow-hidden shadow-lg border border-base-200 w-full max-w-[280px]'>
							<img
								src={poster}
								alt={movie.title}
								className='w-full h-[420px] object-cover'
							/>
							{movie.isNew === 1 && (
								<span className='absolute top-3 right-3 badge badge-secondary font-bold shadow'>
									ÚJ
								</span>
							)}
						</div>
					</div>
					<div className='flex-1 flex flex-col justify-between w-full h-full min-h-[420px]'>
						<div>
							<div className='flex flex-wrap justify-between items-start gap-4 mb-3'>
								<h1 className='text-3xl md:text-4xl font-extrabold text-base-content'>
									{movie.title}
								</h1>
								{/* Globális átlag badge */}
								<div className='badge badge-lg badge-primary gap-1 font-bold p-3'>
									⭐ {ratingsData.averageRating} / 5
									<span className='text-xs opacity-75 font-normal'>
										({ratingsData.totalVotes} szavazat)
									</span>
								</div>
							</div>

							<div className='flex flex-wrap items-center gap-2 mb-6'>
								{movie.genre && (
									<div className='badge badge-lg badge-outline font-semibold'>
										{movie.genre}
									</div>
								)}
								{movie.release_date && (
									<div className='badge badge-lg bg-base-200 border-none font-medium text-gray-600'>
										Kiadás: {new Date(movie.release_date).toLocaleDateString('hu-HU')}
									</div>
								)}
							</div>

							<hr className='border-base-200 my-4' />

							<div className='space-y-2'>
								<h2 className='text-sm font-bold uppercase tracking-wider text-gray-500'>
									Leírás
								</h2>
								<p className='text-base-content/85 text-base leading-relaxed text-justify'>
									{movie.description || 'Ehhez a filmhez jelenleg nincs elérhető leírás.'}
								</p>
							</div>
						</div>

						<div className='pt-8 mt-6 border-t border-base-200'>
							{watchlistMsg && (
								<div className='alert alert-info py-2 px-4 mb-4 text-sm'>
									<span>{watchlistMsg}</span>
								</div>
							)}

							{/* Watchlist és Értékelés gombok/szekció */}
							<div className='flex flex-wrap gap-3 items-center'>
								<button
									onClick={handleWatchlistToggle}
									className={`btn px-6 ${
										inWatchlist
											? 'bg-emerald-600 hover:bg-emerald-700 text-white border-none'
											: 'btn-primary'
									}`}
								>
									{inWatchlist ? '✓ Watchlisten van (Eltávolítás)' : '+ Watchlisthez adás'}
								</button>
							</div>

							{/* Értékelés szekció */}
							<div className='mt-6 p-4 bg-base-200/50 rounded-2xl border border-base-200'>
								<h3 className='text-sm font-bold uppercase tracking-wider text-gray-500 mb-3'>
									Film értékelése (1 - 5 csillag)
								</h3>

								{ratingMsg && (
									<div className='alert alert-success py-2 px-4 mb-3 text-sm'>
										<span>{ratingMsg}</span>
									</div>
								)}

								{user ? (
									<form
										onSubmit={handleRatingSubmit}
										className='flex flex-wrap items-center gap-3'
									>
										<select
											value={userRating}
											onChange={(e) => setUserRating(e.target.value)}
											className='select select-bordered select-sm w-32 font-semibold'
										>
											<option value='1'>⭐</option>
											<option value='2'>⭐⭐</option>
											<option value='3'>⭐⭐⭐</option>
											<option value='4'>⭐⭐⭐⭐</option>
											<option value='5'>⭐⭐⭐⭐⭐</option>
										</select>

										<button type='submit' className='btn btn-sm btn-primary'>
											{hasUserVoted ? 'Értékelés módosítása' : 'Értékelés leadása'}
										</button>

										{hasUserVoted && (
											<button
												type='button'
												onClick={handleRatingDelete}
												className='btn btn-sm btn-error btn-outline'
											>
												Értékelés törlése
											</button>
										)}
									</form>
								) : (
									<p className='text-sm text-gray-500'>
										Az értékeléshez kérlek{' '}
										<Link to='/login' className='text-primary font-semibold underline'>
											jelentkezz be
										</Link>
										!
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MovieDetails;
