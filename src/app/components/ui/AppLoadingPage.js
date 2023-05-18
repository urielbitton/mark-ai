import React from 'react'
import './styles/AppLoadingPage.css'
import AILoader from "./AILoader"

export default function AppLoadingPage() {
  return (
    <div className="app-loading-page">
      <div className="top" />
      <div className="middle">
        <AILoader 
          whiteImg 
          colored={false}
          imgHeight={120}
        />
      </div>
      <div className="bottom">
        <h5>Mark AI</h5>
        <small>Your AI tools in one place</small>
      </div>
    </div>
  )
}
