import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/a11y'

const Listing = () => {
	const [listing, setListing] = useState(null)
	const [loading, setLoading] = useState(true)
	const [shareLinkCopied, setSharedLinkCopied] = useState(false)

	const navigate = useNavigate()
	const params = useParams()
	const auth = getAuth()

	useEffect(() => {
		const fetchListing = async () => {
			const docRef = doc(db, 'listings', params.listingId)
			const docSnap = await getDoc(docRef)

			if (docSnap.exists()) {
				setListing(docSnap.data())
				setLoading(false)
			}
		}

		fetchListing()
	}, [navigate, params.listingId])

	if (loading) {
		return <Spinner />
	}

	return (
		<main>
			<h3 className='text-3xl font-extrabold py-2 px-2 mt-8 mb-4 sm:flex'>
				{listing.name}
			</h3>

			<Swiper
				modules={[Navigation, Pagination, Scrollbar, A11y]}
				slidesPerView={1}
				pagination={{ clickable: true }}
				navigation
				style={{ height: '500px' }}
			>
				{listing.imgUrls.map((url, index) => {
					return (
						<SwiperSlide key={index}>
							<div
								className='relative w-full h-full'
								style={{
									background: `url(${listing.imgUrls[index]}) center no-repeat`,
									backgroundSize: 'cover',
								}}
							></div>
						</SwiperSlide>
					)
				})}
			</Swiper>

			{/*<div className='flex flex-col'>*/}
				<div
					className='cursor-pointer fixed top-[5%] right-[5%] z-2 rounded-full w-12 h-12 flex justify-center items-center '
					onClick={() => {
						navigator.clipboard.writeText(window.location.href)
						setSharedLinkCopied(true)
						setTimeout(() => {
							setSharedLinkCopied(false)
						}, 2000)
					}}
				>
					<img src={shareIcon} alt='' />
				</div>

				{shareLinkCopied && (
					<p className='fixed top-[1%] right-[8%] z-2 rounded-2xl py-2 px-4 font-semibold text-accent-content'>
						Link Copied
					</p>
				)}

				<div className='m-4 mb-4'>
					<p className='mb-2 font-semibold text-accent-content'>
						{listing.name} - $
						{listing.discount
							? listing.discountedPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
							: listing.regularPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					</p>
					<p className='mt-0 font-semibold text-accent-content'>
						{listing.location}
					</p>
					<p className='py-1 px-2 rounded-3xl inline font-semibold text-sm mr-4 text-accent-content'>
						For {listing.type === 'rent' ? 'Rent' : 'Sale'}
					</p>
					{listing.discount && (
						<p className='py-1 px2 rounded-2xl text-sm font-semibold inline text-accent-content'>
							${listing.regularPrice - listing.discountedPrice} discount
						</p>
					)}

					<ul className='p-0 list-none text-accent-content'>
						<li className='p-0 list-none my-1.5 mx-0 font-medium opacity-80'>
							{listing.bedrooms > 1
								? `${listing.bedrooms} Bedrooms`
								: '1 Bedroom'}
						</li>
						<li className='p-0 list-none my-1.5 mx-0 font-medium opacity-80'>
							{listing.bathrooms > 1
								? `${listing.bathrooms} Bathrooms`
								: '1 Bathroom'}
						</li>
						<li className='p-0 list-none my-1.5 mx-0 font-medium opacity-80'>
							{listing.parking && 'Parking Spot'}
						</li>
						<li className='p-0 list-none my-1.5 mx-0 font-medium opacity-80'>
							{listing.furnished && 'Furnished'}
						</li>
					</ul>

					<p className='font-semibold mt-8 text-lg text-accent-content flex justify-center'>
						Location
					</p>
				</div>

				<div className=' flex justify-center'>				
				<div className='w-full h-[400px] overflow-x-hidden'>
					<MapContainer
						style={{ height: '100%', width: '100%' }}
						center={[listing.latitude, listing.longitude]}
						zoom={13}
						scrollWheelZoom={false}
					>
						<TileLayer
							attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
						/>

						<Marker position={[listing.latitude, listing.longitude]}>
							<Popup>{listing.location}</Popup>
						</Marker>
					</MapContainer>
				</div>
				</div>
			{/*</div>*/}

			{auth.currentUser?.uid !== listing.userRef && (
				<Link
					to={`/contact/${listing.userRef}?listingName=${listing.name}`}
					className='cursor-pointer rounded-2xl py-3.5 px-8 font-semibold text-xl w-[30%] my-8 mx-auto flex items-center justify-center bg-gradient-to-r from-accent-focus to-secondary-content text-base'
				>
					Contact Landlord
				</Link>
			)}
		</main>
	)
}

export default Listing
