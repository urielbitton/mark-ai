import React from 'react'
import './styles/GuideSection.css'

export default function GuideSection({ title, children }) {
  return (
    <div className="guide-section">
      <div className="top">
        <h4>{title}</h4>
        <i className="fas fa-lightbulb" />
      </div>
      <div className="bottom">
        {children}
      </div>
    </div>
  )
}
