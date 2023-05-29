import React, { useContext, useEffect, useState } from 'react'
import './styles/VerifyAccountPage.css'
import verifyAccountImg from 'app/assets/images/verify-account-img.png'
import AppButton from "app/components/ui/AppButton"
import { StoreContext } from "app/store/store"
import { verifyAccountService } from "app/services/emailServices"
import { useNavigate, useSearchParams } from "react-router-dom"
import { errorToast, successToast } from "app/data/toastsTemplates"
import { updateDB } from "app/services/CrudDB"

export default function VerifyAccountPage() {

  const { myUser, myUserID, setToasts } = useContext(StoreContext)
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const handleVerifyAccount = () => {
    setLoading(true)
    verifyAccountService(token)
      .then((email) => {
        if (email === myUser.email) {
          return updateDB('users', myUserID, {
            isVerified: true
          })
            .then(() => {
              setToasts(successToast(`Account verified. Thank you for verifying your account on Mark AI!`))
              setSearchParams('')
              setLoading(false)
              navigate('/')
            })
            .catch((error) => {
              console.log(error)
              setToasts(errorToast('There was an error verifying your account. Please try again.'))
              setLoading(false)
            })
        }
        else {
          setToasts(errorToast(`Account verification failed. Please make sure you login with the correct email address.`))
          setLoading(false)
        }
      })
      .catch((error) => {
        console.log(error)
        setToasts(errorToast(`Account verification failed. Please try again`))
        setLoading(false)
      })
  }

  useEffect(() => {
    if (myUser?.isVerified || !token) return navigate('/')
    if (myUser) {
      handleVerifyAccount()
    }
  }, [myUser])

  return (
    <div className="verify-account-page">
      <h1>Verify your account</h1>
      <img src={verifyAccountImg} alt="Verify Account" />
      <p>
        We are verifying your account. If this page does not redirect you to the
        home page in 5 seconds, please click the button below.
      </p>
      <AppButton
        label="Verify Account"
        onClick={handleVerifyAccount}
        loading={loading}
      />
    </div>
  )
}
