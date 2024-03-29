const functions = require("firebase-functions")
const algoliasearch = require('algoliasearch')
const firebase = require("firebase-admin")
const sgMail = require('@sendgrid/mail')

firebase.initializeApp()
const db = firebase.firestore()
db.settings({ ignoreUndefinedProperties: true })
sgMail.setApiKey(functions.config().sendgrid.key)
const APP_ID = functions.config().algolia.app
const API_KEY = functions.config().algolia.key
// @ts-ignore
const client = algoliasearch(APP_ID, API_KEY)
const aitoolsIndex = client.initIndex('aitools_index')
const promptsIndex = client.initIndex('prompts_index')


// Algolia functions
exports.addToIndexAitools = functions
.region('northamerica-northeast1')
.firestore.document('aitools/{aitoolID}')
.onCreate((snapshot) => {
  const data = snapshot.data()
  const objectID = snapshot.id
  return aitoolsIndex.saveObject({ ...data, objectID })
})

exports.updateIndexAitools = functions
.region('northamerica-northeast1')
.firestore.document('aitools/{aitoolID}')
.onUpdate((change) => {
  const newData = change.after.data()
  const objectID = change.after.id
  return aitoolsIndex.saveObject({ ...newData, objectID })
})

exports.deleteFromIndexAitools = functions
.region('northamerica-northeast1')
.firestore.document('aitools/{aitoolID}')
.onDelete((snapshot) => {
  return recursivelyDeleteDocument('aitools', snapshot.id)
  .then(() => {
    return deleteStorageFolder(`aitools/${snapshot.id}`)
  })
  .then(() => {
    return aitoolsIndex.deleteObject(snapshot.id)
  })
  .catch((err) => console.log(err))
})

exports.addToIndexPrompts = functions
.region('northamerica-northeast1')
.firestore.document('prompts/{promptID}')
.onCreate((snapshot) => {
  const data = snapshot.data()
  const objectID = snapshot.id
  return promptsIndex.saveObject({ ...data, objectID })
})

exports.updateIndexPrompts = functions
.region('northamerica-northeast1')
.firestore.document('prompts/{promptID}')
.onUpdate((change) => {
  const newData = change.after.data()
  const objectID = change.after.id
  return promptsIndex.saveObject({ ...newData, objectID })
})

exports.deleteFromIndexPrompts = functions
.region('northamerica-northeast1')  
.firestore.document('prompts/{promptID}')
.onDelete((snapshot) => {
  return promptsIndex.deleteObject(snapshot.id)
})



// Cleanup firebase functions
function recursivelyDeleteDocument(path, docID) {
  return firebase.firestore().recursiveDelete(firebase.firestore().doc(`${path}/${docID}`))
}

function deleteStorageFolder(path) {
  const bucket = firebase.storage().bucket()
  return bucket.deleteFiles({
    prefix: path
  })
}


// Sendgrid functions
exports.sendEmailWithAttachment = functions
  .https.onCall((data, context) => {
    const msg = {
      from: data.from,
      to: data.to,
      subject: data.subject,
      html: data.html,
      attachments: data.attachments
    }
    return sgMail.send(msg)
      .catch(err => console.log(err))
  })


// Utility Functions

function createNotification(userID, title, text, icon, url) {
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

function formatCurrency(number) {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function getRandomDocID(path) {
  return db.collection(path).doc().id
}

function setDB(path, doc, value, merge = true) {
  return db.collection(path).doc(doc).set(value, { merge })
}

function updateDB(path, doc, value) {
  return db.collection(path).doc(doc).update(value)
}

function deleteDB(path, doc) {
  return db.collection(path).doc(doc).delete()
}

function firebaseArrayAdd(value) {
  return firebase.firestore.FieldValue.arrayUnion(value)
}

function firebaseArrayRemove(value) {
  return firebase.firestore.FieldValue.arrayRemove(value)
}

function firebaseIncrement(value) {
  return firebase.firestore.FieldValue.increment(value)
}