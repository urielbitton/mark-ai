import React, { useEffect } from 'react'
import { Link } from "react-router-dom"
import IconContainer from "./IconContainer"
import './styles/DropdownButton.css'

export default function DropdownIcon(props) {

  const { items, showMenu, setShowMenu, icon="far fa-ellipsis-v", 
    iconColor, iconSize="19px", dimensions=32, tooltip, bgColor, 
    dropdownPosition="place-right-bottom", onClick, round } = props

  const itemsList = items
    ?.filter(item => item && !item.private)
    .map((item, index) => {
      return (
        !item.url ?
          <div
            key={index}
            onClick={() => item.onClick()}
            className="dropdown-item"
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </div> :
          <Link
            key={index}
            to={item.url}
            className="dropdown-item"
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </Link>
      )
    })

  useEffect(() => {
    if (showMenu !== null) {
      window.onclick = () => setShowMenu(null)
    }
    return () => window.onclick = null
  }, [showMenu])

  return (
    <div
      className="dropdown-button dropdown-icon"
      onClick={(e) => {
        e.stopPropagation()
        onClick(e)
      }}
    >
      <IconContainer
        icon={icon}
        iconColor={iconColor}
        iconSize={iconSize}
        bgColor={bgColor}
        dimensions={dimensions}
        tooltip={tooltip}
        round={round}
      />
      <div className={`dropdown-menu ${showMenu ? 'show' : ''} ${dropdownPosition}`}>
        {itemsList}
      </div>
    </div>
  )
}
