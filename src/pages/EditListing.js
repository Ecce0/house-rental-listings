import React, { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate, useParams } from 'react-router-dom'
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
import { getDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore'

const EditListing = () => {
	// eslint-disable-next-line
	const [geolocationEnabled, setGeoLocationEnabled] = useState(true)
	const [loading, setLoading] = useState(false)
	const [listing, setListing] = useState(false)
	const [formData, setFormData] = useState({
		type: 'rent',
		name: '',
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		address: '',
		discount: false,
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
		discount,
		regularPrice,
		discountedPrice,
		images,
		latitude,
		longitude,
	} = formData

	const auth = getAuth()
	const navigate = useNavigate()
	const isMounted = useRef(true)
	const params = useParams()

	useEffect(() => {
		if (listing && listing.userRef !== auth.currentUser.uid) {
			toast.error('You cannot edit that listing')
			navigate('/')
		}
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		setLoading(true)

		const fetchListing = async () => {
			const docRef = doc(db, 'listings', params.listingId)
			const docSnap = await getDoc(docRef)
			if (docSnap.exists()) {
				setListing(docSnap.data())
				setFormData({ ...docSnap.data(), address: docSnap.data().location })
				setLoading(false)
			} else {
				navigate('/')
				toast.error("Listing doesn't exist")
			}
		}

		fetchListing()
	}, [params.listingId, navigate])

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
			toast.error('Max 6 images')
			return
		}

		let location
		let data
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
			toast.error('Images not uploaded')
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
		!formDataCopy.discount && delete formDataCopy.discountedPrice

		const docRef = doc(db, 'listings', params.listingId)
		await updateDoc(docRef, formDataCopy)
		setLoading(false)
		toast.success('Listing saved! Goodluck!')
		navigate(`/typey/${formDataCopy.type}/${docRef.id}`)
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
			<div className='mb-40'>
				<header>
					<p className='text-3xl font-extrabold'>Edit Listing</p>
				</header>
				<main>
					<form onSubmit={onSubmit}>
						<label className='font-semibold mt-6 block'>Sale/Rent</label>
						<div className='flex'>
							<button
								type='button'
								className={type === 'sale' ? 'bg-neutral-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center' : 'formButton'}
								id='type'
								value='sale'
								onClick={onMutate}
							>
								Sale
							</button>
							<button
								type='button'
								className={type === 'rent' ? 'bg-neutral-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center' : 'formButton'}
								id='type'
								value='rent'
								onClick={onMutate}
							>
								Rent
							</button>
						</div>
	
						<label className='font-semibold mt-4 block'>Name</label>
						<input
							className='bg-neutral-content text-accent py-3.5 px-3 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center border-none outline-none w-4/12 max-w-xs'
							type='text'
							id='name'
							value={name}
							onChange={onMutate}
							maxLength='32'
							minLength='10'
							required
						/>
	
						<div className='flex '>
							<div>
								<label className='font-semibold mt-4 block'>Bedrooms</label>
								<input
									className='bg-neutral-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mb-0 ml-0 flex justify-center items-center border-none outline-none mr-12 py-4 px-3'
									type='number'
									id='bedrooms'
									value={bedrooms}
									onChange={onMutate}
									min='1'
									max='50'
									required
								/>
							</div>
							<div>
								<label  className='font-semibold mt-4 block'>Bathrooms</label>
								<input
									className='bg-neutral-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mb-0 ml-0 flex justify-center items-center border-none outline-none mr-12 py-4 px-3'
									type='number'
									id='bathrooms'
									value={bathrooms}
									onChange={onMutate}
									min='1'
									max='50'
									required
								/>
							</div>
						</div>
	
						<label className='font-semibold mt-4 block'>Parking spot</label>
						<div className='flex'>
							<button
								className={parking ? 'bg-neutral-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center': 'formButton'}
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
									!parking && parking !== null ? 'bg-neutral-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center' : 'formButton'
								}
								type='button'
								id='parking'
								value={false}
								onClick={onMutate}
							>
								No
							</button>
						</div>
	
						<label className='font-semibold mt-4 block'>Furnished</label>
						<div className='flex'>
							<button
								className={furnished ? 'bg-neutral-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center' : 'formButton'}
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
										? 'bg-neutral-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'
										: 'formButton'
								}
								type='button'
								id='furnished'
								value={false}
								onClick={onMutate}
							>
								No
							</button>
						</div>
	
						<label className='font-semibold mt-4 block'>Address</label>
						<textarea
							className='bg-neutral-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center border-none outline-none w-4/12 py-3.5 px-3.5'
							type='text'
							id='address'
							value={address}
							onChange={onMutate}
							required
						/>
	
						{!geolocationEnabled && (
							<div className='flex'>
								<div>
									<label className='font-semibold mt-4 block'>Latitude</label>
									<input
										className='bg-neutral-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mb-0 ml-0 flex justify-center items-center border-none outline-none mr-12 py-4 px-3'
										type='number'
										id='latitude'
										value={latitude}
										onChange={onMutate}
										required
									/>
								</div>
								<div>
									<label className='font-semibold mt-4 block'>Longitude</label>
									<input
										className='bg-neutral-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mb-0 ml-0 flex justify-center items-center border-none outline-none mr-12 py-4 px-3'
										type='number'
										id='longitude'
										value={longitude}
										onChange={onMutate}
										required
									/>
								</div>
							</div>
						)} 
	
						<label className='font-semibold mt-4 block'>Discount</label>
						<div className='flex'>
							<button
								className={discount ? 'bg-neutral-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center'  : 'formButton'}
								type='button'
								id='discount'
								value={true}
								onClick={onMutate}
							>
								Yes
							</button>
							<button
								className={
									!discount && discount !== null ? 'bg-neutral-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mr-2 mb-0 ml-0 flex justify-center items-center' : 'formButton'
								}
								type='button'
								id='discount'
								value={false}
								onClick={onMutate}
							>
								No
							</button>
						</div>
	
						<label className='font-semibold mt-4 block'>Regular Price</label>
						<div>
							<input
								className='bg-neutral-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mb-0 ml-0 flex justify-center items-center border-none outline-none mr-12 py-4 px-3'
								type='number'
								id='regularPrice'
								value={regularPrice}
								onChange={onMutate}
								min='50'
								max='750000000'
								required
							/>
							{type === 'rent' && <p className='font-semibold rent'>$ / Month</p>}
						</div>
	
						{discount && (
							<>
								<label className='font-semibold mt-4 block'>Discounted Price</label>
								<input
									className='bg-neutral-content text-accent py-3.5 px-12 font-semibold rounded-2xl text-base mt-2 mb-0 ml-0 flex justify-center items-center border-none outline-none mr-12 py-4 px-3'
									type='number'
									id='discountedPrice'
									value={discountedPrice}
									onChange={onMutate}
									min='50'
									max='750000000'
									required={discount}
								/>
							</>
						)}
	
						<label className='font-semibold mt-4 block'>Images</label>
						<p className='text-base opacity-70'>
							The first image will be the cover (max 6).
						</p>
						<input
							className='w-full file'
							type='file'
							id='images'
							onChange={onMutate}
							max='6'
							accept='.jpg,.png,.jpeg'
							multiple
							required
						/>
						<button type='submit' className='cursor-pointer rounded-2xl py-3.5 px-8 font-semibold text-xl my-0 mx-auto flex items-center justify-center bg-accent' >
							Update Listing
						</button>
					</form>
				</main>
			</div>
		)
}

export default EditListing
