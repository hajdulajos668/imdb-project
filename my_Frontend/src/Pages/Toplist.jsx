import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Toplist() {
    const [moviesWithStats, setMoviesWithStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchToplist = async () => {
            try {
                setLoading(true);
                // 1. Filmek lekérése
                const res = await api.get('/api/movies');
                const movies = res.data;

                // 2. Minden filmhez lekérjük az értékelési statisztikákat
                const statsPromises = movies.map(async (movie) => {
                    try {
                        const ratingRes = await api.get(`/api/ratings/${movie.id}`);
                        return {
                            ...movie,
                            averageRating: ratingRes.data.averageRating || 0,
                            totalVotes: ratingRes.data.totalVotes || 0,
                        };
                    } catch (err) {
                        return {
                            ...movie,
                            averageRating: 0,
                            totalVotes: 0,
                        };
                    }
                });

                const results = await Promise.all(statsPromises);

                // 3. Sorba rendezés: átlagos értékelés szerint csökkenőbe, majd szavazatszám szerint
                results.sort((a, b) => {
                    if (b.averageRating !== a.averageRating) {
                        return b.averageRating - a.averageRating;
                    }
                    return b.totalVotes - a.totalVotes;
                });

                setMoviesWithStats(results);
            } catch (err) {
                console.error('Hiba a toplista betöltésekor:', err);
                setError('Nem sikerült betölteni a toplistát.');
            } finally {
                setLoading(false);
            }
        };

        fetchToplist();
    }, []);

    if (loading) {
        return (
            <div className='flex flex-col justify-center items-center min-h-[60vh] gap-3'>
                <span className='loading loading-spinner loading-lg text-primary'></span>
                <p className='text-gray-500 font-medium'>Toplista betöltése...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4'>
                <div className='alert alert-error max-w-md shadow-lg text-center'>
                    <span>{error}</span>
                </div>
                <Link to='/' className='btn btn-primary btn-sm'>
                    &larr; Vissza a főoldalra
                </Link>
            </div>
        );
    }

    return (
        <div className='max-w-4xl mx-auto px-4 py-8'>
            <div className='flex flex-col items-center justify-center mb-10 text-center relative'>
                <Link to='/' className='absolute left-0 btn btn-ghost btn-sm'>
                    &larr; Vissza
                </Link>
                <h1 className='text-4xl font-serif font-bold tracking-wide text-base-content'>
                    Film Toplista
                </h1>
                <p className='text-sm text-gray-400 mt-1 font-light'>
                    A legmagasabbra értékelt alkotások a közösség szavazatai alapján
                </p>
            </div>

            {moviesWithStats.length === 0 ? (
                <p className='text-gray-500 text-center py-10'>Még nincsenek filmek a rendszerben.</p>
            ) : (
                <div className='space-y-4'>
                    {moviesWithStats.map((movie, index) => {
                        const rank = index + 1;
                        let badgeColor = 'badge-ghost';
                        if (rank === 1) badgeColor = 'badge-warning font-bold text-black';
                        else if (rank === 2) badgeColor = 'badge-neutral font-bold';
                        else if (rank === 3) badgeColor = 'badge-accent font-bold';

                        return (
                            <Link
                                to={`/movie/${movie.id}`}
                                key={movie.id}
                                className='flex items-center gap-4 p-4 bg-base-100 rounded-2xl shadow-md border border-base-200 hover:shadow-lg transition-all'
                            >
                                {/* Helyezés / Rang badge */}
                                <div className={`badge badge-lg ${badgeColor} w-10 h-10 flex items-center justify-center text-lg flex-shrink-0`}>
                                    {rank}
                                </div>

                                {/* Film poszter */}
                                <img
                                    src={
                                        movie.poster_url ||
                                        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F048%2F910%2F778%2Fnon_2x%2Fdefault-image-missing-placeholder-free-vector.jpg&f=1&nofb=1&ipt=93339020a140657a560ee8c01ec1a6a81156aded326d1ae7d41e8912d97d5896&ipo=images'
                                    }
                                    alt={movie.title}
                                    className='w-14 h-20 object-cover rounded-lg flex-shrink-0'
                                />

                                {/* Film adatok */}
                                <div className='flex-grow min-w-0'>
                                    <h2 className='font-bold text-lg truncate'>{movie.title}</h2>
                                    <div className='flex items-center gap-2 text-sm text-gray-500 mt-1'>
                                        {movie.genre && <span className='badge badge-outline badge-sm'>{movie.genre}</span>}
                                        {movie.release_date && (
                                            <span>{new Date(movie.release_date).getFullYear()}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Értékelés mutató */}
                                <div className='flex flex-col items-end flex-shrink-0 pl-2'>
                                    <div className='text-warning font-extrabold text-lg flex items-center gap-1'>
                                        ⭐ {movie.averageRating > 0 ? movie.averageRating : 'N/A'}
                                    </div>
                                    <span className='text-xs text-gray-400'>
                                        {movie.totalVotes} szavazat
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Toplist;