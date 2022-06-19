import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'

const PasswordReminder = () => {
	const [email, setEmail] = useState('')

	const onChange = (e) => {
		setEmail(e.target.value)
	}

	const onSubmit = async (e) => {
		e.preventDefault()

		try {
			const auth = getAuth()
			await sendPasswordResetEmail(auth, email)
			toast.success('Email was sent')
		} catch (error) {
			toast.error('Could not send reset email')
		}
	}

	return (
		<div className='mb-56 m:mb-[400px]'>
			<header>
				<p className='text-3xl font-extrabold mb-4 mt-8 ml-4'>Forgot Password</p>
			</header>

			<form onSubmit={onSubmit} className='w-full max-w-xs'>
				<div className='md:flex md:items-center mb-6'>
					<div className='md:w-1/3'>
						<label className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>
							Email
						</label>
					</div>
					<div className='md:w-2/3'>
						<input
							type='email'
							placeholder='Email'
							className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8'
							id='email'
							value={email}
							onChange={onChange}
						/>
					</div>
				</div>

				<div className='md:flex md:items-center'>
					<div className='md:w-1/3 flex flex-row'></div>
					<div className='md:w-2/3'>
						<Link
							to='/sign-in'
							className='cursor-pointer font-semibold text-right text-accent'
						>
							<button
								className='shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded'
								type='button'
								onClick={onSubmit}
							>
								Send Reset Link
							</button>
							<button className='flex justify-center items-center w-12 h-12 border-50'>
								<ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
							</button>
						</Link>
					</div>
				</div>
			</form>
		</div>
	)
}

export default PasswordReminder
