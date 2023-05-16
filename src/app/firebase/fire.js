import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore  } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, 
  FacebookAuthProvider } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getFunctions } from 'firebase/functions'

const config = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
}
const firebaseApp = initializeApp(config)

// initializeFirestore(firebaseApp, {
//   ignoreUndefinedProperties: true,
// })

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)
const storage = getStorage(firebaseApp)
const functions = getFunctions(firebaseApp)

export { db, auth, storage, functions } 
