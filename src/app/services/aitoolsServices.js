import { db } from "app/firebase/fire"
import {
  collection, doc, getDoc, getDocs, limit,
  onSnapshot, orderBy, query, where
} from "firebase/firestore"
import { deleteDB, firebaseArrayAdd, firebaseArrayRemove, firebaseIncrement, getRandomDocID, setDB, updateDB } from "./CrudDB"
import { errorToast, successToast } from "app/data/toastsTemplates"
import { uploadMultipleFilesToFireStorage } from "./storageServices"
import { removeNullOrUndefined } from "app/utils/generalUtils"
import { compressImagesService } from "app/utils/fileUtils"

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

export const getAllTools = (setTools, lim) => {
  const toolsRef = collection(db, 'aitools')
  const q = query(
    toolsRef,
    orderBy('dateAdded', 'desc'),
    limit(lim)
  )
  return getDocs(q)
    .then((snapshot) => {
      setTools(snapshot.docs.map((doc) => doc.data()))
    })
}

export const getToolsByType = (type, setTools, lim) => {
  const toolsRef = collection(db, 'aitools')
  const q = query(
    toolsRef,
    where('type', '==', type),  
    orderBy('dateAdded', 'desc'),
    limit(lim)
  )
  return getDocs(q)
    .then((snapshot) => {
      setTools(snapshot.docs.map((doc) => doc.data()))
    })
}

export const getNonAITools = (setTools, lim) => {
  const toolsRef = collection(db, 'aitools')
  const q = query(
    toolsRef,
    where('type', '==', 'tool'),
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

export const getChatPrompts = (setPrompts, lim) => {
  const promptsRef = collection(db, 'prompts')
  const q = query(
    promptsRef,
    orderBy('dateAdded', 'desc'),
    limit(lim)
  )
  return getDocs(q)
    .then((snapshot) => {
      setPrompts(snapshot.docs.map((doc) => doc.data()))
    })
}

export const getChatPrompt = (promptID) => {
  const promptRef = doc(db, 'prompts', promptID)
  return getDoc(promptRef)
    .then((snapshot) => {
      return snapshot.data()
    })
}

export const getPromptsByCategory = (category, lim) => {
  const promptsRef = collection(db, 'prompts')
  const q = query(
    promptsRef,
    where('category', '==', category),
    orderBy('dateAdded', 'desc'),
    limit(lim)
  )
  return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data())
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
  const compressedMainImg = await compressImagesService(mainImgs)
  const compressedLogo = await compressImagesService(logos)
  const compressedImages = await compressImagesService(images)
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
      setToasts(successToast("AI tool added successfully"))
      return docID
    })
    .catch((err) => catchBlock(err, setLoading, setToasts))
}

export const checkUserToolRatingService = (toolID, userID) => {
  const ratingRef = doc(db, `aitools/${toolID}/ratings`, userID)
  return getDoc(ratingRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.data()
      }
      else {
        return null
      }
    })
    .catch((err) => console.log(err))
}

export const addUserToolRatingService = (toolID, userID, rating) => {
  return setDB(`aitools/${toolID}/ratings`, userID, {
    rating,
    dateAdded: new Date(),
    toolID,
    userID,  
  })
  .then(() => {
    return updateDB('aitools', toolID, {
      rating: firebaseIncrement(rating)
    })
  })
}

export const updateUserToolRatingService = (toolID, userID, oldRating, newRating) => {
  return updateDB(`aitools/${toolID}/ratings`, userID, {
    rating: newRating
  })
  .then(() => {
    return updateDB('aitools', toolID, {
      rating: firebaseIncrement(Math.round(newRating - oldRating))
    })
  })
}

export const deleteAIToolService = (toolID, setLoading, setToasts) => {
  setLoading(true)
  return deleteDB('aitools', toolID)
    .then(() => {
      setLoading(false)
      setToasts(successToast("AI Tool deleted successfully"))
    })
    .catch((err) => {
      setLoading(false)
      setToasts(errorToast("Error deleting AI Tool. Please try again."))
    })
}

