import { useAllNotifications, useUnreadNotifications } from "app/hooks/notificationHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import IconContainer from "../ui/IconContainer"
import NavDropdown from "./NavDropdown"
import NavSearch from "./NavSearch"
import NotificationElement from "./NotificationElement"
import MenuDropdown from "./MenuDropdown"
import './styles/Navbar.css'
import navLogo from 'app/assets/images/nav-logo.png'
import { Link, useNavigate } from "react-router-dom"
import AppButton from "../ui/AppButton"

export default function Navbar() {

  const { myUserID, setShowMobileSidebar, isAdmin } = useContext(StoreContext)
  const [showMenu, setShowMenu] = useState(null)
  const unreadNotifications = useUnreadNotifications(myUserID, 50)
  const notifications = useAllNotifications(myUserID, 5)
  const navigate = useNavigate()

  const notificationsList = notifications?.map((notif, index) => {
    return <NotificationElement
      key={index}
      notif={notif}
    />
  })

  useEffect(() => {
    if (showMenu !== null) {
      window.onclick = () => setShowMenu(null)
    }
    return () => window.onclick = null
  }, [showMenu])

  return (
    <nav className="navbar">
      <div className="topbar site-grid">
        <div className="left">
          <Link
            to="/"
            className="logo"
          >
            <img src={navLogo} alt="Mark Logo" />
            <h4>Mark<span>AI</span></h4>
          </Link>
          <NavSearch />
          <div
            className="mobile-btn"
            onClick={() => setShowMobileSidebar(true)}
          >
            <i className="fal fa-bars" />
          </div>
        </div>
        <div className="right">
          <IconContainer
            icon="fas fa-home-alt"
            inverted
            iconColor="#fff"
            iconSize="16px"
            dimensions="30px"
            tooltip="Home"
            onClick={(e) => {
              e.stopPropagation()
              navigate('/')
            }}
          />
          {
            isAdmin &&
            <IconContainer
              icon="fas fa-plus"
              inverted
              iconColor="#fff"
              iconSize="16px"
              dimensions="30px"
              tooltip="Add new"
              onClick={(e) => {
                e.stopPropagation()
                navigate('/admin/add-new-tool')
              }}
            />
          }
          <IconContainer
            icon="fas fa-bookmark"
            inverted
            iconColor="#fff"
            iconSize="16px"
            dimensions="30px"
            tooltip="Collection"
            onClick={(e) => {
              e.stopPropagation()
              navigate('/my-collection')
            }}
          />
          <IconContainer
            icon="fas fa-bell"
            inverted
            iconColor="#fff"
            iconSize="16px"
            dimensions="30px"
            tooltip="Notifications"
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(showMenu === 'notifications' ? null : 'notifications')
            }}
            badgeValue={unreadNotifications.length}
            badgeBgColor="#fff"
            badgeTextColor="var(--darkGrayText)"
          />
          <NavDropdown
            label="Notifications"
            viewAllURL="/notifications"
            menuName="notifications"
            showDropdown={showMenu}
            setShowDropdown={setShowMenu}
            itemsRender={notificationsList}
          />
          <MenuDropdown
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            avatarDimensions="27px"
          />
          {
            !myUserID &&
            <AppButton
              label="Login"
              buttonType="whiteBtn"
              leftIcon="far fa-sign-in"
              url="/login"
            />
          }
        </div>
      </div>
      <div className="shapes-container">
        <div className="shape shape1" />
        <div className="shape shape2" />
        <div className="shape shape3" />
        <div className="shape shape4" />
      </div>
    </nav>
  )
}
