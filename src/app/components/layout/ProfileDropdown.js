import { signOut } from "app/services/CrudDB"
import React, { } from 'react'
import { Link } from "react-router-dom"
import IconContainer from "../ui/IconContainer"

export default function ProfileDropdown(props) {

  const { showMenu, setShowMenu } = props

  return (
    <div className="profile-container">
      <div
        className="clickable-profile"
        onClick={(e) => {
          e.stopPropagation()
          setShowMenu(prev => prev === 'profile' ? null : 'profile')
        }}
      >
        <IconContainer
          icon="fas fa-th"
          dimensions={28}
          iconSize={15}
          bgColor="#fff"
          iconColor="var(--primary)"
        />
        <i className="fal fa-angle-down" />
      </div>
      <div className={`profile-dropdown ${showMenu === 'profile' ? 'show' : ''}`}>
        <Link to="/my-account">
          <i className="fas fa-user-circle" />
          <span>My Account</span>
        </Link>
        <Link to="help-and-support">
          <i className="fas fa-question-circle" />
          <span>Help & Support</span>
        </Link>
        <Link to="/settings">
          <i className="fas fa-cog" />
          <span>Settings</span>
        </Link>
        <h6 onClick={() => signOut()}>
          <i className="fas fa-sign-out" />
          <span>Sign Out</span>
        </h6>
      </div>
    </div>
  )
}
