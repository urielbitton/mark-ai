import { db } from "app/firebase/fire"
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { setDB, updateDB } from "./CrudDB"
import { createNotification } from "./notifServices"
import { uploadMultipleFilesToFireStorage } from "./storageServices"

export const getUserByID = (userID, setUser) => {
  const query = doc(db, 'users', userID)
  onSnapshot(query, (doc) => {
    setUser(doc.data())
  })
}

export const doGetUserByID = (userID) => {
  const query = doc(db, 'users', userID)
  return getDoc(query)
  .then(doc => {
    return doc.data()
  })
}

export const getNotificationsByUserID = (userID, setNotifs, lim) => {
  const notifsRef = collection(db, `users/${userID}/notifications`)
  const q = query(
    notifsRef, 
    orderBy('dateCreated', 'desc'), 
    limit(lim)
  )
  onSnapshot(q, (querySnapshot) => {
    setNotifs(querySnapshot.docs.map(doc => doc.data()))
  })
}

export const getUnreadNotificationsByUserID = (userID, setNotifs) => {
  const notifsRef = collection(db, `users/${userID}/notifications`)
  const q = query(
    notifsRef, 
    orderBy('dateCreated', 'desc'), 
    where('isRead', '==', false)
  )
  onSnapshot(q, (querySnapshot) => {
    setNotifs(querySnapshot.docs.map(doc => doc.data()))
  })
}

export const saveAccountInfoService = (userID, data, uploadedImg, contactStoragePath) => {
  return uploadMultipleFilesToFireStorage(uploadedImg ? [uploadedImg.file] : null, contactStoragePath, ['photo-url'])
    .then(imgURL => {
      return updateDB('users', userID, {
        ...data,
        ...(uploadedImg && { photoURL: imgURL[0].downloadURL })
      })
        .catch(err => console.log(err))
    })
} 

export const createUserDocService = (user, res, authMode, setLoading) => {
  const firstName = user?.displayName?.split(' ')[0] || ''
  const lastName = user?.displayName?.split(' ')[1] || ''
  const photoURLPlaceholder = 'https://firebasestorage.googleapis.com/v0/b/deskable-bb146.appspot.com/o/admin%2Fimages%2FphotoURLPlaceholder.png?alt=media&token=e920fe83-3762-4093-ad42-abf85dfc8e2d'
  return setDB('users', user.uid, {
    firstName: authMode === 'plain' ? firstName : authMode === 'google' ? res.additionalUserInfo.profile.given_name : res.first_name,
    lastName: authMode === 'plain' ? lastName : authMode === 'google' ? res.additionalUserInfo.profile.family_name : res.last_name,
    email: authMode === 'plain' ? user.email : authMode === 'google' ? res.additionalUserInfo.profile.email : res.email,
    photoURL: authMode === 'facebook' ? res.picture.data.url : photoURLPlaceholder,
    address: '',
    phone: '',
    city: '',
    region: '',
    regionCode: '',
    branch: 'none',
    country: '',
    countryCode: '',
    userID: user.uid,
    dateJoined: new Date(),
    memberType: 'classc',
    status: 'inactive',
    title: 'Employee',
    activeOrgID: null,
    position: '',
  })
    .then(() => {
      return createNotification(
        user.uid, 
        'Welcome to Mark AI!', 
        "Welcome to Mark AI! We're glad you're here. Visit your account to complete your profile information.", 
        'fas fa-house-user', 
        '/my-account',
      )
        .catch(err => {
          console.log(err)
          setLoading(false)
        })
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
    })
}

export const pastUserYearsOptions = (dateJoined) => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear; i <= dateJoined; i++) {
    years.push({
      label: i,
      value: i
    })
  }
  return years
}