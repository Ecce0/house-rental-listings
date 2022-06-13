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

	if(listings.length === 0) {
		return <></>
	} 

	return (
		listings && (
			<>
				<p className='font-light mb-2 text-xl text-violet-500'>Recommended</p>

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
								onClick={() => navigate(`/category/${data.type}/${id}`)}
							>
								<div
									style={{
										background: `url(${data.imgUrls[0]}) center no-repeat`,
										backgroundSize: 'cover',
										padding: '150px',
									}}
									className='h-screen w-full'
								>
									<p className='md:text-3xl absolute top-14 left-0 font-semibold max-w-7xl text-xl bg-emerald-200 text-black rounded-2xl'>{data.name}</p>
									<p className='absolute top-16 left-0 max-w-7xl p-1 px-2 bg-emerald-200 text-black font-bold rounded-2xl'>
										${data.discountedPrice ?? data.regularPrice}{' '}
										{data.type === 'rent' && '/month'}
									</p>
								</div>
							</SwiperSlide>
						)
					})}
				</Swiper>
			</>
		)
	)
}

export default Carousel
