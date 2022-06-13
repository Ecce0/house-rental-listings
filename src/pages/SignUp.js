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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      const user = userCredential.user
      updateProfile(auth.currentUser, {
        displayName: name
      })

      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()
      await setDoc(doc(db, 'users', user.uid), formDataCopy)

      navigate('/')

    } catch (error) {
      toast.error('Something\'s not right with the registration')
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
						type='text'
						className='mb-8 email' 
						placeholder='Name'
						id='name'
						value={name}
						onChange={onChange}
					/>
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
						<p className='cursor-pointer font-bold text-2xl'>Sign Up</p>
						<button >
							<ArrowRightIcon fill='#fff' width='20px' height='20px' />
						</button>
					</div>
				</form>

			 <OAuth />
				<Link to='/sign-in'  className='mt-16 text-accent font-semibold text-center mb-12'>
					Sign In Instead
				</Link>
			</div>
		</>
	)
}
export default SignUp
