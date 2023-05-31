import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import './styles/MobileSidebar.css'
import { mobileMenuLinks } from "app/data/general"
import { Link, useNavigate } from "react-router-dom"
import NavSearch from "./NavSearch"
import IconContainer from "../ui/IconContainer"

export default function MobileSidebar({userNavIcons}) {

  const { showMobileSidebar, isAdmin,
    isPro } = useContext(StoreContext)
  const navigate = useNavigate()

  const menuRender = mobileMenuLinks?.map((link, index) => {
    return <Link
      key={index}
      to={link.url}
    >
      {link.label}
    </Link>
  })

  return (
    <div className={`mobile-sidebar ${showMobileSidebar ? 'show' : ''}`}>
      <NavSearch />
      <div className="mobile-menu">
        {menuRender}
      </div>
      <div className="mobile-tools">
        {
          isPro && !isAdmin &&
          <IconContainer
            icon="fas fa-tachometer"
            inverted
            iconColor="#fff"
            iconSize={19}
            dimensions="30px"
            tooltip="Pro Dashboard"
            onClick={(e) => navigate('/dashboard/')}
          />
        }
        { userNavIcons }
      </div>
    </div>
  )
}
