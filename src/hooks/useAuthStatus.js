import React, { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export const useAuthStatus = () => {
  const [ loggedIn, setLoggedIn ] = useState(false)
  const [ checkingStatus, setCheckingState ] = useState(true)

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if(user){
        setLoggedIn(true)
      }
      setCheckingState(false)
    })
})
 
 
  return { loggedIn , checkingStatus }
}
