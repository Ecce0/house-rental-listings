import { useEffect, useState } from 'react'
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
import ListItem from '../components/ListItem'

const Type = () => {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  const params = useParams()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingsRef = collection(db, 'listings')

        // Create a query
        const q = query(
          listingsRef,
          where('type', '==', params.typeName),
          orderBy('timestamp', 'desc'),
          limit(3)
        )

        // Execute query
        const querySnap = await getDocs(q)

        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchedListing(lastVisible)

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
        toast.error('Could not fetch listings')
      }
    }

    fetchListings()
  }, [params.typeName])


  const onFetchMoreListings = async () => {
    try {
   
      const listingsRef = collection(db, 'listings')
      
      const q = query(
        listingsRef,
        where('type', '==', params.typeName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(3)
      )

      
      const querySnap = await getDocs(q)

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedListing(lastVisible)

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
      toast.error('Could not fetch listings')
    }
  }

  return (
    <div className='m-12'>
      <header>
        <p className='font-medium mb-2 text-5xl text-center'>
         
          {params.typeName === 'rent'
            ? 'Places for Rent'
            : 'Places for Sale'}
        </p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='p-0 flex flex-col'>
              {listings.map((listing) => (
                <ListItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>

          <br />
          <br />
          {lastFetchedListing && (
            <p className='cursor-pointer w-32 my-0 mx-auto text-center py-1 px-1 bg-black bg-base-300 text-base-content font-semibold rounded-2xl opacity-70 mt-8' onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No listings for {params.typeName}</p>
      )}
    </div>
  )
}

export default Type