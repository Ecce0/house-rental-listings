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
			<div>
				<header>
					<p>Welcome Back!</p>
				</header>

				<form onSubmit={onSubmit}>
        <input
						type='text'
						
						placeholder='Name'
						id='name'
						value={name}
						onChange={onChange}
					/>
					<input
						type='email'
						
						placeholder='Email'
						id='email'
						value={email}
						onChange={onChange}
					/>
					<div>
						<input
							type={showPass ? 'text' : 'password'}
							
							placeholder='Password'
							id='password'
							value={password}
							onChange={onChange}
						/>
							<img
								src={visibilityIcon}
								alt='show password'
								
								onClick={() => setShowPass((prevState) => !prevState)}
							/>					
					</div>

					<Link to='/forgot-password'>
						Forgot Password
					</Link>
					<div>
						<p>Sign Up</p>
						<button >
							<ArrowRightIcon fill='#fff' width='20px' height='20px' />
						</button>
					</div>
				</form>

			 <OAuth />
				<Link to='/sign-in'>
					Sign In Instead
				</Link>
			</div>
		</>
	)
}
export default SignUp
