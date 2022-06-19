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

	if (pathMatchRoute('/')) {
		return null
	} else {
		return (
			<>
				<footer className='fixed-bottom justify-center items-center'>
					<nav className=' flex bg-base-100 p-3 justify-center h-16'>
						<ul className='flex flex-row text-neutral-content space-x-16 justify-evenly'>
							<li
								className='hover:animate-pulse flex flex-col items-center'
								onClick={() => navigate('/availability')}
							>
								<GiMagnifyingGlass
									size={60}
									color={
										pathMatchRoute('/availability') ? '#3d2636' : '#d7a64c'
									}
								/>
								<p
									className={
										pathMatchRoute('/availability')
											? 'text-accent-focus'
											: 'text-base-content'
									}
								>
									Availability
								</p>
							</li>
							<li
								className='hover:animate-pulse flex flex-col items-center'
								onClick={() => navigate('/deals')}
							>
								<FaRegHandshake
									size={60}
									color={pathMatchRoute('/deals') ? '#3d2636' : '#d7a64c'}
								/>
								<p
									className={
										pathMatchRoute('/deals')
											? 'text-accent-focus'
											: 'text-base-content'
									}
								>
									Deals
								</p>
							</li>
							<li
								className='hover:animate-pulse flex flex-col items-center'
								onClick={() => navigate('/user-profile')}
							>
								<CgProfile
									size={60}
									color={
										pathMatchRoute('/user-profile') ? '#3d2636' : '#d7a64c'
									}
								/>
								<p
									className={
										pathMatchRoute('/user-profile')
											? 'text-accent-focus'
											: 'text-base-content'
									}
								>
									Profile
								</p>
							</li>
						</ul>
					</nav>
				</footer>
			</>
		)
	}
}

export default Navbar
