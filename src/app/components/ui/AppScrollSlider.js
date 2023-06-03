import React, { useEffect, useRef } from 'react'
import './styles/AppScrollSlider.css'
import { useLocation } from "react-router-dom"

export default function AppScrollSlider(props) {

  const { children, hideScrollbar = true, gap=20, className = '' } = props
  const location = useLocation()
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0)
    }
  },[location])

  return (
    <div className={`scroll-slider-container ${hideScrollbar ? 'hide-scrollbar' : ''} ${className}`}>
      <div 
        className="scroll-flex"
        style={{ gap }}
        ref={scrollRef}
      >
        {children}
      </div>
      <div className="fader" />
    </div>
  )
}
