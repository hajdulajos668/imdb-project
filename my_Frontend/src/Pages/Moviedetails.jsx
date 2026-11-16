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

	// Új state a kedvencekhez (szív ikon)
	const [isFavorite, setIsFavorite] = useState(false);

	// Értékelések és hozzászólások state-ek
	const [ratingsData, setRatingsData] = useState({ ratings: [], averageRating: 0, totalVotes: 0 });
	const [userRating, setUserRating] = useState(5);
	const [reviewText, setReviewText] = useState('');
	const [ratingMsg, setRatingMsg] = useState('');

	const user = JSON.parse(localStorage.getItem('user'));

	const fetchData = async () => {
		try {
			setLoading(true);
			const movieRes = await api.get(`/api/movies/${id}`);
			setMovie(movieRes.data);

			const ratingsRes = await api.get(`/api/ratings/${id}`);
			setRatingsData(ratingsRes.data);

			if (user) {
				const existingVote = ratingsRes.data.ratings.find((r) => r.user_id === user.id);
				if (existingVote) {
					setUserRating(existingVote.rating);
					setReviewText(existingVote.review_text || '');
				}

				const wlRes = await api.get(`/api/watchlist/${user.id}`);
				const exists = wlRes.data.some((item) => item.id === Number(id));
				setInWatchlist(exists);

				// Kedvencek ellenőrzése
				const favRes = await api.get(`/api/favorites/${user.id}`);
				const favExists = favRes.data.some((item) => item.id === Number(id));
				setIsFavorite(favExists);
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

	// Kedvencek kezelése (Szív ikon)
	const handleFavoriteToggle = async () => {
		if (!user) {
			navigate('/login');
			return;
		}

		try {
			if (isFavorite) {
				await api.delete(`/api/favorites/${user.id}/${movie.id}`);
				setIsFavorite(false);
			} else {
				await api.post('/api/favorites', {
					user_id: user.id,
					movie_id: movie.id,
				});
				setIsFavorite(true);
			}
		} catch (err) {
			console.error('Hiba a kedvencek módosításakor:', err);
		}
	};

	// Értékelés és hozzászólás elküldése / módosítása
	const handleRatingSubmit = async (e) => {
		e.preventDefault();
		if (!user) {
			navigate('/login');
			return;
		}

		// Karakterlimit ellenőrzés kliens oldalon is
		if (reviewText.trim().length > 0 && (reviewText.length < 5 || reviewText.length > 2000)) {
			setRatingMsg('A hozzászólásnak 5 és 2000 karakter között kell lennie!');
			return;
		}

		try {
			await api.post('/api/ratings', {
				user_id: user.id,
				movie_id: movie.id,
				rating: Number(userRating),
				review_text: reviewText.trim() === '' ? null : reviewText,
			});
			setRatingMsg('Vélemény sikeresen elmentve!');
			setTimeout(() => setRatingMsg(''), 3000);

			const ratingsRes = await api.get(`/api/ratings/${id}`);
			setRatingsData(ratingsRes.data);
		} catch (err) {
			console.error('Hiba az értékelés mentésekor:', err);
			setRatingMsg(err.response?.data?.error || 'Hiba történt az értékelés során.');
		}
	};

	// Értékelés / Hozzászólás törlése
	const handleRatingDelete = async () => {
		if (!user) return;

		try {
			await api.delete(`/api/ratings/${user.id}/${movie.id}`);
			setRatingMsg('Vélemény törölve.');
			setTimeout(() => setRatingMsg(''), 3000);
			setUserRating(5);
			setReviewText('');

			const ratingsRes = await api.get(`/api/ratings/${id}`);
			setRatingsData(ratingsRes.data);
		} catch (err) {
			console.error('Hiba az értékelés törlésekor:', err);
			setRatingMsg('Nem sikerült törölni a véleményt.');
		}
	};

	// Monogram generáló segédfüggvény az avatrhoz
	const getInitials = (name) => {
		if (!name) return 'U';
		const parts = name.trim().split(' ');
		if (parts.length >= 2) {
			return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
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

								{/* Szív gomb a kedvencekhez */}
								<button
									onClick={handleFavoriteToggle}
									className={`btn btn-circle ${
										isFavorite ? 'btn-error text-white' : 'btn-outline border-gray-300'
									}`}
									title={
										isFavorite ? 'Eltávolítás a kedvencekből' : 'Hozzáadás a kedvencekhez'
									}
								>
									{isFavorite ? '❤️' : '🤍'}
								</button>
							</div>

							{/* Értékelés és Hozzászólás Beküldő Szekció */}
							<div className='mt-6 p-5 bg-base-200/50 rounded-2xl border border-base-200'>
								<h3 className='text-sm font-bold uppercase tracking-wider text-gray-500 mb-3'>
									Vélemény:
								</h3>

								{ratingMsg && (
									<div className='alert alert-success py-2 px-4 mb-3 text-sm'>
										<span>{ratingMsg}</span>
									</div>
								)}

								{user ? (
									<form onSubmit={handleRatingSubmit} className='flex flex-col gap-4'>
										<div className='flex flex-wrap items-center gap-3'>
											<select
												value={userRating}
												onChange={(e) => setUserRating(e.target.value)}
												className='select select-bordered select-sm w-36 font-semibold'
											>
												<option value='1'>⭐</option>
												<option value='2'>⭐⭐</option>
												<option value='3'>⭐⭐⭐</option>
												<option value='4'>⭐⭐⭐⭐</option>
												<option value='5'>⭐⭐⭐⭐⭐</option>
											</select>
										</div>

										<div className='flex flex-col gap-1'>
											<textarea
												value={reviewText}
												onChange={(e) => setReviewText(e.target.value)}
												placeholder='Írd meg a véleményed a filmről!'
												className='textarea textarea-bordered w-full h-28 text-sm'
												maxLength={2000}
											></textarea>
											<div className='flex justify-between text-xs text-gray-400 px-1'>
												<span>Min. 5 karakter</span>
												<span
													className={
														reviewText.length > 0 && reviewText.length < 5
															? 'text-error font-bold'
															: ''
													}
												>
													{reviewText.length} / 2000
												</span>
											</div>
										</div>

										<div className='flex flex-wrap gap-2 items-center'>
											<button type='submit' className='btn btn-sm btn-primary'>
												{hasUserVoted ? 'Vélemény frissítése' : 'Vélemény beküldése'}
											</button>

											{hasUserVoted && (
												<button
													type='button'
													onClick={handleRatingDelete}
													className='btn btn-sm btn-error btn-outline'
												>
													Vélemény törlése
												</button>
											)}
										</div>
									</form>
								) : (
									<p className='text-sm text-gray-500'>
										A hozzászóláshoz és értékeléshez kérlek{' '}
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

				{/* --- HOZZÁSZÓLÁSOK LISTÁJA (Időrendben, legújabb elöl) --- */}
				<div className='mt-12 pt-8 border-t border-base-200'>
					<h2 className='text-xl font-bold mb-6 text-base-content'>
						Felhasználói vélemények ({ratingsData.totalVotes})
					</h2>

					{ratingsData.ratings.length === 0 ? (
						<p className='text-gray-500 italic text-sm'>
							Ehhez a filmhez még senki nem írt véleményt. Legyél te az első!
						</p>
					) : (
						<div className='space-y-4'>
							{ratingsData.ratings.map((rev) => {
								const isEdited =
									rev.updated_at && new Date(rev.updated_at) > new Date(rev.created_at);
								const formattedDate = new Date(rev.created_at).toLocaleString('hu-HU', {
									year: 'numeric',
									month: '2-digit',
									day: '2-digit',
									hour: '2-digit',
									minute: '2-digit',
								});

								return (
									<div
										key={rev.id}
										className='p-4 bg-base-200/40 rounded-2xl border border-base-200 flex flex-col gap-3'
									>
										<div className='flex items-center justify-between'>
											<div className='flex items-center gap-3'>
												{/* Monogramos avatár */}
												<div className='w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm shadow'>
													{getInitials(rev.user_name)}
												</div>
												<div>
													<h4 className='font-bold text-base-content text-sm'>
														{rev.user_name}
													</h4>
													<div className='flex items-center gap-2 text-xs text-gray-400'>
														<span>{formattedDate}</span>
														{isEdited && (
															<span className='italic font-medium text-primary'>
																(Szerkesztve)
															</span>
														)}
													</div>
												</div>
											</div>
											<div className='badge badge-ghost font-bold'>
												{'⭐'.repeat(rev.rating)} ({rev.rating}/5)
											</div>
										</div>

										{rev.review_text ? (
											<p className='text-base-content/90 text-sm leading-relaxed whitespace-pre-line pl-13'>
												{rev.review_text}
											</p>
										) : (
											<p className='text-gray-400 text-xs italic pl-13'>
												Megjegyzés nélkül
											</p>
										)}
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default MovieDetails;
