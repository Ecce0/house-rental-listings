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
				className='content-center hover:cursor-pointer h-full absolute '
				onClick={() => navigate('/availability')}
			/>
		</div>
	)
}

export default Home
