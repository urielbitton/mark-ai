import React, { useState } from 'react'
import ImgSkeleton from "./ImgSkeleton"
import './styles/Avatar.css'

export default function Avatar(props) {

  const { src, dimensions = "50px", alt = 'avatar', title,
    border, onClick, enableEditing, removeTitle,
    className = '', round = true } = props
  const [loading, setLoading] = useState(true)

  return (
    <div
      className={`avatar-container ${className} ${round ? 'round' : ''}`}
      style={{ width: dimensions, height: dimensions, minWidth: dimensions, border }}
      title={title}
      onClick={() => onClick && onClick()}
      key={src}
    >
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoading(false)}
      />
      <ImgSkeleton 
        loading={loading} 
        round={round}
      />
      {
        enableEditing &&
        <div
          className="avatar-remove-icon"
          title={removeTitle}
        >
          <i className="fal fa-times" />
        </div>
      }
    </div>
  )
}
