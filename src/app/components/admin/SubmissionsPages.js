import React from 'react'
import './styles/SubmissionsPages.css'

export default function SubmissionsPages({ title = '', leftComponent = null, rightComponent = null, className = '', children }) {
  return (
    <div className={`submissions-pages ${className}`}>
      <div className="tools-bar">
        <div className="left-side side">
          <h5>{title}</h5>
          {leftComponent}
        </div>
        <div className="right-side side">
          {rightComponent}
        </div>
      </div>
      <div className="subs-content">
        {children}
      </div>
    </div>
  )
}
