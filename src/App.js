import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Availability from './pages/Availability'
import Deals from './pages/Deals'
import Type from './pages/Type'
import UserProfile from './pages/UserProfile'
import SignIn from './pages/SignIn'
import Listing from './pages/Listing'
import Contact from './pages/Contact'
import SignUp from './pages/SignUp'
import EditListing from './pages/EditListing'
import CreateListing from './pages/CreateListing'
import PasswordReminder from './pages/PasswordReminder'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


//Fix mapcontainer first
//Then go back and fix styling on all routes
//Then go back and fix navbar styling - why is it not sitting at bottom, what is the white space on back?
//Make it all responsive




function App() {
	return (
		<div className='bg-gradient-to-r from-[#3d2636] font-serif'>
			<Router>
				<Routes>
					<Route exact path='/' element={<Home />} />					
					<Route path='/availability' element={<Availability />} />
					<Route path='/deals' element={<Deals />} />
					<Route path='/type/:typeName' element={<Type />} />
					<Route path='/user-profile' element={<PrivateRoute />}>
						<Route path='/user-profile' element={<UserProfile />} />
					</Route>
					<Route path='/sign-in' element={<SignIn />} />
					<Route path='/sign-up' element={<SignUp />} />
					<Route path='/password-reminder' element={<PasswordReminder />} />
					<Route path='/create-listing' element={<CreateListing />} />
					<Route path='/edit-listing/:listingId' element={<EditListing />} />
					<Route path='/type/:typeName/:listingId' element={<Listing />} />
					<Route path='/contact/:landlordId' element={<Contact />} />
				</Routes>
				<Navbar />
			</Router>
			<ToastContainer />
		</div>
	)
}

export default App
