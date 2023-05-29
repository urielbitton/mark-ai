import React, { createContext, useEffect, useState } from 'react'
import { auth } from 'app/firebase/fire'
import { getUserByID } from "app/services/userServices"
import { onAuthStateChanged } from "firebase/auth"

// @ts-ignore
export const StoreContext = createContext()

const StoreContextProvider = ({children}) => {
 
  const user = auth.currentUser
  const [myUser, setMyUser] = useState(null) 
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkmode') === "true")
  const [pageLoading, setPageLoading] = useState(false) 
  const myUserID = user?.uid
  const myUserImg = myUser?.photoURL
  const myUserName = `${myUser?.firstName} ${myUser?.lastName}`
  const myUserType = myUser?.userType
  const photoURLPlaceholder = 'https://firebasestorage.googleapis.com/v0/b/mark-ai-5d4aa.appspot.com/o/resources%2Fimages%2FphotoURLPlaceholder.png?alt=media&token=af309860-be92-419d-ad9b-5f8bd35eb5b3'
  const photoPlaceholder = 'https://firebasestorage.googleapis.com/v0/b/mark-ai-5d4aa.appspot.com/o/resources%2Fimages%2FphotoPlaceholder.jpg?alt=media&token=be84157d-15f2-481a-9c38-b6331d4efd4a'
  const percentFormat = new Intl.NumberFormat('en-CA', {style: 'percent'})
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [toasts, setToasts] = useState([])
  const [newEventModal, setNewEventModal] = useState({open: false, eventObject: null})
  const isAdmin = myUser?.userType === "admin"
  const isPro = myUser?.userType === "pro" || isAdmin
  const isUserVerified = myUser?.isVerified
  const upgradeProPrice = 20
  const toolsUID = localStorage.getItem('toolsUID')
  const promptsUID = localStorage.getItem('promptsUID')

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if(user) {
        getUserByID(user.uid, setMyUser)
      }
      else {
        setMyUser(undefined)
      }
    })
  },[user])

  useEffect(() => {
    localStorage.setItem('darkmode', !darkMode ? "false" : "true")  
  },[darkMode]) 

  return <StoreContext.Provider value={{ 
    user, myUser, setMyUser, myUserID, myUserImg, myUserName, myUserType,
    isAdmin, isPro, isUserVerified, 
    upgradeProPrice, 
    pageLoading, setPageLoading,
    darkMode, setDarkMode,
    percentFormat,
    photoURLPlaceholder, photoPlaceholder,
    showMobileSidebar, setShowMobileSidebar,
    toasts, setToasts,
    newEventModal, setNewEventModal,
    toolsUID, promptsUID
  }}>
    {children}
  </StoreContext.Provider>
}
export default StoreContextProvider