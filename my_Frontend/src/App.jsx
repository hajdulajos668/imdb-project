import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Adminroute from './components/Adminroute.jsx';
import AppNavbar from './Components/Navbar.jsx';
import Adminpage from './Pages/Adminpage.jsx';
import Loginpage from './Pages/Loginpage.jsx';
import MovieDetails from './Pages/Moviedetails.jsx';
import Profilepage from './Pages/Profilepage.jsx';
import Registerpage from './Pages/Registerpage';
import Startpage from './Pages/Startpage';
import Toplist from './Pages/Toplist.jsx';

function App() {
	useEffect(() => {
		document.title = 'FilmekProjekt';
		document.querySelector("link[rel~='icon']").href = '/movie-reel.png';
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
					<Route path='/profile' element={<Profilepage />} />
					<Route path='/toplist' element={<Toplist />} />
					<Route
						path='/admin'
						element={
							<Adminroute>
								<Adminpage />
							</Adminroute>
						}
					/>
				</Routes>
			</div>
		</Router>
	);
}
export default App;
