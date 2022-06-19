import React, { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from 'firebase/storage'
import { db } from '../firebase.config'
import { v4 as uuidv4 } from 'uuid'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

const CreateListing = () => {
	// eslint-disable-next-line
	const [geolocationEnabled, setGeoLocationEnabled] = useState(true)
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		type: 'rent',
		name: '',
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		address: '',
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		images: {},
		latitude: 0,
		longitude: 0,
	})

	const {
		type,
		name,
		bedrooms,
		bathrooms,
		parking,
		furnished,
		address,
		offer,
		regularPrice,
		discountedPrice,
		images,
		latitude,
		longitude,
	} = formData

	const auth = getAuth()
	const navigate = useNavigate()
	const isMounted = useRef(true)

	useEffect(() => {
		if (isMounted) {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					setFormData({ ...formData, userRef: user.uid })
				} else {
					navigate('/sign-in')
				}
			})
		}
		return () => {
			isMounted.current = false
		}

		// eslint-disable-next-line
	}, [isMounted])

	const onSubmit = async (e) => {
		e.preventDefault()

		setLoading(true)

		if (discountedPrice >= regularPrice) {
			setLoading(false)
			toast.error('Discounted price needs to be less than regular price')
			return
		}

		if (images.length > 6) {
			setLoading(false)
			toast.error('Max amount of images is 6')
			return
		}

		let data
		let location
		let geolocation = {}

		if (geolocationEnabled) {
			const res = await fetch(
				`http://api.positionstack.com/v1/forward?access_key=${process.env.REACT_APP_API_KEY}&query=${address}`
			)

			data = await res.json()
			location = data.data[0].label

			if (location === undefined || location.includes('undefined')) {
				setLoading(false)
				toast.error('Please enter a correct address')
				return
			}
		} else {
			geolocation.lat = data.data[0].latitude
			geolocation.lng = data.data[0].longitude
		}

		const storeImage = async (image) => {
			return new Promise((resolve, reject) => {
				const storage = getStorage()
				const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

				const storageRef = ref(storage, 'images/' + fileName)

				const uploadTask = uploadBytesResumable(storageRef, image)

				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100
						console.log('Upload is ' + progress + '% done')
						switch (snapshot.state) {
							case 'paused':
								console.log('Upload is paused')
								break
							case 'running':
								console.log('Upload is running')
								break
							default:
								break
						}
					},
					(error) => {
						reject(error)
					},
					() => {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							resolve(downloadURL)
						})
					}
				)
			})
		}

		const imgUrls = await Promise.all(
			[...images].map((image) => storeImage(image))
		).catch(() => {
			setLoading(false)
			toast.error('Images not uploaded. Please limit to 2Mb or less')
			return
		})

		const formDataCopy = {
			...formData,
			latitude: data.data[0].latitude,
			longitude: data.data[0].longitude,
			imgUrls,
			timestamp: serverTimestamp(),
		}

		formDataCopy.location = address
		delete formDataCopy.images
		delete formDataCopy.address
		!formDataCopy.offer && delete formDataCopy.discountedPrice

		const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
		setLoading(false)
		toast.success('Listing saved! Goodluck!')
		navigate(`/type/${formDataCopy.type}/${docRef.id}`)
	}

	const onMutate = (e) => {
		let boolean = null
		if (e.target.value === 'true') {
			boolean = true
		}
		if (e.target.value === 'false') {
			boolean = false
		}
		if (e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				images: e.target.files,
			}))
		}

		if (!e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				[e.target.id]: boolean ?? e.target.value,
			}))
		}
	}

	if (loading) {
		return <Spinner />
	}

	return (
		<div className='md:mb-40'>
			<header>
				<p className='text-3xl font-extrabold mt-[15px] ml-8'>
					Create a Listing
				</p>
			</header>

			<div className='flex flex-col justify-center'>
				<form onSubmit={onSubmit} className='w-full max-w-xl my-8'>
					<div className='flex flex-wrap mx-3 mb-6'>
						<div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
							<label className='block uppercase tracking-wide text-accent-content text-xs font-bold mb-2'>
								Sale/Rent
							</label>
							<div className='flex mb-8'>
								<button
									type='button'
									className={
										type === 'sale'
											? 'bg-gradient-to-r from-accent-focus to-secondary-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'
											: 'bg-gradient-to-r from-base to-accent-focus text-secondary-content py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'
									}
									id='type'
									value='sale'
									onClick={onMutate}
								>
									Sale
								</button>
								<button
									type='button'
									className={
										type === 'rent'
											? 'bg-gradient-to-r from-accent-focus to-secondary-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'
											: 'bg-gradient-to-r from-base-300 to-accent-focus text-secondary-content py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'
									}
									id='type'
									value='rent'
									onClick={onMutate}
								>
									Rent
								</button>
							</div>
							<label className='block uppercase tracking-wide text-accent-content text-xs font-bold mb-2'>
								Name
							</label>

							<input
								className='appearance-none block md:w-full bg-gray-200 text-base-300 border border-base-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
								type='text'
								id='name'
								value={name}
								onChange={onMutate}
								maxLength='32'
								minLength='10'
								required
							/>

							<label className='block uppercase tracking-wide text-accent-content text-xs font-bold mb-2'>
								Bedrooms
							</label>
							<input
								className='appearance-none block w-7 bg-gray-200 text-base-300 border border-base-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
								type='number'
								id='bedrooms'
								value={bedrooms}
								onChange={onMutate}
								min='1'
								max='50'
								required
							/>
							<label className='block uppercase tracking-wide text-accent-content text-xs font-bold mb-2'>
								Bathrooms
							</label>
							<input
								className='appearance-none block w-7 bg-gray-200 text-base-300 border border-base-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
								type='number'
								id='bathrooms'
								value={bathrooms}
								onChange={onMutate}
								min='1'
								max='50'
								required
							/>

							<label className='block uppercase tracking-wide text-accent-content text-xs font-bold mb-2'>
								Parking Spot and/or Space
							</label>
							<div className='flex mb-4'>
								<button
									className={
										parking
											? 'bg-gradient-to-r from-accent-focus to-secondary-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'
											: 'bg-gradient-to-r from-base to-accent-focus text-secondary-content py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'
									}
									type='button'
									id='parking'
									value={true}
									onClick={onMutate}
									min='1'
									max='50'
								>
									Yes
								</button>
								<button
									className={
										!parking && parking !== null
											? 'bg-gradient-to-r from-accent-focus to-secondary-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'
											: 'bg-gradient-to-r from-base to-accent-focus text-secondary-content py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'
									}
									type='button'
									id='parking'
									value={false}
									onClick={onMutate}
								>
									No
								</button>
							</div>
							<label className='block uppercase tracking-wide text-accent-content text-xs font-bold mb-2'>
								Furnished?
							</label>

							<div className='flex mb-4'>
								<button
									className={
										furnished
											? 'bg-gradient-to-r from-accent-focus to-secondary-content text-secondary-content py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'
											: 'bg-gradient-to-r from-base to-accent-focus text-secondary-content py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'
									}
									type='button'
									id='furnished'
									value={true}
									onClick={onMutate}
								>
									Yes
								</button>
								<button
									className={
										!furnished && furnished !== null
											? 'bg-gradient-to-r from-accent-focus to-secondary-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'
											: 'bg-gradient-to-r from-base to-accent-focus text-secondary-content py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'
									}
									type='button'
									id='furnished'
									value={false}
									onClick={onMutate}
								>
									No
								</button>
							</div>
							<div className='flex flex-col mb-4'>
								<label className='block uppercase tracking-wide text-accent-content text-xs font-bold mb-2'>
									Address
								</label>
								<textarea
									className='bg-white text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center border border-base-100 outline-none md:w-full py-3.5 px-3.5'
									type='text'
									id='address'
									value={address}
									onChange={onMutate}
									required
								/>
							</div>

							{!geolocationEnabled && (
								<div className='flex'>
									<label className='block uppercase tracking-wide text-accent-content text-xs font-bold mb-2'>
										Latitude
									</label>
									<input
										className='appearance-none block w-full bg-gray-200 text-accent-content border border-base-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
										type='number'
										id='latitude'
										value={latitude}
										onChange={onMutate}
										required
									/>
									<label className='block uppercase tracking-wide text-accent-content text-xs font-bold mb-2'>
										Longitude
									</label>
									<input
										className='appearance-none block w-full bg-gray-200 text-accent-content border border-base-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
										type='number'
										id='longitude'
										value={longitude}
										onChange={onMutate}
										required
									/>
								</div>
							)}
						</div>
						<div className='flex flex-col mb-4'>
							<label className='block uppercase tracking-wide text-accent-content text-xs font-bold mb-2'>
								Discount
							</label>
							<div className='flex'>
								<button
									className={
										offer
											? 'bg-gradient-to-r from-accent-focus to-secondary-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'
											: 'bg-gradient-to-r from-base to-accent-focus text-secondary-content py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'
									}
									type='button'
									id='offer'
									value={true}
									onClick={onMutate}
								>
									Yes
								</button>
								<button
									className={
										!offer && offer !== null
											? 'bg-gradient-to-r from-accent-focus to-secondary-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'
											: 'bg-gradient-to-r from-base to-accent-focus text-secondary-content py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'
									}
									type='button'
									id='offer'
									value={false}
									onClick={onMutate}
								>
									No
								</button>
							</div>

							<label className='block uppercase tracking-wide text-accent-content text-xs font-bold mb-2'>
								Regular Price
							</label>
							<div>
								<input
									className='appearance-none block w-full bg-gray-200 text-base-300 border border-base-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
									type='number'
									id='regularPrice'
									value={regularPrice}
									onChange={onMutate}
									min='50'
									max='750000000'
									required
								/>
								{type === 'rent' && (
									<p className='lock uppercase tracking-wide text-accent-content text-xs font-bold mb-2'>
										$ /Month
									</p>
								)}
							</div>

							{offer && (
								<>
									<label className='lock uppercase tracking-wide text-accent-content text-xs font-bold mb-2'>
										Discount Price
									</label>
									<input
										className='appearance-none block w-full bg-gray-200 text-base-300 border border-base-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
										type='number'
										id='discountedPrice'
										value={discountedPrice}
										onChange={onMutate}
										min='50'
										max='750000000'
										required={offer}
									/>
								</>
							)}
						</div>

						<div className='flex flex-col mb-4'>
							<label className='lock uppercase tracking-wide text-accent-content text-xs font-bold mb-2'>
								Images
							</label>

							<p className='text-accent-content text-xs font-bold mb-2 opacity-40'>
								The first image will be the cover (max 6).
							</p>
							<input
								className='w-auto appearance-none block md:w-full bg-gray-200 text-base-300 border border-base-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
								type='file'
								id='images'
								onChange={onMutate}
								max='6'
								accept='.jpg,.png,.jpeg'
								multiple
								required
							/>
						</div>

						<button
							type='submit'
							className='cursor-pointer rounded-2xl py-3.5 px-8 font-semibold text-xl my-0 mx-auto flex items-center justify-center bg-gradient-to-r from-accent-focus to-secondary-content text-accent mb-12 '
							onClick={onSubmit}
						>
							Create Listing
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default CreateListing
