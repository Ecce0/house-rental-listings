import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import OAuth from '../components/OAuth'

const SignIn = () => {
	const [showPass, setShowPass] = useState(false)
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	})

	const { email, password } = formData
	const navigate = useNavigate()

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}))
	}

	const onSubmit = async (e) => {
		e.preventDefault()

		try {
			const auth = getAuth()
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			)

			if (userCredential.user) {
				navigate('/')
			}
		} catch (error) {
			toast.error('Bad User Credentials')
		}
	}

	return (
		<>
			<div className='m-4'>
				<header>
					<p className='text-3xl font-extrabold'>Welcome Back!</p>
				</header>

				<form onSubmit={onSubmit}>
					<input
						type='email'
						className='mb-8 email' 
						placeholder='Email'
						id='email'
						value={email}
						onChange={onChange}
					/>
					<div className='relative'>
						<input
							type={showPass ? 'text' : 'password'}
							className='mb-8 password'
							placeholder='Password'
							id='password'
							value={password}
							onChange={onChange}
						/>
						<img
							src={visibilityIcon}
							alt='show password'
							className='cursor-pointer absolute p-4 showPassword'
							onClick={() => setShowPass((prevState) => !prevState)}
						/>
					</div>

					<Link to='/forgot-password' className='cursor-pointer text-accent font-semibold text-right'>
						Forgot Password
					</Link>
					<div className='flex justify-between inherit items-center mt-12'>
						<p className='cursor-pointer font-bold text-2xl'>Sign In</p>
						<button>
							<ArrowRightIcon fill='#fff' width='34px' height='34px' />
						</button>
					</div>
				</form>

				<OAuth />

				<Link to='/sign-up' className='mt-16 text-accent font-semibold text-center mb-12'>
					Sign Up Instead
				</Link>
			</div>
		</>
	)
}
export default SignIn
