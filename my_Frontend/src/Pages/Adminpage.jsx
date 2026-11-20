import { useState } from 'react';

function AdminPage() {
	const [activeTab, setActiveTab] = useState('movies');

	return (
		<div className='max-w-6xl mx-auto px-4 py-8'>
			<h1 className='text-3xl font-extrabold mb-6'>Adminisztrátori Vezérlőpult</h1>

			{/* Fülek a különböző admin funkciókhoz */}
			<div
				role='tablist'
				className='justify-evenly rounded-2xl tabs tabs-boxed mb-8 bg-base-200 p-1'
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

			{/* A kiválasztott fül tartalma */}
			<div className='bg-base-100 rounded-2xl shadow-xl border border-base-200 p-6'>
				{activeTab === 'movies' && (
					<div>
						<h2 className='text-xl font-bold mb-4'>Filmek hozzáadása és szerkesztése</h2>
						{/* Ide jön majd az új film űrlap és a filmek listája */}
					</div>
				)}

				{activeTab === 'users' && (
					<div>
						<h2 className='text-xl font-bold mb-4'>Regisztrált felhasználók</h2>
						{/* Ide jön majd a felhasználók táblázata (admin jog adása/elvétele) */}
					</div>
				)}

				{activeTab === 'reviews' && (
					<div>
						<h2 className='text-xl font-bold mb-4'>Legutóbbi hozzászólások</h2>
						{/* Ide jön majd a hozzászólások listája törlés gombbal */}
					</div>
				)}
			</div>
		</div>
	);
}

export default AdminPage;
