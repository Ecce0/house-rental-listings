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
				<p>Categories</p>
				<div>
					<Link to='/category/rent'>
						<img src={rentCategoryImage} alt='rent' />
						<p>Places for Rent</p>
					</Link>
					<Link to='/category/sale'>
						<img src={sellCategoryImage} alt='sell' />
						<p>Places for Sale</p>
					</Link>
				</div>
			</main>
		</div>
	)
}

export default Availability
