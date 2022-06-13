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
		navigate(`/category/${formDataCopy.type}/${docRef.id}`)
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
		<div>
			<header>
				<p >Edit Listing</p>
			</header>
			<main>
				<form onSubmit={onSubmit}>
					<label >Sale/Rent</label>
					<div>
						<button
							type='button'
							className={type === 'sale' ? 'formButtonActive' : 'formButton'}
							id='type'
							value='sale'
							onClick={onMutate}
						>
							Sale
						</button>
						<button
							type='button'
							className={type === 'rent' ? 'formButtonActive' : 'formButton'}
							id='type'
							value='rent'
							onClick={onMutate}
						>
							Rent
						</button>
					</div>

					<label>Name</label>
					<input
						
						type='text'
						id='name'
						value={name}
						onChange={onMutate}
						maxLength='32'
						minLength='10'
						required
					/>

					<div >
						<div>
							<label >Bedrooms</label>
							<input
								
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
							<label>Bathrooms</label>
							<input
							
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

					<label>Parking spot</label>
					<div >
						<button
							className={parking ? 'formButtonActive' : 'formButton'}
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
								!parking && parking !== null ? 'formButtonActive' : 'formButton'
							}
							type='button'
							id='parking'
							value={false}
							onClick={onMutate}
						>
							No
						</button>
					</div>

					<label>Furnished</label>
					<div >
						<button
							className={furnished ? 'formButtonActive' : 'formButton'}
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
									? 'formButtonActive'
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

					<label>Address</label>
					<textarea
						
						type='text'
						id='address'
						value={address}
						onChange={onMutate}
						required
					/>

					{!geolocationEnabled && (
						<div>
							<div>
								<label>Latitude</label>
								<input
									
									type='number'
									id='latitude'
									value={latitude}
									onChange={onMutate}
									required
								/>
							</div>
							<div>
								<label >Longitude</label>
								<input
								
									type='number'
									id='longitude'
									value={longitude}
									onChange={onMutate}
									required
								/>
							</div>
						</div>
					)}

					<label >Discount</label>
					<div >
						<button
							className={discount ? 'formButtonActive' : 'formButton'}
							type='button'
							id='discount'
							value={true}
							onClick={onMutate}
						>
							Yes
						</button>
						<button
							className={
								!discount && discount !== null ? 'formButtonActive' : 'formButton'
							}
							type='button'
							id='discount'
							value={false}
							onClick={onMutate}
						>
							No
						</button>
					</div>

					<label>Regular Price</label>
					<div >
						<input
							
							type='number'
							id='regularPrice'
							value={regularPrice}
							onChange={onMutate}
							min='50'
							max='750000000'
							required
						/>
						{type === 'rent' && <p className='formPriceText'>$ / Month</p>}
					</div>

					{discount && (
						<>
							<label>Discounted Price</label>
							<input
								
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

					<label >Images</label>
					<p >
						The first image will be the cover (max 6).
					</p>
					<input
						
						type='file'
						id='images'
						onChange={onMutate}
						max='6'
						accept='.jpg,.png,.jpeg'
						multiple
						required
					/>
					<button type='submit' >
						Create Listing
					</button>
				</form>
			</main>
		</div>
	)
}

export default EditListing
