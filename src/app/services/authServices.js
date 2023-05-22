import { auth } from "app/firebase/fire"
import { createUserDocService, doGetUserByID } from "./userServices"
import firebase from "firebase/compat/app"
import { successToast, infoToast, errorToast } from "app/data/toastsTemplates"
import { deleteDB } from "./CrudDB"
import {
  createUserWithEmailAndPassword, onAuthStateChanged,
  signInWithPopup, updateProfile
} from "firebase/auth"

export const completeRegistrationService = (user, authMode, res, userName, photoURL, setLoading) => {
  updateProfile(user, {
    displayName: authMode === 'plain' ? `${userName.firstName} ${userName.lastName}` : authMode === 'google' ? res.additionalUserInfo.profile.name : res.name,
    photoURL: authMode === 'facebook' ? res.picture.data.url : photoURL
  })
  return createUserDocService(user, res, authMode, photoURL, setLoading)
    .then(() => {
      setLoading(false)
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
    })
}

export const plainAuthService = (firstName, lastName, email, password, photoURL, setLoading, setEmailError, setPassError) => {
  const userName = { firstName, lastName }
  setLoading(true)
  return createUserWithEmailAndPassword(auth, email.replaceAll(' ', ''), password.replaceAll(' ', ''))
    .then(() => {
      return onAuthStateChanged(auth, user => {
        if (user) {
          return completeRegistrationService(user, 'plain', null, userName, photoURL, setLoading)
        }
        else {
          setLoading(false)
        }
      })
    })
    .catch(err => {
      setLoading(false)
      switch (err.code) {
        case "auth/email-already-in-use":
          setEmailError('This email address is already in use.'); break;
        case "auth/invalid-email":
          setEmailError('Please enter a valid email address.'); break;
        case "auth/weak-password":
          setPassError('The password is not long enough or too easy to guess.'); break
        default: setEmailError('An error occurred. Please try again.')
      }
    })
}

export const googleAuthService = (photoURL, setMyUser, setLoading, setToasts) => {
  setLoading(true)
  const provider = new firebase.auth.GoogleAuthProvider()
  provider.addScope('email')
  return signInWithPopup(auth, provider)
    .then((res) => {
      // @ts-ignore
      if (res.additionalUserInfo.isNewUser) {
        return completeRegistrationService(res.user, 'google', res, null, photoURL, setLoading)
      }
      else {
        setMyUser(res.user)
      }
      setLoading(false)
    })
    .catch((error) => {
      setLoading(false)
      console.log(error)
      if (error.code === 'auth/account-exists-with-different-credential')
        setToasts(infoToast('You have already signed up with a different provider for that email. Please sign in with that provider.'))
      else
        setToasts(errorToast('An errror occurred with the google login. Please try again.'))
    })
}

export const facebookAuthService = (photoURL, setLoading, setToasts) => {
  setLoading(true)
  const provider = new firebase.auth.FacebookAuthProvider()
  return firebase.auth().signInWithPopup(provider)
    .then((res) => {
      const credential = res.credential
      const user = res.user
      // @ts-ignore
      const accessToken = credential.accessToken
      return fetch(`https://graph.facebook.com/me?access_token=${accessToken}&fields=name,first_name,last_name,email,picture.width(720).height(720)`)
        .then(fbRes => fbRes.json())
        .then(fbRes => {
          console.log(fbRes)
          return completeRegistrationService(user, 'facebook', fbRes, null, photoURL, setLoading)
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
        })
    })
    .catch((err) => {
      console.log(err)
      if (err.code === 'auth/account-exists-with-different-credential')
        setToasts(infoToast('You have already signed up with a different provider. Please sign in with that provider.'))
      else if (err.code === 'auth/popup-blocked')
        setToasts(infoToast('Popup blocked. Please allow popups for this site.'))
      else
        setToasts(errorToast('An error with facebook has occured. Please try again later.'))
    })
}

export const createAccountOnLoginService = (loggedInUser, photoURL, setLoading, setToasts) => {
  return doGetUserByID(loggedInUser.uid)
    .then((user) => {
      if (!user) {
        return createUserDocService(loggedInUser, null, 'plain', photoURL, setLoading)
      }
      else return setToasts(infoToast('User already exists.'))
    })
}

export const deleteAccountService = (setToasts, setLoading) => {
  setLoading(true)
  return deleteDB('users', auth.currentUser.uid)
    .then(() => {
      auth.currentUser.delete()
        .then(() => {
          setToasts(successToast('Account deleted.'))
          setLoading(false)
        })
        .catch(err => {
          setToasts(infoToast('There was an error deleting your account. Please try again.'))
          console.log(err)
          setLoading(false)
        })
    })
    .catch(err => {
      setLoading(false)
      setToasts(infoToast('There was an error deleting your account. Please try again.'))
      console.log(err)
    })
}