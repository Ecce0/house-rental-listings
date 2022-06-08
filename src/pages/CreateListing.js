import React, { useState, useEffect, useRef } from "react"
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'

const CreateListing = () => {
  const [ geoLocationEnabled, setGeoLocationEnabled ] = useState(true)
  const [ formData, setFormData ] = useState({
    type: 'Rent',
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
    longitude: 0
  })

  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)
  
  useEffect(() => {
    if(isMounted){
      onAuthStateChanged(auth, (user) => {
        if(user) {
          setFormData({...formData, userRef: user.uid})
        } else {
          navigate('/sign-in')
        }
      })
    }
    return () => {
      isMounted.current = false
    }
  },[isMounted])
  

  return(
    <></>
  )
}

export default CreateListing
