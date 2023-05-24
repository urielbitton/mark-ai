import React, { useContext, useRef, useState } from 'react'
import './styles/UpgradePage.css'
import upgradeImg from 'app/assets/images/upgrade-img.png'
import AppButton from "app/components/ui/AppButton"
import PayPalButton from "app/components/ui/PayPalButton"
import { StoreContext } from "app/store/store"

export default function UpgradePage() {

  const { upgradeProPrice } = useContext(StoreContext)
  const [showPaypal, setShowPaypal] = useState(false)
  const paymentSectionRef = useRef(null)

  const showPaypalSection = () => {
    setShowPaypal(true)
    setTimeout(() => {
      paymentSectionRef.current.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleOnSuccess = (data, actions) => {
    console.log('success', data, actions)
  }

  const handleOnError = (err) => {
    console.log('error', err)
  }

  return (
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
          <h3>$20</h3>
          <h5>
            <i className="fas fa-lock" />
            One time payment
          </h5>
          <PayPalButton
            amount={upgradeProPrice}
            currency="USD"
            onSuccess={handleOnSuccess}
            onError={handleOnError}
          />
        </div>
      }
    </div>
  )
}
