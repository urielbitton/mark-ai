import { db } from "app/firebase/fire"
import {
  collection, doc, getDoc, getDocs, limit,
  onSnapshot, orderBy, query, where
} from "firebase/firestore"
import { getRandomDocID, setDB } from "./CrudDB"
import { errorToast, successToast } from "app/data/toastsTemplates"
import { uploadMultipleFilesToFireStorage } from "./storageServices"
import { removeNullOrUndefined } from "app/utils/generalUtils"
import { compressImages } from "app/utils/fileUtils"

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
  return getDocs(q)
    .then((snapshot) => {
      setTools(snapshot.docs.map((doc) => doc.data()))
    })
}

export const getAITool = (toolID) => {
  const toolRef = doc(db, 'aitools', toolID)
  return getDoc(toolRef)
    .then((snapshot) => {
      return snapshot.data()
    })
}



// Write operations

const catchBlock = (err, setLoading, setToasts) => {
  console.log(err)
  setLoading(false)
  setToasts(errorToast("Error adding AI Tool. Please try again."))
}

export const addNewToolService = async (tool, setLoading, setToasts) => {
  setLoading(true)
  const path = 'aitools'
  const docID = getRandomDocID(path)
  const storagePath = `aitools/${docID}/images`
  const mainImgs = tool.mainImg.map(img => img.file)
  const logos = tool.logo.map(img => img.file)
  const images = tool.images.map(img => img.file)
  const compressedMainImg = await compressImages(mainImgs)
  const compressedLogo = await compressImages(logos)
  const compressedImages = await compressImages(images)
  return uploadMultipleFilesToFireStorage(tool.mainImg.length > 0 ? removeNullOrUndefined(compressedMainImg) : null, storagePath, null)
    .then((mainImgURLs) => {
      return uploadMultipleFilesToFireStorage(tool.logo.length > 0 ? removeNullOrUndefined(compressedLogo) : null, storagePath, null)
        .then((logoURLs) => {
          return uploadMultipleFilesToFireStorage(tool.images.length > 0 ? removeNullOrUndefined(compressedImages) : null, storagePath, null)
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
                .catch((err) => catchBlock(err, setLoading, setToasts))
            })
            .catch((err) => catchBlock(err, setLoading, setToasts))
        })
        .catch((err) => catchBlock(err, setLoading, setToasts))
    })
    .then((docID) => {
      setLoading(false)
      setToasts(successToast("AI Tool added successfully"))
      return docID
    })
    .catch((err) => catchBlock(err, setLoading, setToasts))
}