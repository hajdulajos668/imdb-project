import { useState } from 'react';
import { Link } from 'react-router-dom';

function AppNavbar() {
	const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
	const closeDropdown = () => {
		const elem = document.activeElement;
		if (elem) {
			elem.blur();
		}
	};
	const handleLogout = () => {
		localStorage.removeItem('user');
		setIsLoggedIn(false);
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
										? 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
										: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' // Üres profilkép, ha nincs bejelentkezve
								}
							/>
						</div>
					</div>
					<ul
						tabIndex={-1}
						className='menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow'
					>
						{isLoggedIn ? (
							<>
								<li>
									<Link to='/profile' onClick={closeDropdown} className='justify-between'>
										Profile
									</Link>
								</li>
								<li>
									<button onClick={handleLogout}>Logout</button>
								</li>
							</>
						) : (
							<li>
								<Link to='/login' onClick={closeDropdown}>
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