export const updateAIToolService = async (tool, toolID, images, setLoading, setToasts) => {
  setLoading(true)
  const path = 'aitools'
  const storagePath = `aitools/${toolID}/images`
  const mainImgs = images.mainImg.filter(file => file.file).map(img => img.file)
  const logos = images.logo.filter(file => file.file).map(img => img.file)
  const toolImages = images.images.filter(file => file.file).map(img => img.file)
  const compressedMainImg = await compressImagesService(mainImgs)
  const compressedLogo = await compressImagesService(logos)
  const compressedImages = await compressImagesService(toolImages)
  return uploadMultipleFilesToFireStorage(mainImgs.length > 0 ? removeNullOrUndefined(compressedMainImg) : null, storagePath, null)
    .then((mainImgURLs) => {
      return uploadMultipleFilesToFireStorage(logos.length > 0 ? removeNullOrUndefined(compressedLogo) : null, storagePath, null)
        .then((logoURLs) => {
          return uploadMultipleFilesToFireStorage(toolImages.length > 0 ? removeNullOrUndefined(compressedImages) : null, storagePath, null)
            .then((imagesURLs) => {
              return updateDB(path, toolID, {
                ...tool,
                ...(mainImgs.length > 0 && {mainImg: mainImgURLs[mainImgURLs.length-1]?.downloadURL}),
                ...(logos.length > 0 && {logo: logoURLs[logoURLs.length-1]?.downloadURL}),
                ...(toolImages.length > 0 && {images: firebaseArrayAdd(imagesURLs.map(img => img?.downloadURL))}),
              })
                .catch((err) => catchBlock(err, setLoading, setToasts))
            })
            .catch((err) => catchBlock(err, setLoading, setToasts))
        })
        .catch((err) => catchBlock(err, setLoading, setToasts))
    })
    .then((docID) => {
      setLoading(false)
      setToasts(successToast("AI tool saved successfully"))
      return docID
    })
    .catch((err) => catchBlock(err, setLoading, setToasts))
}

export const toggleBookmarkToolService = (toolID, userID, isBookmarked, setToasts) => {
  return setDB(`users/${userID}/bookmarks`, 'tools', {
    bookmarks: isBookmarked ? firebaseArrayRemove(toolID) : firebaseArrayAdd(toolID)
  })
  .then(() => {
    setToasts(successToast(isBookmarked ? "Bookmark removed successfully" : "Bookmark added successfully"))
  })
  .catch((err) => {
    setToasts(errorToast("Error adding bookmark. Please try again."))
  })
}

export const addNewPromptService = (prompt, setLoading, setToasts) => {
  setLoading(true)
  const path = 'prompts'
  const docID = getRandomDocID(path)
  return setDB(path, docID, {
    ...prompt,
    promptID: docID,
    dateAdded: new Date()
  })
  .then(() => {
    setLoading(false)
    setToasts(successToast("Prompt added successfully"))
    return docID
  })
  .catch((err) => catchBlock(err, setLoading, setToasts))
}

export const updatePromptService = (prompt, promptID, setLoading, setToasts) => {
  setLoading(true)
  return updateDB('prompts', promptID, {
    ...prompt
  })
  .then(() => {
    setLoading(false)
    setToasts(successToast("Prompt saved successfully"))
  })
  .catch((err) => catchBlock(err, setLoading, setToasts))
}

export const deletePromptService = (promptID, setLoading, setToasts) => {
  setLoading(true)
  return deleteDB('prompts', promptID)
    .then(() => {
      setLoading(false)
      setToasts(successToast("Prompt deleted successfully"))
    })
    .catch((err) => {
      setLoading(false)
      setToasts(errorToast("Error deleting prompt. Please try again."))
    })
}

export const toggleBookmarkPromptService = (promptID, userID, isBookmarked, setToasts) => {
  return setDB(`users/${userID}/bookmarks`, 'prompts', {
    bookmarks: isBookmarked ? firebaseArrayRemove(promptID) : firebaseArrayAdd(promptID)
  })
  .then(() => {
    setToasts(successToast(isBookmarked ? "Prompt bookmark removed" : "Prompt bookmark added"))
  })
  .catch((err) => {
    setToasts(errorToast("Error adding prompt to bookmarks. Please try again."))
  })
}
