import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Registerpage() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');

	const [error, setError] = useState(null);
	const [successMsg, setSuccessMsg] = useState('');

	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccessMsg('');

		if (password !== passwordConfirm) {
			setError('A két jelszó nem egyezik!');
			return;
		}

		try {
			const response = await api.post('/api/register', { name, email, password });

			setSuccessMsg('Sikeres regisztráció! Átirányítás a bejelentkezéshez...');

			setTimeout(() => {
				navigate('/login');
			}, 2000);

		} catch (err) {
			console.error('Hiba a regisztrációkor:', err);

			if (err.response && err.response.data && err.response.data.error) {
				setError(err.response.data.error);
			} else {
				setError('Sikertelen regisztráció. Kérlek próbáld újra később.');
			}
		}
	};

	return (
		<div className='flex items-center justify-center min-h-[80vh] px-4'>
			<div className='card w-full max-w-sm bg-base-100 shadow-2xl'>
				<div className='card-body'>
					<h2 className='card-title text-2xl font-bold justify-center mb-6'>Regisztráció</h2>

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

					<form onSubmit={handleRegister}>
						{/* Felhasználónév */}
						<div className='form-control w-full mb-4'>
							<label className='label'>
								<span className='label-text font-semibold'>Felhasználónév</span>
							</label>
							<input
								type='text'
								placeholder='Kovács János'
								className='input input-bordered w-full'
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

						{/* Email */}
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

						{/* Jelszó */}
						<div className='form-control w-full mb-4'>
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
								minLength='6'
							/>
						</div>

						<div className='form-control w-full mb-6'>
							<label className='label'>
								<span className='label-text font-semibold'>Jelszó újra</span>
							</label>
							<input
								type='password'
								placeholder='********'
								className='input input-bordered w-full'
								value={passwordConfirm}
								onChange={(e) => setPasswordConfirm(e.target.value)}
								required
							/>
						</div>

						<div className='form-control mt-2 flex flex-col gap-4'>
							<button
								type='submit'
								className='btn btn-primary w-full'
								disabled={successMsg !== ''}
							>
								Fiók létrehozása
							</button>

							<div className='divider my-1 text-gray-500 text-sm'>VAGY</div>

							<Link to='/login' className='btn btn-outline w-full'>
								Már van fiókom
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Registerpage;
