import React from 'react'
import './styles/ProPage.css'

export default function ProPage({title, rightComponent=null, children, className=''}) {
  return (
    <div className={`pro-page ${className}`}>
      <div className="titles">
        <h2>{title}</h2>
        {rightComponent}
      </div>
      <div className="pro-page-content">
        {children}
      </div>
    </div>
  )
}
