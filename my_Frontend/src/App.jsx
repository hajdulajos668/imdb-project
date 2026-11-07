import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AppNavbar from './Components/Navbar.jsx';
import Loginpage from './Pages/Loginpage.jsx';
import MovieDetails from './Pages/Moviedetails.jsx';
import Registerpage from './Pages/Registerpage';
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
					<Route path='/login' element={<Loginpage />} />
					<Route path='/register' element={<Registerpage />} />
				</Routes>
			</div>
		</Router>
	);
}
export default App;
