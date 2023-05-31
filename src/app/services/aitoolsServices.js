import { db } from "app/firebase/fire"
import {
  collection, doc, getCountFromServer, getDoc, getDocs, limit,
  onSnapshot, orderBy, query, runTransaction, where
} from "firebase/firestore"
import { deleteDB, firebaseArrayAdd, firebaseArrayRemove, firebaseIncrement, getRandomDocID, setDB, updateDB } from "./CrudDB"
import { errorToast, successToast } from "app/data/toastsTemplates"
import { uploadMultipleFilesToFireStorage } from "./storageServices"
import { extractDomainFromURL, removeNullOrUndefined } from "app/utils/generalUtils"
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

export const getAllTools = (lim) => {
  const toolsRef = collection(db, 'aitools')
  const q = query(
    toolsRef,
    orderBy('dateAdded', 'desc'),
    limit(lim)
  )
  return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data())
    })
}

export const getToolsByType = (type, lim) => {
  const toolsRef = collection(db, 'aitools')
  const q = query(
    toolsRef,
    where('type', '==', type),
    orderBy('dateAdded', 'desc'),
    limit(lim)
  )
  return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data())
    })
}

export const getToolsByTypeAndCategory = (type, category, lim) => {
  const toolsRef = collection(db, 'aitools')
  const q = query(
    toolsRef,
    where('type', '==', type),
    where('category', '==', category),
    orderBy('dateAdded', 'desc'),
    limit(lim)
  )
  return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data())
    })
}

export const getToolsByPopularityAndType = (type, category, viewsNum, ratingNum, lim) => {
  const toolsRef = collection(db, 'aitools')
  const q = query(
    toolsRef,
    where('type', '==', type),
    category === 'views' ? where('views', '>=', viewsNum) : where('rating', '>=', ratingNum),
    category === 'views' ? orderBy('views', 'desc') : orderBy('rating', 'desc'),
    limit(lim)
  )
  return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data())
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

export const getAIToolPreview = (toolID) => {
  const toolRef = doc(db, 'toolsSubmissions', toolID)
  return getDoc(toolRef)
    .then((snapshot) => {
      return snapshot.data()
    })
}

export const getToolsSubmissionsByTypeAndStatus = (userID, type, status, lim) => {
  const toolsRef = collection(db, 'toolsSubmissions')
  const q = query(
    toolsRef,
    where('submitterID', '==', userID),
    where('type', '==', type),
    where('status', '==', status),
    orderBy('dateSubmitted', 'desc'),
    limit(lim)
  )
  return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data())
    })
}

export const getUserToolsSubmissionsDocsCountByStatusAndType = (userID, path, type, status) => {
  const docRef = collection(db, path)
  const q = query(
    docRef,
    where('submitterID', '==', userID),
    where('status', '==', status),
    where('type', '==', type)
  )
  return getCountFromServer(q)
    .then((count) => {
      return count.data().count
    })
}

export const getPromptsSubmissionsByStatus = (userID, status, lim) => {
  const promptsRef = collection(db, 'promptsSubmissions')
  const q = query(
    promptsRef,
    where('submitterID', '==', userID),
    where('status', '==', status),
    orderBy('dateSubmitted', 'desc'),
    limit(lim)
  )
  return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data())
    })
}

export const getUserPromptsSubmissionsDocsCountByStatus = (userID, path, status) => {
  const docRef = collection(db, path)
  const q = query(
    docRef,
    where('submitterID', '==', userID),
    where('status', '==', status)
  )
  return getCountFromServer(q)
    .then((count) => {
      return count.data().count
    })
}




// Write operations

const catchBlock = (err, setLoading, setToasts) => {
  console.log(err)
  setLoading(false)
  setToasts(errorToast("Error saving item. Please try again."))
  return 'error'
}

export const checkIfURLExists = (url) => {
  const cleanedURL = extractDomainFromURL(url)
  const toolsRef = collection(db, 'aitools')
  const q = query(
    toolsRef,
    where('cleanedURL', '==', cleanedURL)
  )
  return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.length > 0
    })
}

