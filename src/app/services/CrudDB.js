import { auth, db } from 'app/firebase/fire'
import { browserSessionPersistence, setPersistence } from "firebase/auth"
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, 
  doc, getCountFromServer, increment, setDoc, Timestamp, updateDoc } from "firebase/firestore"

export function setDB(path, doc_, value, merge=true) {
  return setDoc(doc(db, path, doc_), value, { merge })
}

export function updateDB(path, doc_, value) {
  return updateDoc(doc(db, path, doc_), value)
}

export function deleteDB(path, doc_) {
  return deleteDoc(doc(db, path, doc_))
}

export const addDB = (path, value) => {
  return addDoc(collection(db, path), value)
}

export const getRandomDocID = (path) => {
  return doc(collection(db, path)).id
}

export const getFireTimeStampFromDate = (date) => {
  return Timestamp.fromDate(date)
}

export const firebaseIncrement = (num) => {
  return increment(num)
}

export const firebaseArrayAdd = (value) => {
  return arrayUnion(value)
}

export const firebaseArrayRemove = (value) => {
  return arrayRemove(value)
}

export const getDocsCount = (path) => {
  const docRef = collection(db, path)
  return getCountFromServer(docRef)
  .then((count) => {
    return count.data().count
  })
}

export const clearAuthState = (checked) => {
  return setPersistence(auth, browserSessionPersistence)
}

export const signOut = () => {
  auth.signOut()
  .then(() => {
    window.location.reload()
  })
  .catch(err => {
    console.log(err)
  })
}