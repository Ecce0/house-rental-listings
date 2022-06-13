import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GiMagnifyingGlass } from 'react-icons/gi'
import { FaRegHandshake } from 'react-icons/fa'
import { CgProfile } from 'react-icons/cg'

const Navbar = () => {
	const navigate = useNavigate()
	const location = useLocation()

	const pathMatchRoute = (route) => {
		if (route === location.pathname) {
			return true
		}
	}

	return (
		<>
			<footer className="fixed-bottom justify-content-center align-items-center">
				<nav className=' flex bg-black p-3 justify-center h-24'>					
						<ul className='flex flex-row text-purple-700 mx-2px space-x-16 justify-evenly'>
							<li className=' hover:animate-pulse hover:text-purple-400 flex flex-col items-center' onClick={() => navigate('/')}>
								<GiMagnifyingGlass 
								  size={60} 
									color={pathMatchRoute('/') ? '#160726' : '#64cca2'} />
								<p className={pathMatchRoute('/') ? '#160726' : '#64cca2'}>Availability</p>
							</li>
							<li className=' hover:animate-pulse hover:text-purple-400 flex flex-col items-center' onClick={() => navigate('/deals')}>
								<FaRegHandshake 
								size={60} 
								color={pathMatchRoute('/deals') ? '#160726' : '#64cca2'} />
								<p className={pathMatchRoute('/deals') ? '#160726' : '#64cca2'}>Deals</p>
							</li>
							<li className=' hover:animate-pulse hover:text-purple-400 flex flex-col items-center' onClick={() => navigate('/user-profile')}>
								<CgProfile 
								size={60} 
								color={pathMatchRoute('/user-profile') ? '#160726' : '#64cca2'} />
								<p className={pathMatchRoute('/user-profile') ? '#160726' : '#64cca2'}>Profile</p>
							</li>
						</ul>
				</nav>
			</footer>   
		</>
	)
}

export default Navbar
