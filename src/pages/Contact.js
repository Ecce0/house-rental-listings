import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'

const Contact = () => {
	const [message, setMessage] = useState('')
	const [landlord, setLandlord] = useState(null)
	// eslint-disable-next-line
	const [searchParams, setSearchParams] = useSearchParams()

	const params = useParams()

	useEffect(() => {
		const getLandlord = async () => {
			const docRef = doc(db, 'users', params.landlordId)
			const docSnap = await getDoc(docRef)
			if (docSnap.exists()) {
				setLandlord(docSnap.data())
			} else {
				toast.error("Could not get landlord's information")
			}
		}

		getLandlord()
	}, [params.landlordId])

	const onChange = (e) => {
		setMessage(e.target.value)
	}

	return (
		<div className='m-4'>
			<header>
				<p className='font-extrabold text-[2rem] '>Contact Landlord</p>
			</header>
			{landlord !== null && (
				<main>
					<div className='mt-8 flex items-center '>
						<p className='font-semibold text-[1.2rem] text-accent-content'>
							Contact {landlord?.name}
						</p>
					</div>
					<form className='mt-2'>
						<div className='mt-4 flex flex-col mb-8 text-accent-content'>
							<label htmlFor='message' className='mb-2'>
								Message
							</label>
							<textarea
								name='message'
								id='message'
								value={message}
								onChange={onChange}
								className='w-auto shadow-2xl border-none rounded-[3rem] h-[300px] md:w-1/2 outline-none py-4 px-6 text-base'
							></textarea>

							<a
								href={`mailto:${landlord.email}?Subject=${searchParams.get(
									'listingName'
								)}&body=${message}`}
							>
								<button
									type='button'
									className='cursor-pointer rounded-2xl py-3.5 px-8 font-semibold text-xl my-0 mx-auto flex items-center justify-center bg-gradient-to-r from-accent-focus to-secondary-content text-accent mt-8 mb-2 '
								>
									Send Message
								</button>
							</a>
						</div>
					</form>
				</main>
			)}
		</div>
	)
}

export default Contact