export const addNewToolService = async (tool, setLoading, setToasts) => {
  setLoading(true)
  const urlExists = await checkIfURLExists(tool.url)
  if (urlExists) {
    setLoading(false)
    setToasts(errorToast(`The url - ${tool.url} - already belongs to an existing tool on MarkAI. Please choose another url and make sure the tool is not a duplicate.`, true))
    return 'error'
  }
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
                cleanedURL: extractDomainFromURL(tool.url),
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
      setToasts(successToast("AI/Online tool added successfully"))
      return docID
    })
    .catch((err) => catchBlock(err, setLoading, setToasts))
}

export const updateAIToolService = async (tool, toolID, images, setLoading, setToasts) => {
  setLoading(true)
  const urlExists = await checkIfURLExists(tool.url)
  if (urlExists) {
    setLoading(false)
    setToasts(errorToast(`The url - ${tool.url} - already belongs to an existing tool on MarkAI. Please choose another url and make sure the tool is not a duplicate.`, true))
    return 'error'
  }
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
                ...(mainImgs.length > 0 && { mainImg: mainImgURLs[mainImgURLs.length - 1]?.downloadURL }),
                ...(logos.length > 0 && { logo: logoURLs[logoURLs.length - 1]?.downloadURL }),
                ...(toolImages.length > 0 && { images: firebaseArrayAdd(imagesURLs.map(img => img?.downloadURL)) }),
              })
                .catch((err) => catchBlock(err, setLoading, setToasts))
            })
            .catch((err) => catchBlock(err, setLoading, setToasts))
        })
        .catch((err) => catchBlock(err, setLoading, setToasts))
    })
    .then((docID) => {
      setLoading(false)
      setToasts(successToast("AI/Online tool saved successfully"))
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

export const incrementToolViewsCountService = (toolID) => {
  const itemRef = doc(db, "aitools", toolID)

  return runTransaction(db, (transaction) => {
    return transaction.get(itemRef).then((itemSnapshot) => {
      const currentViews = itemSnapshot.data().views || 0
      const newViews = currentViews + 1
      transaction.update(
        itemRef,
        { views: newViews }
      )
    })
  })
    .catch((error) => {
      console.error("Error incrementing view count:", error)
    })
}

export const incrementPromptViewsCountService = (promptID) => {
  const itemRef = doc(db, "prompts", promptID)

  return runTransaction(db, (transaction) => {
    return transaction.get(itemRef).then((itemSnapshot) => {
      const currentViews = itemSnapshot.data().views || 0
      const newViews = currentViews + 1
      transaction.update(
        itemRef,
        { views: newViews }
      )
    })
  })
    .catch((error) => {
      console.error("Error incrementing view count:", error)
    })
}


// pro users services
export const submitNewToolRequestService = async (tool, userID, setLoading, setToasts) => {
  setLoading(true)
  const path = 'toolsSubmissions'
  const docID = getRandomDocID(path)
  const storagePath = `toolsSubmissions/${docID}/images`
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
                cleanedURL: extractDomainFromURL(tool.url),
                submitterID: userID,
                proUserAdded: true,
                mainImg: mainImgURLs[0].downloadURL,
                logo: logoURLs[0].downloadURL,
                images: imagesURLs.map(img => img.downloadURL),
                toolID: docID,
                dateAdded: new Date(),
                dateCreated: new Date(),
                dateSubmitted: new Date(),
                status: 'in-review'
              })
                .catch((err) => catchBlock(err, setLoading, setToasts))
            })
            .catch((err) => catchBlock(err, setLoading, setToasts))
        })
        .catch((err) => catchBlock(err, setLoading, setToasts))
    })
    .then((docID) => {
      setLoading(false)
      setToasts(successToast("AI/Online tool submitted for review."))
      return docID
    })
    .catch((err) => catchBlock(err, setLoading, setToasts))
}

