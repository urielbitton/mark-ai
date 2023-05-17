import { db } from "app/firebase/fire"
import { collection, doc, limit, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { getRandomDocID, setDB } from "./CrudDB"
import { errorToast, successToast } from "app/data/toastsTemplates"
import { uploadMultipleFilesToFireStorage } from "./storageServices"
import { removeNullOrUndefined } from "app/utils/generalUtils"

// Get operations
export const getAiToolByID = (toolID, setTool) => {
  const toolRef = doc(db, 'aitools', toolID)
  onSnapshot(toolRef, (doc) => {
    setTool(doc.data())
  })
}

export const getAITools = (setTools, lim) => {
  const toolsRef = collection(db, 'aitools')
  const q = query(
    toolsRef,
    where('type', '==', 'ai'),
    orderBy('dateAdded', 'desc'),
    limit(lim)
  )
  onSnapshot(q, (snapshot) => {
    setTools(snapshot.docs.map((doc) => doc.data()))
  })
}


// Write operations
export const addNewToolService = (tool, setLoading, setToasts) => {
  setLoading(true)
  const path = 'aitools'
  const docID = getRandomDocID(path)
  const storagePath = `aitools/${docID}/images`
  return uploadMultipleFilesToFireStorage(tool.mainImg.length > 0 ? removeNullOrUndefined(tool.mainImg.map(img => img.file)) : null, storagePath, null)
    .then((mainImgURLs) => {
      return uploadMultipleFilesToFireStorage(tool.logo.length > 0 ? removeNullOrUndefined(tool.logo.map(img => img.file)) : null, storagePath, null)
        .then((logoURLs) => {
          return uploadMultipleFilesToFireStorage(tool.images.length > 0 ? removeNullOrUndefined(tool.images.map(img => img.file)) : null, storagePath, null)
            .then((imagesURLs) => {
              return setDB(path, docID, {
                ...tool,
                mainImg: mainImgURLs[0].downloadURL,
                logo: logoURLs[0].downloadURL,
                images: imagesURLs.map(img => img.downloadURL),
                toolID: docID,
                dateAdded: new Date(),
                dateCreated: new Date(),
              })
            })
        })
    })
    .then((docID) => {
      setLoading(false)
      setToasts(successToast("AI Tool added successfully"))
      return docID
    })
    .catch((err) => {
      console.log(err)
      setLoading(false)
      setToasts(errorToast("Error adding AI Tool. Please try again."))
    })
}