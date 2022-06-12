import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Availability from './pages/Availability'
import Offer from './pages/Offer'
import Category from './pages/Category'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import Listing from './pages/Listing'
import Contact from './pages/Contact'
import SignUp from './pages/SignUp'
import EditListing from './pages/EditListing'
import CreateListing from './pages/CreateListing'
import ForgotPassword from './pages/ForgotPassword'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


function App() {
	return (
		<div className="sm:container mx-auto px-5 bg-black">
			<Router>
				<Routes>
					<Route path='/' element={<Availability />} />
					<Route path='/offers' element={<Offer />} />
					<Route path='/category/:categoryName' element={<Category />} />
					<Route path='/profile' element={<PrivateRoute />}>
						<Route path='/profile' element={<Profile />} />
					</Route>
					<Route path='/sign-in' element={<SignIn />} />
					<Route path='/sign-up' element={<SignUp />} />
					<Route path='/forgot-password' element={<ForgotPassword />} />
					<Route path='/create-listing' element={<CreateListing />} />
					<Route path='/edit-listing/:listingId' element={<EditListing />} />
					<Route path='/category/:categoryName/:listingId' element={<Listing />} />
					<Route path='/contact/:landlordId' element={<Contact />} />
				</Routes>
				<Navbar />
			</Router>
			<ToastContainer />
		</div>
	)
}

export default App