export const updateNonApprovedToolService = async (tool, toolID, images, setLoading, setToasts) => {
  setLoading(true)
  const path = 'toolsSubmissions'
  const storagePath = `toolsSubmissions/${toolID}/images`
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
                ...(mainImgs.length > 0 && { mainImg: mainImgURLs[mainImgURLs.length - 1]?.downloadURL }),
                ...(logos.length > 0 && { logo: logoURLs[logoURLs.length - 1]?.downloadURL }),
                ...(toolImages.length > 0 && { images: firebaseArrayAdd(imagesURLs.map(img => img?.downloadURL)) }),
              })
                .catch((err) => catchBlock(err, setLoading, setToasts))
            })
            .catch((err) => catchBlock(err, setLoading, setToasts))
        })
        .catch((err) => catchBlock(err, setLoading, setToasts))
    })
    .then((docID) => {
      setLoading(false)
      setToasts(successToast("AI/Online tool submission updated successfully (Still in review)."))
      return docID
    })
    .catch((err) => catchBlock(err, setLoading, setToasts))
}

export const updateApprovedToolService = async (tool, toolID, images, setLoading, setToasts) => {
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
                inReview: true,
                ...(mainImgs.length > 0 && { mainImg: mainImgURLs[mainImgURLs.length - 1]?.downloadURL }),
                ...(logos.length > 0 && { logo: logoURLs[logoURLs.length - 1]?.downloadURL }),
                ...(toolImages.length > 0 && { images: firebaseArrayAdd(imagesURLs.map(img => img?.downloadURL)) }),
              })
                .catch((err) => catchBlock(err, setLoading, setToasts))
            })
            .catch((err) => catchBlock(err, setLoading, setToasts))
        })
        .catch((err) => catchBlock(err, setLoading, setToasts))
    })
    .then((docID) => {
      setLoading(false)
      setToasts(successToast("AI/Online tool submission updated successfully (Now under review)."))
      return docID
    })
    .catch((err) => catchBlock(err, setLoading, setToasts))
}

export const guestToolSubmissionService = (submission, setLoading, setToasts) => {
  setLoading(true)
  const path = 'guestToolsSubmissions'
  const docID = getRandomDocID(path)
  return setDB(path, docID, {
    ...submission,
    submissionID: docID,
    dateSubmitted: new Date(),
    status: 'in-review',
    cleanedURL: extractDomainFromURL(submission.url)
  })
    .then(() => {
      setLoading(false)
      setToasts(successToast("AI/Online tool submitted for review."))
    })
    .catch((err) => catchBlock(err, setLoading, setToasts))
}

export const submitNewPromptRequestService = (prompt, userID, setLoading, setToasts) => {
  setLoading(true)
  const path = 'promptsSubmissions'
  const docID = getRandomDocID(path)
  return setDB(path, docID, {
    ...prompt,
    promptID: docID,
    submitterID: userID,
    proUserAdded: true,
    dateSubmitted: new Date(),
    status: 'in-review'
  })
    .then(() => {
      setLoading(false)
      setToasts(successToast("Prompt submitted for review."))
      return docID
    })
    .catch((err) => catchBlock(err, setLoading, setToasts))
}

export const updateNonApprovedPromptService = (prompt, promptID, setLoading, setToasts) => {
  setLoading(true)
  const path = 'promptsSubmissions'
  return updateDB(path, promptID, {
    ...prompt,
    status: 'in-review'
  })
    .then(() => {
      setLoading(false)
      setToasts(successToast("Prompt updated successfully. (Still in review)"))
    })
    .catch((err) => catchBlock(err, setLoading, setToasts))
}

export const updateApprovedPromptService = (prompt, promptID, setLoading, setToasts) => {
  setLoading(true)
  const path = 'prompts'
  return updateDB(path, promptID, {
    ...prompt,
    inReview: true
  })
    .then(() => {
      setLoading(false)
      setToasts(successToast("Prompt updated successfully. (Now under review)"))
    })
    .catch((err) => catchBlock(err, setLoading, setToasts))
}
