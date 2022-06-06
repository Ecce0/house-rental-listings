import React, { useEffect, useState } from "react"
import { getAuth } from 'firebase/auth'

const Profile = () => {
  const [ login, setLogin ] = useState(null)
  const auth = getAuth()
 
  useEffect(() => {
    setLogin(auth.currentUser)
  }, [])
  

  return login ? <h1>{login.displayName}</h1> :
  'Not Logged in'
}

export default Profile
