import React from 'react'
import { Link } from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import Carousel from '../components/Carousel'
import monochrome from '../assets/monochrome.svg'

const Availability = () => {
	return (
		<div className='sm:container mx-auto mt-5'>
			<header>
				<img src={monochrome} alt="logo" className='flex p-16 mr-20' />		
			</header> 
			<main>
				<Carousel />
				<div className='divide-y divide-dashed'>
					<p className='my-12 font-bold text-center text-4xl overline text-neutral-content'>
						Categories
					</p>
				</div>
				<div className='flex justify-around mb-16'>
					<div className='mt-2 mb-10 rounded-xl p-1 bg-gradient-to-r from-[#f8b8e6] via-[#3d2636] to-[#f8b8e6]'>
					<Link to='/type/rent' className='flex justify-between'>
					<div className='bg-primary rounded-2xl '>
						<div className='max-w-sm  rounded-2xl overflow-hidden shadow-lg'>
							<img
								className='hover:animate-pulse min-h-115 h-full object-cover mx-auto my-0 w-full'
								src={rentCategoryImage}
								alt='Sunset in the mountains'
							/>
							<div className='px-6 pb-8 py-4'>
								<div className='font-bold text-xl mb-2 text-accent'>Places For Rent</div>
								<p className='text-accent-focus'>
									The best pads located in the most hip neighborhoods. Check out our rentals; we're sure it won't be a miss.
								</p>
							</div>
							<div className='px-6 pt-4 pb-2'>
								<span className='inline-block bg-accent-content rounded-full px-3 py-1 text-sm font-semibold text-secondary mr-2 mb-2'>
									#CLTRentals
								</span>
								<span className='inline-block bg-accent-content rounded-full px-3 py-1 text-sm font-semibold text-secondary mr-2 mb-2'>
									#LiveNCLT
								</span>
								<span className='inline-block bg-accent-content rounded-full px-3 py-1 text-sm font-semibold text-secondary mr-2 mb-2'>
									#CLT
								</span>
							</div>
						</div>
					</div>
						
					</Link> 
					</div>
					<div className='mt-2 mb-12 rounded-xl p-1 bg-gradient-to-r from-[#f8b8e6] via-[#3d2636] to-[#f8b8e6]'>
					<Link to='/type/sale' className='flex justify-between'>
					<div className='bg-white rounded-2xl '>
						<div className='max-w-sm  rounded-2xl overflow-hidden shadow-lg'>
							<img
								className='hover:animate-pulse min-h-115 h-full object-cover mx-auto my-0 w-full'
								src={sellCategoryImage}
								alt='Sunset in the mountains'
							/>
							<div className='px-6 py-4'>
								<div className='font-bold text-xl mb-2 text-accent'>Places For Sale</div>
								<p className='text-accent-focus'>
									From townhomes to mansions, we deliver the best and modern available properties to make your dream living come true. 
								</p>
							</div>
							<div className='px-6 pt-4 pb-2'>
								<span className='inline-block bg-accent-content rounded-full px-3 py-1 text-sm font-semibold text-secondary mr-2 mb-2'>
									#QueenCityHomes
								</span>
								<span className='inline-block bg-accent-content rounded-full px-3 py-1 text-sm font-semibold text-secondary mr-2 mb-2'>
									#704houses
								</span>								
							</div>
						</div>
					</div>
					</Link>
					</div>
				</div>
			</main>
		</div>
	)
}

export default Availability
