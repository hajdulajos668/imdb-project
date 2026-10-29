import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AppNavbar from './Components/Navbar.jsx';
import MovieDetails from './Pages/Moviedetails.jsx';
import Startpage from './Pages/Startpage';

function App() {
	useEffect(() => {
		document.title = 'FilmekProj';
	}, []);

	return (
		<Router>
			<div>
				<AppNavbar />
				<Routes>
					<Route path='/' element={<Startpage />} />
					<Route path='/movie/:id' element={<MovieDetails />} />
				</Routes>
			</div>
		</Router>
	);
}
export default App;
