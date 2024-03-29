import { db } from "app/firebase/fire"
import { collection, doc, getCountFromServer, getDoc, getDocs, limit, 
  onSnapshot, orderBy, query, where, writeBatch } from "firebase/firestore"
import { setDB, updateDB } from "./CrudDB"
import { createNotification } from "./notifServices"
import { uploadMultipleFilesToFireStorage } from "./storageServices"
import { sendAccountVerificationEmail, sendWelcomeEmail } from "./emailServices"

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

export const createUserDocService = (user, res, authMode, photoURL, setLoading) => {
  const firstName = user?.displayName?.split(' ')[0] || ''
  const lastName = user?.displayName?.split(' ')[1] || ''
  const googleFirstName = res?.user?.displayName?.split(' ')[0] || ''
  const googleLastName = res?.user?.displayName?.split(' ')[1] || ''
  return setDB('users', user.uid, {
    firstName: authMode === 'plain' ? firstName : authMode === 'google' ? googleFirstName : res.first_name,
    lastName: authMode === 'plain' ? lastName : authMode === 'google' ? googleLastName : res.last_name,
    email: authMode === 'plain' ? user.email : authMode === 'google' ? res.user.email : res.email,
    photoURL: authMode === 'facebook' ? res.picture.data.url : authMode === 'google' ? res.user.photoURL : photoURL,
    address: '',
    phone: '',
    city: '',
    region: '',
    regionCode: '',
    country: '',
    countryCode: '',
    userID: user.uid,
    dateJoined: new Date(),
    userType: 'basic',
    isVerified: !!res,
  })
    .then(() => {
      return createNotification(
        user.uid,
        'Welcome to Mark AI!',
        "Welcome to Mark AI! We're glad you're here. Visit your account to complete your profile information.",
        'fas fa-house-user',
        '/my-account',
      )
    })
    .then(() => {
      return sendWelcomeEmail(user?.displayName, user?.email)
    })
    .then(() => {
      return sendAccountVerificationEmail(user?.displayName, user?.email)
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
      return 'error'
    })
}

export const getToolsBookmarksByUserID = (userID, setBookmarks) => {
  const query = doc(db, `users/${userID}/bookmarks`, 'tools')
  onSnapshot(query, (doc) => {
    setBookmarks(doc.data()?.bookmarks || [])
  })
}

export const getPromptsBookmarksByUserID = (userID, setBookmarks) => {
  const query = doc(db, `users/${userID}/bookmarks`, 'prompts')
  onSnapshot(query, (doc) => {
    setBookmarks(doc.data()?.bookmarks || [])
  })
}

export const markAllNotifsAsReadService = (userID) => {
  const batch = writeBatch(db)
  const path = `users/${userID}/notifications`
  const notifsRef = collection(db, path)
  const q = query(
    notifsRef,
    where('isRead', '==', false)
  )
  return getDocs(q)
    .then(snapshot => {
      snapshot.forEach(doc => {
        batch.update(doc.ref, { isRead: true })
      })
      return batch.commit()
    })
    .catch(err => console.log(err))
}

export const getNotifsDocsCountByReadStatus = (userID, status) => {
  const path = `users/${userID}/notifications`
  const docRef = collection(db, path)
  const q = query(
    docRef,
    status !== null ? where('isRead', '==', status) : null,
  )
  return getCountFromServer(q)
    .then((count) => {
      return count.data().count
    })
}