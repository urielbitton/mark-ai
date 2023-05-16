import React from 'react'
import './styles/AppLoadingPage.css'
import logo from 'app/assets/images/logo2.png'

export default function AppLoadingPage() {
  return (
    <div className="app-loading-page">
      <div className="top"/>
      <div className="middle">
        <div className="logo-container">
          <img src={logo} alt="logo" />
        </div>
        <i className="fal fa-spinner-third fa-spin" />
      </div>
      <div className="bottom">
        <h5>Mark AI</h5>
        <small>Your AI tools in one place</small>
      </div>
    </div>
  )
}
