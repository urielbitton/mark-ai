import React, { useContext, useRef, useState } from 'react'
import './styles/UpgradePage.css'
import upgradeImg from 'app/assets/images/upgrade-img.png'
import AppButton from "app/components/ui/AppButton"
import PayPalButton from "app/components/ui/PayPalButton"
import { StoreContext } from "app/store/store"
import { useNavigate } from "react-router-dom"
import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import { formatCurrency } from "app/utils/generalUtils"
import { updateDB } from "app/services/CrudDB"
import { createNotification } from "app/services/notifServices"
import { createTransactionService } from "app/services/transactionServices"
import { auth } from "app/firebase/fire"

export default function UpgradePage() {

  const { upgradeProPrice, myUser, myUserType, setToasts } = useContext(StoreContext)
  const [showPaypal, setShowPaypal] = useState(false)
  const paymentSectionRef = useRef(null)
  const isPro = myUserType === 'pro' || myUserType === 'admin'
  const navigate = useNavigate()

  const showPaypalSection = () => {
    if(isPro) return setToasts(infoToast('You are already a Pro user'))
    if(!myUser) {
      setToasts(infoToast('Please login to upgrade to pro'))
      return navigate('/login')
    }
    setShowPaypal(true)
    setTimeout(() => {
      paymentSectionRef.current.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleOnSuccess = (data, details) => {
    const myUserID = auth?.currentUser?.uid
    updateDB('users', myUserID, { 
      userType: 'pro' 
    })
    .then(() => {
      return createTransactionService(myUserID, data, details)
    })
    .then(() => {
      return createNotification(
        myUserID,
        'Pro Membership Payment Successful',
        `Your payment of ${formatCurrency(upgradeProPrice)} has been processed successfully. `+
        `You are now a Pro user! You can find the transaction details in your account under `+
        `payments and you can find your receipt in your PayPal account.`,
        'fas fa-rocket',
        '/dashboard'
      )
    })
    .then(() => {
      setToasts(successToast('Your payment has been processed successfully. You are now a Pro user!', true))
      navigate('/dashboard')
    })
  }

  const handleOnError = (err) => {
    setToasts(errorToast('There was an error processing your payment. Please try again later.'))
    console.log(err)
  }

  return !isPro ? (
    <div className="upgrade-page">
      <img
        src={upgradeImg}
        alt="Upgrade to Pro"
        className="main-img"
      />
      <div className="titles">
        <h1>Upgrade To <span className="gradient-text">Pro</span></h1>
        <h5>Unlock premium features when you upgrade to Pro</h5>
      </div>
      <div className="table-list">
        <i className="fal fa-rocket main-icon" />
        <h4>Pro Features</h4>
        <h6>
          <i className="fas fa-check" />
          Unlimited Bookmarks
        </h6>
        <h6>
          <i className="fas fa-check" />
          Access to submit new AI/online tools
        </h6>
        <h6>
          <i className="fas fa-check" />
          Access to submit new chat prompts
        </h6>
        <h6>
          <i className="fas fa-check" />
          Ads free
        </h6>
        <h6>
          <i className="fas fa-check" />
          One time payment
        </h6>
        <AppButton
          label="Upgrade Now"
          buttonType="outlineWhiteBtn"
          onClick={showPaypalSection}
          rightIcon="fal fa-arrow-right"
        />
      </div>
      {
        <div 
          className={`payment-section ${showPaypal ? 'show' : ''}`} 
          ref={paymentSectionRef}
        >
          <h3>${formatCurrency(upgradeProPrice)}</h3>
          <h5>
            <i className="fas fa-lock" />
            One time payment
          </h5>
          <PayPalButton
            amount={upgradeProPrice}
            currency="CAD"
            onSuccess={handleOnSuccess}
            onError={handleOnError}
          />
        </div>
      }
    </div>
  ) :
  <div className="upgrade-page">
    <h3>You are already a Pro user</h3>
    <AppButton
      label="Go to Dashboard"
      onClick={() => navigate('/dashboard')}
    />
  </div>
}
