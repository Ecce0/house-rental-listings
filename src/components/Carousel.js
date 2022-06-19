import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/a11y'
import Spinner from './Spinner'

const Carousel = () => {
	const [loading, setLoading] = useState(true)
	const [listings, setListings] = useState([])

	const navigate = useNavigate()

	useEffect(() => {
		const fetchListings = async () => {
			const listingsRef = collection(db, 'listings')
			const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
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
		fetchListings()
	}, [])

	if (loading) {
		return <Spinner />
	}

	if (listings.length === 0) {
		return <></>
	}

	return (
		listings && (
			<>
				<div className='flex flex-col sm:flex justify-center'>
					<p className='flex text-sm text-center sm:text-left font-light mb-2 text-3xl text-secondary-content'>
						Recommended Properties
					</p>
				</div>
				<div className='bg-base-content m-2 rounded-xl p-1 bg-gradient-to-r from-[#a9ccff] via-[#0f1f35] to-[#a9ccff]'>
					<Swiper
						modules={[Navigation, Pagination, Scrollbar, A11y]}
						slidesPerView={1}
						pagination={{ clickable: true }}
						navigation
					>
						{listings.map(({ data, id }) => {
							return (
								<SwiperSlide
									key={id}
									onClick={() => navigate(`/type/${data.type}/${id}`)}
								>
									<div
										style={{
											background: `url(${data.imgUrls[0]}) center no-repeat`,
											backgroundSize: 'cover',
										}}
										className='rounded-xl h-screen w-full'
									>
										<p className='md:text-3xl absolute top-14 left-0 font-semibold max-w-7xl text-xl bg-accent text-accent-content rounded-2xl opacity-75 pl-2 pr-2 ml-2'>
											{data.name}
										</p>
										<p className='absolute top-16 left-0 max-w-7xl p-1 px-2 bg-accent text-accent-content rounded-2xl opacity-75 font-bold rounded-2xl p-1 ml-2'>
											${data.discountedPrice ?? data.regularPrice}{' '}
											{data.type === 'rent' && '/month'}
										</p>
									</div>
								</SwiperSlide>
							)
						})}
					</Swiper>
				</div>
			</>
		)
	)
}

export default Carousel
