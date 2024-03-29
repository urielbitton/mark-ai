import React, { useContext, useEffect, useState } from 'react'
import './styles/Auth.css'
import { StoreContext } from 'app/store/store'
import { AppInput } from 'app/components/ui/AppInputs'
import { Link, useNavigate } from 'react-router-dom'
import { clearAuthState } from 'app/services/CrudDB'
import googleIcon from 'app/assets/images/google-icon.png'
import facebookIcon from 'app/assets/images/facebook-icon.png'
import {
  facebookAuthService, googleAuthService,
  plainAuthService
} from "app/services/authServices"
import { validateEmail } from "app/utils/generalUtils"
import AppButton from "app/components/ui/AppButton"
import { infoToast, successToast } from "app/data/toastsTemplates"
import { createNotification } from "app/services/notifServices"

export default function Register() {

  const { myUserID, setMyUser, setToasts, photoURLPlaceholder } = useContext(StoreContext)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passError, setPassError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const clearErrors = () => {
    setEmailError('')
    setPassError('')
  }

  const googleAuth = () => {
    googleAuthService(photoURLPlaceholder, setMyUser, setLoading, setToasts)
      .then((res) => {
        if (res === 'error') return
        navigate('/')
      })
  }

  const facebookAuth = () => {
    facebookAuthService(photoURLPlaceholder, setLoading, setToasts)
      .then((res) => {
        if (res === 'error') return
        navigate('/')
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!firstName || !lastName) return setToasts(infoToast('Please enter your first and last name.'))
    if (!validateEmail(email)) return setToasts(infoToast('Please enter your email and password.'))
    if (password !== confirmPassword) return setToasts(infoToast('Passwords do not match.'))
    plainAuthService(
      firstName,
      lastName,
      email,
      password,
      photoURLPlaceholder,
      setLoading,
      setEmailError,
      setPassError
    )
      .then((res) => {
        if (res !== 'error') {
          setToasts(successToast(`Hi ${firstName}, welcome to MarkAI! We are glad to have you here.`))
          createNotification(
            myUserID,
            `Please verify your account`,
            `Please verify your  on Mark AI. Check your email for the verification link. If you didn't `+
            `receive an email or if the link has expired, you can request a new one in your account page.`,
            'fas fa-info-circle',
            `/my-account`,
          )
          navigate('/')
        }
      })
    clearErrors()
  }

  useEffect(() => {
    clearErrors()
  }, [])

  return (
    <div className="login-container register-container">
      <div className="auth-cover" />
      <div className="login-info">
        <div className="container">
          <div className="auth-titles">
            <h4>Sign Up</h4>
          </div>
          <div className="social-logins">
            <div
              className="google-btn btn"
              onClick={() => googleAuth()}
            >
              <img src={googleIcon} className="img-icon" alt="google-icon" />
              <span>Sign Up with Google</span>
            </div>
            <div
              className="facebook-btn btn"
              onClick={() => facebookAuth()}
            >
              <img src={facebookIcon} className="img-icon" alt="facebook-icon" />
              <span>Sign Up with Facebook</span>
            </div>
          </div>
          <small className="sep-alt"><hr /><span>Or register with email</span><hr /></small>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="double-row">
              <AppInput
                label="First Name"
                placeholder="James"
                onChange={(e) => setFirstName(e.target.value)}
              />
              <AppInput
                label="Last Name"
                placeholder="Hendrix"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <AppInput
              label="Email"
              placeholder="jameshendrix@markai.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <h6 className="email-error">{emailError}</h6>}
            <div className="double-row">
              <AppInput
                label="Password"
                placeholder="5 characters or more"
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
                iconright={
                  <i
                    className={`fas fa-eye${showPassword ? '-slash' : ''}`}
                    onClick={() => setShowPassword(prev => !prev)}
                  />
                }
              />
              <AppInput
                label="Confirm Password"
                placeholder="5 characters or more"
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="password-input"
                iconright={
                  <i
                    className={`fas fa-eye${showPassword ? '-slash' : ''}`}
                    onClick={() => setShowPassword(prev => !prev)}
                  />
                }
              />
            </div>
            {passError && <h6 className="email-error">{passError}</h6>}
            <div className="login-options">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => {
                    setRememberMe(e.target.checked)
                    clearAuthState(e.target.checked)
                  }}
                />
                <span>Remember Me</span>
              </label>
              <Link to="/forgot-password" className="linkable">Forgot password?</Link>
            </div>
            <AppButton
              label="Register"
              onClick={(e) => handleSubmit(e)}
              rightIcon={!loading ? "fal fa-arrow-right" : "fas fa-spinner fa-spin"}
              className="submit-btn"
            />
          </form>
          <h6 className="no-account-text">
            Already have an account?&nbsp;
            <Link to="/login">Login here</Link>
          </h6>
        </div>
      </div>
    </div>
  )
}
