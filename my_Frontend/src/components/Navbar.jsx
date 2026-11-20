import { useState } from 'react';
import { Link } from 'react-router-dom';

function AppNavbar() {
	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem('user');
		return savedUser ? JSON.parse(savedUser) : null;
	});

	const isLoggedIn = !!user;
	const isAdmin = user?.is_admin === 1;

	const closeDropdown = () => {
		const elem = document.activeElement;
		if (elem) {
			elem.blur();
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('user');
		setUser(null);
		closeDropdown();
		window.location.href = '/';
	};

	return (
		<div className='navbar bg-base-100 shadow-sm'>
			<div className='flex-1'>
				<Link to='/' className='btn btn-ghost text-xl'>
					FilmekProjekt
				</Link>
			</div>
			<div className='flex gap-2'>
				<div className='dropdown dropdown-end'>
					<div tabIndex={0} role='button' className='btn btn-ghost btn-circle avatar'>
						<div className='w-10 rounded-full'>
							<img
								alt='Felhasználó avatar'
								src={
									isLoggedIn
										? 'https://media.istockphoto.com/id/1461684797/vector/user-profile-sign-with-check-mark-icon-vector.jpg?s=612x612&w=0&k=20&c=1pcxr7a1aoSPyCqcFAA51dF-2DV4XWFYRWQavzvg7gY='
										: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
								}
							/>
						</div>
					</div>
					<ul
						tabIndex={-1}
						className='menu menu-md dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow'
					>
						{isAdmin && (
							<li className='w-full'>
								<Link
									to='/admin'
									onClick={closeDropdown}
									className='w-full text-sm font-medium'
								>
									Admin Panel
								</Link>
							</li>
						)}

						{isLoggedIn ? (
							<>
								<li className='w-full'>
									<Link
										to='/profile'
										onClick={closeDropdown}
										className='w-full text-sm font-medium'
									>
										Profile
									</Link>
								</li>
								<li className='w-full'>
									<button onClick={handleLogout} className='w-full text-sm font-medium'>
										Logout
									</button>
								</li>
							</>
						) : (
							<li className='w-full'>
								<Link
									to='/login'
									onClick={closeDropdown}
									className='w-full text-sm font-medium'
								>
									Login
								</Link>
							</li>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
}

export default AppNavbar;
