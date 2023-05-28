import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import './styles/MobileSidebar.css'
import { mobileMenuLinks } from "app/data/general"
import { Link } from "react-router-dom"

export default function MobileSidebar() {

  const { showMobileSidebar, setShowMobileSidebar } = useContext(StoreContext)

  const menuRender = mobileMenuLinks?.map((link, index) => {
    return <Link
      key={index}
      to={link.url}
      onClick={() => setShowMobileSidebar(false)}
    >
      {link.label}
    </Link>
  })

  return (
    <div className={`mobile-sidebar ${showMobileSidebar ? 'show' : ''}`}>
      <div className="mobile-menu">
        {menuRender}
      </div>
    </div>
  )
}
