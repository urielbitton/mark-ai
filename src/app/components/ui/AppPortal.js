import React from 'react'
import './styles/AppPortal.css'
import { createPortal } from 'react-dom'

export default function AppPortal(props) {

  const { children, showPortal, className="app-portal" } = props

  if (!showPortal) return null
  return createPortal(
    <div className={className}>
      {children}
    </div>, 
    document.body
  )
}

