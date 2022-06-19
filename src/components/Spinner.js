import React from 'react'
const Spinner = () => {
	return (
		<div className='fixed top-[0%] right-[0%] left-[0%] botton-[0%] w-full h-full bg-accent-content z-5000 flex justify-center items-center'>
			<div className='w-[64px] h-[64px] border border-solid border-8 border-black animate-spin'></div>
		</div>
	)
}

export default Spinner
