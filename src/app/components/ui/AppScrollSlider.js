import React from 'react'
import './styles/AppScrollSlider.css'

export default function AppScrollSlider(props) {

  const { children, hideScrollbar = true, className = '' } = props

  return (
    <div className={`scroll-slider-container ${hideScrollbar ? 'hide-scrollbar' : ''} ${className}`}>
      <div className="scroll-flex">
        {children}
      </div>
      <div className="fader" />
    </div>
  )
}
