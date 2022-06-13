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
		<div className='m-4'>
			<header>
				<p className='text-3xl font-extrabold'>Forgot Password</p>
			</header>
			<main>
				<form onSubmit={onSubmit}>
					<input
						type='email'
						placeholder='Email'
						className='mb-8 email'
						id='email'
						value={email}
						onChange={onChange}
					/>
          <Link  to='/sign-in' className='cursor-pointer font-semibold text-right text-accent'>
            Sign In
            </Link> 
            <div className='mt-12 flex justify-between items-center inherit'>
              <div className='text-2xl font-bold'>
                Send Reset Link
                <button className='flex justify-center items-center w-12 h-12 border-50'>
                  <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
                </button>
              </div>
            </div>
				</form>
			</main>
		</div>
	)
}

export default PasswordReminder
