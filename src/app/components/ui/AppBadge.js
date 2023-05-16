import React from 'react'
import './styles/AppBadge.css'

export default function AppBadge(props) {

  const { label, icon = '', light = true, fontSize = '12px',
    onClick, color, bgColor, iconSize='11px', className = '' } = props

  return (
    <div
      className={`app-badge ${className} ${light ? 'light' : ''} ${onClick ? 'clickable' : ''}`}
      style={{ color, background: bgColor }}
      onClick={(e) => onClick && onClick(e)}
      key={label}
    >
      {
        icon &&
        <i
          className={icon}
          style={{ color, fontSize: iconSize }}
        />
      }
      <h6 style={{ fontSize, color }}>
        {label}
      </h6>
    </div>
  )
}

export const AppBadgeSelect = (props) => {

  const { label, icon = '', light = true, fontSize = '12px',
    onClick, color, bgColor, iconSize, className = '',
    options, open, onOptionsClick } = props

  const optionItems = options?.map((option, index) => {
    return <div
      className="option-item"
      onClick={(e) => onOptionsClick && onOptionsClick(e, option)}
      key={index}
    >
      <i className={option.icon} />
      <h6>{option.label}</h6>
    </div>
  })

  return (
    <div
      className={`app-badge-select ${open ? 'open' : ''} ${className}`}
      key={label}
    >
      <AppBadge
        label={label}
        icon={icon}
        light={light}
        fontSize={fontSize}
        onClick={(e) => onClick && onClick(e)}
        color={color}
        bgColor={bgColor}
        iconSize={iconSize}
      />
      <div className="dropdown-list">
        {optionItems}
      </div>
    </div>
  )
}