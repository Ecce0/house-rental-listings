import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import OAuth from '../components/OAuth'

const SignUp = () => {
	const [showPass, setShowPass] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
	})
	const { name, email, password } = formData
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
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			)

			const user = userCredential.user
			updateProfile(auth.currentUser, {
				displayName: name,
			})

			const formDataCopy = { ...formData }
			delete formDataCopy.password
			formDataCopy.timestamp = serverTimestamp()
			await setDoc(doc(db, 'users', user.uid), formDataCopy)

			navigate('/')
		} catch (error) {
			toast.error("Something's not right with the registration")
		}
	}

	return (
		<>
			<div className='m-4'>
				<header>
					<p className='text-3xl font-extrabold mb-4'>Welcome Back!</p>
				</header>

				<form onSubmit={onSubmit} className='w-full max-w-xs'>
					<div className='md:flex md:items-center mb-6'>
						<div className='md:w-1/3'>
							<label
								className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'
								for='inline-name'
							>
								Name
							</label>
						</div>
						<div className='md:w-2/3'>
							<input
								type='text'
								className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8'
								placeholder='Name'
								id='name'
								value={name}
								onChange={onChange}
							/>
						</div>
					</div>
					<div className='md:flex md:items-center mb-6'>
						<div className='md:w-1/3'>
							<label
								className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'
								for='inline-email'
							>
								Email
							</label>
						</div>
						<div className='md:w-2/3'>
							<input
								type='email'
								className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8'
								placeholder='Email'
								id='email'
								value={email}
								onChange={onChange}
							/>
						</div>
					</div>
					

					<div className='md:flex md:items-center mb-6'>
						<div className='md:w-1/3'>
							<label
								className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'
								for='inline-password'
							>
								Password
							</label>
						</div>
						<div className='w-2/3 relative'>
							<input
								type={showPass ? 'text' : 'password'}
								placeholder='Password'
								className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8'
								id='password'
								value={password}
								onChange={onChange}
							/>
							<img
								src={visibilityIcon}
								alt='show password'
								className='cursor-pointer absolute h-4 w-4 right-[0.1px] bottom-[16px]'
								onClick={() => setShowPass((prevState) => !prevState)}
							/>
						</div>
					</div>

					<div className='md:flex md:items-center'>
						<div className='md:w-1/3'></div>
						<div className='md:w-2/3'>
							<button
								className='shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded'
								type='button'
							>
								Sign In
							</button>
							<div className='flex flex-row justify-between'>
								<Link
									to='/forgot-password'
									className='cursor-pointer text-accent-content font-semibold text-right '
								>
									Forgot Password
								</Link>

								<button>
									<ArrowRightIcon fill='#fff' width='34px' height='34px' />
								</button>
							</div>
						</div>
					</div>
				</form>

			

				<OAuth />
				<Link
					to='/sign-in'
					className='flex justify-center mt-16 text-white font-semibold text-center mb-12'
				>
					Sign In Instead
				</Link>
			</div>
		</>
	)
}
export default SignUp
