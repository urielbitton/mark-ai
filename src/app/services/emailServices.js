import { guestSubmissionEmailTemplate, verifyEmailTemplate, welcomeEmailTemplate } from "app/data/emailTemplates"
import { db, functions } from "app/firebase/fire"
import { convertFilesToBase64 } from "app/utils/fileUtils"
import { doc, getDoc } from "firebase/firestore"
import { httpsCallable } from "firebase/functions"
import { getRandomDocID, setDB } from "./CrudDB"

export const sendSgEmail = (to, subject, html, files) => {
  return convertFilesToBase64(files)
    .then((base64s) => {
      return httpsCallable(functions, 'sendEmailWithAttachment')({
        from: 'info@atomicsdigital.com',
        to: to,
        subject: subject,
        html: html,
        ...(files.length > 0 && {
          attachments: [
            ...files.map((file, i) => {
              return {
                content: base64s[i],
                filename: file.name,
                type: file.type,
                disposition: 'attachment'
              }
            })
          ]
        })
      })
        .then((result) => {
          console.log({ result, files })
        })
        .catch((error) => console.log(error))
    })
    .catch((error) => console.log(error))
}

export const sendGuestSubmissionEmail = (email) => {
  return sendSgEmail(
    email,
    `Thank you for your submission on Mark AI!`,
    guestSubmissionEmailTemplate(),
    []
  )
}

export const sendWelcomeEmail = (name, email) => {
  return sendSgEmail(
    email,
    `Welcome to Mark AI!`,
    welcomeEmailTemplate(name),
    []
  )
}

export const sendAccountVerificationEmail = (name, email) => {
  const path = 'verifyAccountTokens'
  const token = getRandomDocID(path)
  return setDB(path, token, {
    token,
    expiryDate: new Date(new Date().getTime() + 15 * 60 * 1000),
    email
  })
    .then(() => {
      return sendSgEmail(
        email,
        `Verify your account on Mark AI`,
        verifyEmailTemplate(name, token),
        []
      )
    })
}

export const verifyAccountService = (token) => {
  const tokensRef = doc(db, 'verifyAccountTokens', token)
  return getDoc(tokensRef)
    .then((doc) => {
      if (doc.exists) {
        const { email, expiryDate } = doc.data()
        if (expiryDate.toDate() > new Date()) {
          return email
        }
        else {
          throw new Error('Token expired. Please request a new verification email.')
        }
      }
      else {
        throw new Error('Token not found. Please request a new verification email.')
      }
    })
}