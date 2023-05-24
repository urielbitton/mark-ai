import React from 'react'
import './styles/SkeletonLoader.css'

export default function SkeletonLoader({small=false, borderRadius=10}) {
  return (
    <div 
      className={`skeleton-loader ${small ? 'small' : ''}`}
      style={{borderRadius}}
    >
      <div className="intro" />
      <div className="info">
        <div className="rect1 rect" />
        <div className="rect2 rect" />
        <div className="rect3 rect" />
      </div>
    </div>
  )
}
