import React from 'react'
import whiteLogo from 'app/assets/images/logo.png'
import colorLogo from 'app/assets/images/logo-color.png'
import './styles/AILoader.css'

export default function AILoader({whiteImg=false, imgHeight=70, colored=true }) {
  return (
    <div className="ai-loader">
      <div className={`animation-bubbles ${colored ? 'colored' : ''}`}>
        <div className="bubble bubble-3" />
        <div className="bubble bubble-2" />
        <div className="bubble bubble-1" />
      </div>
        <img 
        src={whiteImg ? whiteLogo: colorLogo} 
        alt="logo" 
        style={{height: imgHeight}}
        /> 
    </div>
  )
}
