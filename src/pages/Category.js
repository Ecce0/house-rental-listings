import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
	collection,
	getDocs,
	query,
	where,
	orderBy,
	limit,
	startAfter,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListItem from './ListItem'

const Category = () => {
	const [listings, setListings] = useState(null)
	const [ lastFetchedListing, setLastFetchListing ] = useState(null)
	const [loading, setLoading] = useState(true)
	const params = useParams()

	useEffect(() => {
		const fetchListings = async () => {
			try {
				const listingsRef = collection(db, 'listings')

				const q = query(
					listingsRef,
					where('type', '==', params.categoryName),
					orderBy('timestamp', 'desc'),
					startAfter(lastFetchedListing),
					limit(10)
				)

				const querySnap = await getDocs(q)

				const lastVisible = querySnap.docs[querySnap.docs.length-1]
				setLastFetchListing(lastVisible)

				const listings = []
				querySnap.forEach((doc) => {
					return listings.push({
						id: doc.id,
						data: doc.data(),
					})
				})
				setListings(listings)
				setLoading(false)
			} catch (error) {
				toast.error("Couldn't fetch listings")
			}
		}

		fetchListings()
	}, [params.categoryName])

	const onMoreFetchListings = async () => {
		
			try {
				const listingsRef = collection(db, 'listings')

				const q = query(
					listingsRef,
					where('type', '==', params.categoryName),
					orderBy('timestamp', 'desc'),
					limit(10)
				)

				const querySnap = await getDocs(q)

				const lastVisible = querySnap.docs[querySnap.docs.length-1]
				setLastFetchListing(lastVisible)

				const listings = []
				querySnap.forEach((doc) => {
					return listings.push({
						id: doc.id,
						data: doc.data(),
					})
				})
				setListings((prevState) => [...prevState, ...listings])
				setLoading(false)
			} catch (error) {
				toast.error("Couldn't fetch listings")
			}
		
	}

	return (
		<div className='category'>
			<header>
				<p className='pageHeader'>
					{params.categoryName === 'rent'
						? 'Places for Rent'
						: 'Homes for Sale'}
				</p>
			</header>

			{loading ? (
				<Spinner />
			) : listings && listings.length > 0 ? (
				<>
        <main>
          <ul className='categoryListings'>
            {listings.map((listing) => (
              <ListItem 
              key={listing.id}
              listing={listing}
              id={listing.id}>
                {listing.data}
              </ListItem>
            ))}
          </ul>
        </main>
				<br />
				<br />
				<br />
				{lastFetchedListing && (
					<p className="loadMore" onClick={onMoreFetchListings}>Load More</p>
				)}
				</>
			) : (
				<p>No Listings for {params.categoryName}</p>
			)}
		</div>
	)
}

export default Category
