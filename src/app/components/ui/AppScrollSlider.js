import React from 'react'
import './styles/AppScrollSlider.css'

export default function AppScrollSlider(props) {

  const { children, hideScrollbar = true, gap=20, className = '' } = props

  return (
    <div className={`scroll-slider-container ${hideScrollbar ? 'hide-scrollbar' : ''} ${className}`}>
      <div 
        className="scroll-flex"
        style={{ gap }}
      >
        {children}
      </div>
      <div className="fader" />
    </div>
  )
}
