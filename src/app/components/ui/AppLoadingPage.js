import React from 'react'
import './styles/AppLoadingPage.css'
import logo from 'app/assets/images/logo.png'

export default function AppLoadingPage() {
  return (
    <div className="app-loading-page">
      <div className="top" />
      <div className="middle">
        <div className="animation-bubbles">
          <div className="bubble bubble-3" />
          <div className="bubble bubble-2" />
          <div className="bubble bubble-1" />
        </div>
        <img src={logo} alt="logo" />
      </div>
      <div className="bottom">
        <h5>Mark AI</h5>
        <small>Your AI tools in one place</small>
      </div>
    </div>
  )
}
