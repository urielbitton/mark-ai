import React, { useContext, useEffect, useRef, useState } from 'react'
import './styles/GuestSubmissionPage.css'
import GuideSection from "app/components/dashboard/GuideSection"
import { Link } from "react-router-dom"
import { AppInput } from "app/components/ui/AppInputs"
import AppButton from "app/components/ui/AppButton"
import ReCAPTCHA from "react-google-recaptcha"
import { errorToast } from "app/data/toastsTemplates"
import { StoreContext } from "app/store/store"
import { guestToolSubmissionService } from "app/services/aitoolsServices"
import { noWhiteSpaceChars, validateEmail, validateURL } from "app/utils/generalUtils"
import { sendGuestSubmissionEmail } from "app/services/emailServices"

export default function GuestSubmissionPage() {

  const { setToasts } = useContext(StoreContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const [submissionDone, setSubmissionDone] = useState(false)
  const recaptchaRef = useRef(null)
  const doneSectionRef = useRef(null)

  const validateForm = (
    name.length > 0 
    && validateEmail(email)
    && title.length > 0
    && validateURL(url)
  )

  const clearForm = () => {
    setName('')
    setEmail('')
    setTitle('')
    setUrl('')
  }

  const handleSubmitTool = () => {
    recaptchaRef.current.execute()
    if (!!!token) return setToasts(errorToast('Recaptcha test failed. Please try again.'))
    if (!validateForm) return setToasts(errorToast('Please fill out all fields correctly.'))
    guestToolSubmissionService(
      {
        name,
        email,
        title,
        url,
      },
      setLoading,
      setToasts,
    )
    .then(() => {
      clearForm()
      setSubmissionDone(true)
      setTimeout(() => {
        doneSectionRef.current.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      sendGuestSubmissionEmail(email)
    })
  }

  useEffect(() => {
    recaptchaRef.current.execute()
  },[])

  return (
    <div className="guest-submission">
      <h1>Submit a Tool</h1>
      <GuideSection title="Submit an AI or online tool to be added to the site.">
        <p>
          If you have an AI or online tool that you would like to be added to the site, please fill out
          the form below. Make sure the URL is a valid link to the tool. If you have any questions,
          please contact us at <Link to="/contact">here</Link>.
        </p>
      </GuideSection>
      <form
        className="submit-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <AppInput
          label="Your Name"
          type="text"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <AppInput
          label="Your Email"
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AppInput
          label="Tool Name"
          type="text"
          placeholder="Name of the tool or website"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <AppInput
          label={<>Tool URL &nbsp;{noWhiteSpaceChars(url) ? validateURL(url) ? <i className="fas fa-check-circle"/> : <i className="fas fa-times-circle" /> : ''}</>}
          placeholder="URL of the website"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          subtext={<small>Accepted formats: <span>https://www.example.com</span>, <span>www.example.com</span>, <span>example.com</span></small>}
        />
        <div className="btn-group">
          <AppButton
            label="Submit Tool"
            onClick={handleSubmitTool}
            loading={loading}
            disabled={!validateForm}
          />
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_GOOGLE_CAPTCHA_KEY}
            onChange={(token) => setToken(token)}
            size="invisible"
            ref={recaptchaRef}
          />
        </div>
      </form>
      {
        submissionDone &&
        <div 
          className="submission-done"
          ref={doneSectionRef}
        >
          <h4><i className="fas fa-check-circle"/>Thank you for your submission!</h4>
          <p>We will review your submission and add it to the site if it meets our criteria.</p>
          <br/>
          <p>
            We sent you a confirmation email. If your submission is accepted, we will notify you by email. 
            You can also<br/><Link to="/register">create an account</Link> for faster tools 
            review and submissions.
          </p>
        </div>
      }
    </div>
  )
}
