import { db } from "app/firebase/fire"
import {
  collection, doc, getCountFromServer, getDoc, getDocs, limit,
  orderBy,
  query, where, writeBatch
} from "firebase/firestore"
import { addNewToolService } from "./aitoolsServices"
import { updateDB } from "./CrudDB"
import { sendSgEmail } from "./emailServices"
import { approvedGuestSubmissionEmailTemplate } from "app/data/emailTemplates"

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

export const getToolSubmissionByID = (toolID) => {
  const toolRef = doc(db, 'toolsSubmissions', toolID)
  return getDoc(toolRef)
    .then((doc) => {
      return doc.data()
    })
}

export const getPromptSubmissionByID = (promptID) => {
  const promptRef = doc(db, 'promptsSubmissions', promptID)
  return getDoc(promptRef)
    .then((doc) => {
      return doc.data()
    })
}

export const getToolsSubmissionsByStatus = (status, lim) => {
  const subRef = collection(db, 'toolsSubmissions')
  const q = query(
    subRef,
    where('status', '==', status),
    orderBy('dateSubmitted', 'desc'),
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
    orderBy('dateSubmitted', 'desc'),
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

export const getGuestToolsSubmissionsByStatus = (status, lim) => {
  const subRef = collection(db, 'guestToolsSubmissions')
  const q = query(
    subRef,
    where('status', '==', status),
    orderBy('dateSubmitted', 'desc'),
    limit(lim)
  )
  return getDocs(q)
    .then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data())
    })
}

export const getGuestToolsSubmissionsCountByStatus = (status) => {
  const subRef = collection(db, 'guestToolsSubmissions')
  const q = query(
    subRef,
    where('status', '==', status)
  )
  return getCountFromServer(q)
    .then((count) => {
      return count.data().count
    })
}

//create tool from guest submission
export const adminCreateToolFromGuestSubmission = (tool, submitter, setLoading, setToasts) => {
  return addNewToolService(
    {
      title: tool.title,
      tagline: tool.tagline,
      shortDescription: tool.shortDescription,
      category: tool.category,
      url: tool.url,
      tags: tool.tags,
      type: tool.type,
      isPaid: tool.isPaid,
      hasApp: tool.hasApp,
      features: tool.features,
      mainImg: tool.mainImg,
      logo: tool.logo,
      images: tool.images,
    },
    setLoading,
    setToasts
  )
    .then((res) => {
      if (res !== 'error') {
        return updateDB('aitools', res, {
          status: 'approved',
          dateApproved: new Date(),
        })
      }
    })
    .then(() => {
      return updateDB('guestToolsSubmissions', submitter.submissionID, {
        status: 'approved',
        dateApproved: new Date(),
      })
    })
    .then(() => {
      return sendSgEmail(
        submitter.email,
        `Thank you for your submission on Mark AI`,
        approvedGuestSubmissionEmailTemplate(submitter.name, tool.title, tool.url),
        []
      )
    })
    .catch((error) => {
      console.log(error)
    })
}