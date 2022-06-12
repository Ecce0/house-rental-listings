import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg'
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg'
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg'
import { GiFamilyHouse, GiMagnifyingGlass } from 'react-icons/gi'
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
			<footer className="sticky-bottom">
				<nav className='sm:container flex bg-black p-3 justify-center'>					
						<ul className='sm:flex flex-row text-purple-700 mx-2px sm:space-x-16 justify-evenly'>
							<li className=' hover:animate-pulse hover:text-purple-400' onClick={() => navigate('/')}>
								<GiMagnifyingGlass size={60} color='#64cca2' />
								<p>Availability</p>
							</li>
							<li className=' hover:animate-pulse hover:text-purple-200' onClick={() => navigate('/offers')}>
								<FaRegHandshake size={60} color='#64cca2' />
								<p>Deals</p>
							</li>
							<li className=' hover:animate-pulse hover:text-purple-200' onClick={() => navigate('/profile')}>
								<CgProfile size={60} color='#64cca2' />
								<p>Profile</p>
							</li>
						</ul>
				</nav>
			</footer>   
		</>
	)
}

export default Navbar
