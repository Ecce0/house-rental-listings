import React from 'react'
import { Link } from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import Carousel from '../components/Carousel'

const Availability = () => {
	return (
		<div className='sm:container mx-auto mt-5'>
			<header>
				<h4 className='inline-block text-4xl font-extrabold antialiased text-emerald-500 mb-1'>Welcome to E. Collier Real Estate</h4>
				<p className='font-medium mb-2 text-1xl text-emerald-600'>
					Specializing in modern and luxury style properties available within
					Charlotte, NC and beyond
				</p>
			</header>
			<main>
				<Carousel />
				<p className="my-12 font-bold text-center text-4xl overline text-violet-500">Categories</p>
				<div className='flex justify-between'>
					<Link to='/type/rent' className='flex justify-between w-1/2'>
						<img src={rentCategoryImage} alt='rent' className='hover:animate-pulse min-h-115 h-full rounded-3xl object-cover mx-auto my-0 w-11/12'/>
						
					</Link>
					<Link to='/type/sale'  className='flex justify-between w-1/2'>
						<img src={sellCategoryImage} alt='sell' className='hover:animate-pulse min-h-115 h-full rounded-3xl object-cover mx-auto my-0 w-11/12'/>
						
					</Link>
          
         
				</div>
        <div className='flex justify-around text-emerald-500 font-medium'>
        <p className='text-left font-normal'>Places for Rent</p>
          <p className='text-left font-normal'>Places for Sale</p>
          </div>
			</main>
		</div>
	)
}

export default Availability
