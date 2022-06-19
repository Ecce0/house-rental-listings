import React from 'react'
import { useNavigate } from 'react-router-dom'
import cover from '../assets/cover.png'

const Home = () => {
	const navigate = useNavigate()

	return (
		<div className='w-full h-full'>
			<img
				src={cover}
				alt='homepage'
				className='flex items-center mt-48 w-auto h-auto md:mt-0 md:content-center hover:cursor-pointer md:h-full md:absolute'
				onClick={() => navigate('/availability')}
			/>
		</div>
	)
}

export default Home
