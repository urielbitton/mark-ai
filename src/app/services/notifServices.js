import { db } from "app/firebase/fire"
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { getRandomDocID, setDB } from "./CrudDB"

export const createNotification = (userID, title, text, icon, url) => {
  const notifPath = `users/${userID}/notifications`
  const docID = getRandomDocID(notifPath)
  return setDB(notifPath, docID, {
    notificationID: docID,
    dateCreated: new Date(),
    isRead: false,
    title: title,
    text: text,
    icon: icon,
    url: url,
  })
}

export const getUnreadNotifications = (userID, setNotifs, lim) => {
  const notifsRef = collection(db, `users/${userID}/notifications`)
  const q = query(
    notifsRef,
    where('isRead', '==', false),
    orderBy('dateCreated', 'desc'),
    limit(lim)
  )
  onSnapshot(q, (snapshot) => {
    setNotifs(snapshot.docs.map(doc => doc.data()))
  })
  
}

export const getReadNotifications = (userID, setNotifs, lim) => {
  const notifsRef = collection(db, `users/${userID}/notifications`)
  const q = query(
    notifsRef,
    where('isRead', '==', true),
    orderBy('dateCreated', 'desc'),
    limit(lim)
  )
  onSnapshot(q, (snapshot) => {
    setNotifs(snapshot.docs.map(doc => doc.data()))
  })
}

export const getAllNotifications = (userID, setNotifs, lim) => {
  const notifsRef = collection(db, `users/${userID}/notifications`)
  const q = query(
    notifsRef,
    orderBy('dateCreated', 'desc'),
    limit(lim)
  )
  onSnapshot(q, (snapshot) => {
    setNotifs(snapshot.docs.map(doc => doc.data()))
  })
}