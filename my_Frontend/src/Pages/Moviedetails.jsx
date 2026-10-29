import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await api.get(`/api/movies/${id}`);
                setMovie(response.data);
            } catch (err) {
                console.error('Hiba a film adatainak lekérésekor:', err);
                setError('Nem sikerült betölteni a film adatait.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMovie();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-gray-500 font-medium">Film betöltése...</p>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
                <div className="alert alert-error max-w-md shadow-lg text-center">
                    <span>{error || 'A keresett film nem található.'}</span>
                </div>
                <Link to="/" className="btn btn-primary btn-sm">
                    &larr; Vissza a főoldalra
                </Link>
            </div>
        );
    }

    const defaultPoster =
        ''
    const poster = movie.poster_url || defaultPoster;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link to="/" className="btn btn-ghost btn-sm gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Vissza a filmekhez
                </Link>
            </div>
            <div className="bg-base-100 rounded-3xl shadow-xl border border-base-200 overflow-hidden p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    
                    <div className="w-full md:w-72 flex-shrink-0 flex justify-center">
                        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-base-200 w-full max-w-[280px]">
                            <img
                                src={poster}
                                alt={movie.title}
                                className="w-full h-[420px] object-cover"
                            />
                            {movie.isNew === 1 && (
                                <span className="absolute top-3 right-3 badge badge-secondary font-bold shadow">
                                    ÚJ
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between w-full h-full min-h-[420px]">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-base-content mb-3">
                                {movie.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                {movie.genre && (
                                    <div className="badge badge-lg badge-outline font-semibold">
                                        {movie.genre}
                                    </div>
                                )}
                                {movie.release_date && (
                                    <div className="badge badge-lg bg-base-200 border-none font-medium text-gray-600">
                                        Kiadás: {new Date(movie.release_date).toLocaleDateString('hu-HU')}
                                    </div>
                                )}
                            </div>

                            <hr className="border-base-200 my-4" />

                            <div className="space-y-2">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                                    Leírás
                                </h2>
                                <p className="text-base-content/85 text-base leading-relaxed text-justify">
                                    {movie.description || 'Ehhez a filmhez jelenleg nincs elérhető leírás.'}
                                </p>
                            </div>
                        </div>
                        <div className="pt-8 mt-6 border-t border-base-200 flex flex-wrap gap-3">
                            <button className="btn btn-primary px-6">
                                Értékelés hozzáadása
                            </button>
                            <Link to="/" className="btn btn-outline">
                                Vissza a listához
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MovieDetails;