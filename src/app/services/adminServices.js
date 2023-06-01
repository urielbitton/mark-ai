import { db } from "app/firebase/fire"
import {
  collection, getCountFromServer, getDocs, limit,
  query, where, writeBatch
} from "firebase/firestore"

export const updateEveryToolWithProps = (path, props) => {
  if (!props) return
  const bacth = writeBatch(db)
  const ref = collection(db, path)
  const q = query(ref)
  return getDocs(q)
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        bacth.update(doc.ref, { views: props })
      })
      return bacth.commit()
    })
    .catch((error) => {
      console.log(error)
    })
}

export const getToolsSubmissionsByStatus = (status, lim) => {
  const subRef = collection(db, 'toolsSubmissions')
  const q = query(
    subRef,
    where('status', '==', status),
    limit(lim)
  )
  return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data())
    })
}

export const getToolsSubmissionsDocCountByStatus = (status) => {
  const subRef = collection(db, 'toolsSubmissions')
  const q = query(
    subRef,
    where('status', '==', status)
    )
  return getCountFromServer(q)
  .then((count) => {
    return count.data().count
  })
}

export const getPromptsSubmissionsByStatus = (status, lim) => {
  const subRef = collection(db, 'promptsSubmissions')
  const q = query(
    subRef,
    where('status', '==', status),
    limit(lim)
  )
  return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data())
    })
}

export const getPromptsSubmissionsCountByStatus = (status) => {
  const subRef = collection(db, 'promptsSubmissions')
  const q = query(
    subRef,
    where('status', '==', status)
  )
  return getCountFromServer(q)
  .then((count) => {
    return count.data().count
  })
}
