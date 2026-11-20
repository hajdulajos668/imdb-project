import { useEffect, useState } from 'react';
import api from '../api';

function AdminPage() {
	const [activeTab, setActiveTab] = useState('movies');
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

	// Új film űrlap állapotai
	const [title, setTitle] = useState('');
	const [genre, setGenre] = useState('');
	const [releaseDate, setReleaseDate] = useState('');
	const [posterUrl, setPosterUrl] = useState('');
	const [description, setDescription] = useState('');
	const [isNew, setIsNew] = useState(true);

	const user = JSON.parse(localStorage.getItem('user'));

	// Segédfüggvény az értesítésekhez
	const showMessage = (type, text) => {
		setStatusMsg({ type, text });
		setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
	};

	// Filmek lekérése
	const fetchMovies = async () => {
		try {
			setLoading(true);
			const res = await api.get('/api/movies');
			setMovies(res.data);
		} catch (err) {
			console.error('Hiba a filmek lekérésekor:', err);
			showMessage('error', 'Nem sikerült betölteni a filmeket.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMovies();
	}, []);

	// Új film beküldése
	const handleAddMovie = async (e) => {
		e.preventDefault();
		try {
			await api.post(
				'/api/movies',
				{
					title,
					genre,
					description,
					release_date: releaseDate,
					poster_url: posterUrl,
					isNew,
				},
				{
					headers: { 'user-id': user.id },
				},
			);

			showMessage('success', 'Film sikeresen hozzáadva!');
			// Űrlap alaphelyzetbe állítása
			setTitle('');
			setGenre('');
			setReleaseDate('');
			setPosterUrl('');
			setDescription('');
			setIsNew(true);

			// Lista frissítése
			fetchMovies();
		} catch (err) {
			console.error('Hiba a mentéskor:', err);
			showMessage('error', err.response?.data?.error || 'Hiba történt a film mentésekor.');
		}
	};

	// Film törlése
	const handleDeleteMovie = async (movieId, movieTitle) => {
		if (!window.confirm(`Biztosan törölni szeretnéd a(z) "${movieTitle}" című filmet?`)) {
			return;
		}

		try {
			await api.delete(`/api/movies/${movieId}`, {
				headers: { 'user-id': user.id },
			});
			showMessage('success', 'Film sikeresen törölve.');
			setMovies(movies.filter((m) => m.id !== movieId));
		} catch (err) {
			console.error('Hiba a törléskor:', err);
			showMessage('error', err.response?.data?.error || 'Nem sikerült törölni a filmet.');
		}
	};

	return (
		<div className='max-w-6xl mx-auto px-4 py-8'>
			<h1 className='text-3xl font-extrabold mb-6'>Adminisztrátori Vezérlőpult</h1>

			{/* Fülek */}
			<div
				role='tablist'
				className='justify-evenly rounded-md tabs tabs-boxed mb-8 bg-base-200 p-1'
			>
				<button
					role='tab'
					className={`tab font-semibold ${activeTab === 'movies' ? 'tab-active' : ''}`}
					onClick={() => setActiveTab('movies')}
				>
					🎬 Filmek kezelése
				</button>
				<button
					role='tab'
					className={`tab font-semibold ${activeTab === 'users' ? 'tab-active' : ''}`}
					onClick={() => setActiveTab('users')}
				>
					👥 Felhasználók
				</button>
				<button
					role='tab'
					className={`tab font-semibold ${activeTab === 'reviews' ? 'tab-active' : ''}`}
					onClick={() => setActiveTab('reviews')}
				>
					💬 Vélemények moderálása
				</button>
			</div>

			{/* Visszajelző üzenet */}
			{statusMsg.text && (
				<div
					className={`alert ${statusMsg.type === 'error' ? 'alert-error' : 'alert-success'} mb-6 shadow-md`}
				>
					<span>{statusMsg.text}</span>
				</div>
			)}

			{/* Tartalom */}
			<div className='bg-base-100 rounded-md shadow-xl border border-base-200 p-6'>
				{activeTab === 'movies' && (
					<div className='space-y-10'>
						{/* Új film hozzáadása */}
						<div>
							<h2 className='text-xl font-bold mb-4'>Új film hozzáadása</h2>
							<form
								onSubmit={handleAddMovie}
								className='grid rounded-md grid-cols-1 md:grid-cols-2 gap-4 bg-base-200/40 p-5 rounded-2xl border border-base-200'
							>
								<div className='form-control'>
									<label className='label'>
										<span className='label-text font-semibold'>Film címe *</span>
									</label>
									<input
										type='text'
										placeholder='pl. Eredet'
										className='input input-bordered w-full'
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										required
									/>
								</div>

								<div className='form-control'>
									<label className='label'>
										<span className='label-text font-semibold'>Műfaj *</span>
									</label>
									<input
										type='text'
										placeholder='pl. Sci-Fi, Akció'
										className='input input-bordered w-full'
										value={genre}
										onChange={(e) => setGenre(e.target.value)}
										required
									/>
								</div>

								<div className='form-control'>
									<label className='label'>
										<span className='label-text font-semibold'>Megjelenés dátuma *</span>
									</label>
									<input
										type='date'
										className='input input-bordered w-full'
										value={releaseDate}
										onChange={(e) => setReleaseDate(e.target.value)}
										required
									/>
								</div>

								<div className='form-control'>
									<label className='label'>
										<span className='label-text font-semibold'>Poszter kép URL</span>
									</label>
									<input
										type='url'
										placeholder='https://...'
										className='input input-bordered w-full'
										value={posterUrl}
										onChange={(e) => setPosterUrl(e.target.value)}
									/>
								</div>

								<div className='form-control md:col-span-2'>
									<label className='label'>
										<span className='label-text font-semibold'>Leírás</span>
									</label>
									<textarea
										placeholder='Rövid ismertető a filmről...'
										className='textarea textarea-bordered h-24 w-full'
										value={description}
										onChange={(e) => setDescription(e.target.value)}
									></textarea>
								</div>

								<div className='form-control md:col-span-2 flex-row items-center justify-between pt-2'>
									<label className='label cursor-pointer gap-3'>
										<input
											type='checkbox'
											className='checkbox checkbox-secondary'
											checked={isNew}
											onChange={(e) => setIsNew(e.target.checked)}
										/>
										<span className='label-text font-semibold'>
											Megjelölés "ÚJ" jelvénnyel
										</span>
									</label>

									<button type='submit' className='justify-evenly btn btn-primary px-8'>
										+ Film mentése
									</button>
								</div>
							</form>
						</div>

						<hr className='border-base-200' />

						{/* Meglévő filmek táblázata */}
						<div>
							<h2 className='text-xl font-bold mb-4'>
								Adatbázisban lévő filmek ({movies.length})
							</h2>
							{loading ? (
								<div className='flex justify-center py-8'>
									<span className='loading loading-spinner loading-md text-primary'></span>
								</div>
							) : (
								<div className='overflow-x-auto'>
									<table className='table table-zebra w-full'>
										<thead>
											<tr>
												<th>Poszter</th>
												<th>Cím</th>
												<th>Műfaj</th>
												<th>Kiadás</th>
												<th>Státusz</th>
												<th className='text-right'>Művelet</th>
											</tr>
										</thead>
										<tbody>
											{movies.map((movie) => (
												<tr key={movie.id}>
													<td>
														<div className='avatar'>
															<div className='w-12 h-16 rounded'>
																<img
																	src={
																		movie.poster_url ||
																		'https://via.placeholder.com/150'
																	}
																	alt={movie.title}
																/>
															</div>
														</div>
													</td>
													<td className='font-bold'>{movie.title}</td>
													<td>
														<span className='badge badge-outline'>{movie.genre}</span>
													</td>
													<td>
														{movie.release_date
															? new Date(movie.release_date).toLocaleDateString(
																	'hu-HU',
																)
															: '-'}
													</td>
													<td>
														{movie.isNew === 1 ? (
															<span className='badge badge-secondary badge-sm font-bold'>
																ÚJ
															</span>
														) : (
															<span className='text-xs text-gray-400'>Normál</span>
														)}
													</td>
													<td className='text-right'>
														<button
															onClick={() =>
																handleDeleteMovie(movie.id, movie.title)
															}
															className='btn btn-error btn-xs text-white'
														>
															Törlés
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>
					</div>
				)}

				{activeTab === 'users' && (
					<div>
						<h2 className='text-xl font-bold mb-4'>Regisztrált felhasználók</h2>
						<p className='text-gray-500 text-sm'>Ez a fül következik a filmek után.</p>
					</div>
				)}

				{activeTab === 'reviews' && (
					<div>
						<h2 className='text-xl font-bold mb-4'>Legutóbbi hozzászólások</h2>
						<p className='text-gray-500 text-sm'>Ez a fül következik a felhasználók után.</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default AdminPage;
