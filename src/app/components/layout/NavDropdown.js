import React from 'react'
import { Link } from "react-router-dom"
import './styles/NavDropdown.css'

export default function NavDropdown(props) {

  const { label, viewAllURL, menuName, showDropdown, 
    setShowDropdown, itemsRender } = props

  return (
    <div 
      className={`nav-dropdown ${showDropdown == menuName ? 'show' : ''}`}
      onClick={(e) => e.stopPropagation()}
      key={menuName}
    >
      <header>
        <h5>{label}</h5>
        <div className="right">
          <small>
            <Link 
              to={viewAllURL}
              onClick={() => setShowDropdown(null)}
              >
              View All
            </Link>
          </small>
        </div>
      </header>
      <section onClick={() => setShowDropdown(null)}>
        {itemsRender} 
      </section>
    </div>
  )
}
