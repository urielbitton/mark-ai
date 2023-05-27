import { db } from "app/firebase/fire"
import { collection, getDocs, query, writeBatch } from "firebase/firestore"

export const updateEveryToolWithProps = (path, props) => {
  if(!props) return 
  const bacth = writeBatch(db)
  const ref = collection(db, path)
  const q = query(ref)
  return getDocs(q)
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      bacth.update(doc.ref, {views: props})
    })
    return bacth.commit()
  })
  .catch((error) => {
    console.log(error)
  })
}
