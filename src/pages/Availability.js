import React from 'react'
import { Link } from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import Carousel from '../components/Carousel'

const Availability = () => {
	return (
		<div className='sm:container mx-auto mt-5'>
			<header>
				<h4 className='inline-block text-4xl font-extrabold antialiased text-base-content mb-1'>
					Welcome to E. Collier Real Estate
				</h4>
				<p className='font-medium mb-2 text-1xl text-base-content'>
					Specializing in modern and luxury style properties available within
					Charlotte, NC and beyond
				</p>
			</header>
			<main>
				<Carousel />
				<div className='divide-y divide-dashed'>
					<p className='my-12 font-bold text-center text-4xl overline text-neutral-content'>
						Categories
					</p>
				</div>
				<div className='flex justify-between'>
					{/* <Link to='/type/rent' className='flex justify-between w-1/2'>
						<img
							src={rentCategoryImage}
							alt='rent'
							className='hover:animate-pulse min-h-115 h-full rounded-3xl object-cover mx-auto my-0 w-11/12'
						/>
					</Link>
					<Link to='/type/sale' className='flex justify-between w-1/2'>
						<img
							src={sellCategoryImage}
							alt='sell'
							className='hover:animate-pulse min-h-115 h-full rounded-3xl object-cover mx-auto my-0 w-11/12'
						/>
					</Link> */}
					<Link to='/type/rent' className='flex justify-between w-1/2'>
					<div className='bg-white rounded-2xl '>
						<div className='max-w-sm  rounded-2xl overflow-hidden shadow-lg'>
							<img
								className='hover:animate-pulse min-h-115 h-full object-cover mx-auto my-0 w-full'
								src={rentCategoryImage}
								alt='Sunset in the mountains'
							/>
							<div className='px-6 py-4'>
								<div className='font-bold text-xl mb-2'>Places For Rent</div>
								<p className='text-gray-700 text-base'>
									Lorem ipsum dolor sit amet, consectetur adipisicing elit.
									Voluptatibus quia, nulla! Maiores et perferendis eaque,
									exercitationem praesentium nihil.
								</p>
							</div>
							<div className='px-6 pt-4 pb-2'>
								<span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
									#photography
								</span>
								<span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
									#travel
								</span>
								<span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
									#winter
								</span>
							</div>
						</div>
					</div>
					</Link>
				</div>
			</main>
		</div>
	)
}

export default Availability
