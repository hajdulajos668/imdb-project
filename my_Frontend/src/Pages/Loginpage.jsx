import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Loginpage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const [successMsg, setSuccessMsg] = useState('');

	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccessMsg('');

		try {
			const response = await api.post('/api/login', { email, password });

			localStorage.setItem('user', JSON.stringify(response.data.user));

			setSuccessMsg('Sikeres bejelentkezés! Irány a főoldal...');

			setTimeout(() => {
				navigate('/');
				window.location.reload();
			}, 1500);
		} catch (err) {
			console.error('Hiba a bejelentkezéskor:', err);

			if (err.response && err.response.data && err.response.data.error) {
				setError(err.response.data.error);
			} else {
				setError('Sikertelen bejelentkezés. Nem sikerült csatlakozni a szerverhez.');
			}
		}
	};

	return (
		<div className='flex items-center justify-center min-h-[80vh] px-4'>
			<div className='card w-full max-w-sm bg-base-100 shadow-2xl'>
				<div className='card-body'>
					<h2 className='card-title text-2xl font-bold justify-center mb-6'>Bejelentkezés</h2>

					{error && (
						<div className='alert alert-error text-sm p-3 mb-4 rounded-lg'>
							<span>{error}</span>
						</div>
					)}

					{successMsg && (
						<div className='alert alert-success text-sm p-3 mb-4 rounded-lg'>
							<span>{successMsg}</span>
						</div>
					)}

					<form onSubmit={handleLogin}>
						<div className='form-control w-full mb-4'>
							<label className='label'>
								<span className='label-text font-semibold'>Email cím</span>
							</label>
							<input
								type='email'
								placeholder='pelda@email.com'
								className='input input-bordered w-full'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div className='form-control w-full mb-6'>
							<label className='label'>
								<span className='label-text font-semibold'>Jelszó</span>
							</label>
							<input
								type='password'
								placeholder='********'
								className='input input-bordered w-full'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<div className='form-control mt-2 flex flex-col gap-4'>
							<button
								type='submit'
								className='btn btn-primary w-full'
								disabled={successMsg !== ''}
							>
								Bejelentkezés
							</button>

							<div className='divider my-1 text-gray-500 text-sm'>
								Ha még nem vagy regisztrálva:
							</div>

							<Link to='/register' className='btn btn-outline w-full'>
								Regisztráció
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Loginpage;
