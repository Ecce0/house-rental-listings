import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getAuth, updateProfile } from 'firebase/auth'
import {
	updateDoc,
	doc,
	collection,
	getDocs,
	query,
	where,
	orderBy,
	deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListItem from '../components/ListItem'

const UserProfile = () => {
	const auth = getAuth()
	const navigate = useNavigate()
	const [changeDetails, setChangeDetails] = useState(false)
	const [loading, setLoading] = useState(true)
	const [listings, setListings] = useState([])
	const [formData, setFormData] = useState({
		name: auth.currentUser.displayName,
		email: auth.currentUser.email,
	})

	const { name, email } = formData

	useEffect(() => {
		const fetchUserListings = async () => {
			const listingsRef = collection(db, 'listings')
			const q = query(
				listingsRef,
				where('userRef', '==', auth.currentUser.uid),
				orderBy('timestamp', 'desc')
			)
			const querySnap = await getDocs(q)
			let listings = []
			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				})
			})
			setListings(listings)
			setLoading(false)
		}

		fetchUserListings()
	}, [auth.currentUser.uid])

	const onLogout = () => {
		auth.signOut()
		navigate('/')
	}

	const onSubmit = async () => {
		try {
			if (auth.currentUser.displayName !== name) {
				await updateProfile(auth.currentUser, {
					displayName: name,
				})

				const userRef = doc(db, 'users', auth.currentUser.uid)
				await updateDoc(userRef, {
					name,
				})
			}
		} catch (error) {
			toast.error('Uh oh, something went wrong')
		}
	}

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}))
	}

	const onDelete = async (listingId) => {
		if (window.confirm('Are you sure you want to delete?')) {
			await deleteDoc(doc(db, 'listings', listingId))
			const updatedListings = listings.filter(
				(listing) => listing.id !== listingId
			)
			setListings(updatedListings)
			toast.success('Successfully deleted listing')
		}
	}

	const onEdit = (listingId) => {
		navigate(`/edit-listing/${listingId}`)
	}

	return (
		<div className='mb-40 p-12'>
			<header className='flex justify-between items-center'>
				<p className='text-3xl font-extrabold'>My Profile</p>
				<button
					className='cursor-pointer text-base bg-base-300 text-base-content font-semibold rounded-2xl py-1 px-3 '
					type='button'
					onClick={onLogout}
				>
					Logout
				</button>
			</header>
			<main>
				<div className='flex justify-between max-w-lg'>
					<p className='font-semibold'>Personal Details</p>
					<p
						className='cursor-pointer font-semi-bold text-secondary bg-accent-content rounded-xl p-1 mb-2'
						onClick={() => {
							changeDetails && onSubmit()
							setChangeDetails((prevState) => !prevState)
						}}
					>
						{changeDetails ? 'done' : 'change'}
					</p>
				</div>
				<div className='bg-accent-content rounded-2xl p-4 shadow-2xl max-w-lg text-secondary'>
					<form>
						<input
							type='text'
							id='name'
							className={!changeDetails ? 'userName' : 'userName bg-accent-content'}
							disabled={!changeDetails}
							value={name}
							onChange={onChange}
						/>
						<input
							type='text'
							id='email'
							className={!changeDetails ? 'userName' : 'userName bg-accent-content'}
							disabled={!changeDetails}
							value={email}
							onChange={onChange}
						/>
					</form>
				</div>

				<Link
					to='/create-listing'
					className='bg-accent-content rounded-2xl py-1 px-4 shadow-2xl mt-8 font-semibold max-w-lg flex justify-between items-center text-secondary'
				>
					<img src={homeIcon} alt='home' />
					<p>Sale or rent your home!</p>
					<img src={arrowRight} alt='arrow right' />
				</Link>

				{!loading && listings?.length > 0 && (
					<div className='flex justify-start flex-col mr-[600px]'>
						<p className='mt-4 font-semibold'>Your Listings</p>
						<ul className='p-0 flex-col'>
							{listings.map((listing) => (
								<ListItem
									key={listing.id}
									listing={listing.data}
									id={listing.id}
									onDelete={() => onDelete(listing.id)}
									onEdit={() => onEdit(listing.id)}
								/>
							))}
						</ul>
					</div>
				)}
			</main>
		</div>
	)
}

export default UserProfile
