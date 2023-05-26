import { signOut } from "app/services/CrudDB"
import React, { useContext } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { StoreContext } from "app/store/store"
import Avatar from "../ui/Avatar"
import IconContainer from "../ui/IconContainer"

export default function ProfileDropdown(props) {

  const { isAdmin, myUser, myUserImg, myUserName, 
    myUserType, isPro } = useContext(StoreContext)
  const { showMenu, setShowMenu } = props
  const navigate = useNavigate()

  return (
    <div className="profile-container">
      <div
        className="clickable-profile"
        onClick={(e) => {
          e.stopPropagation()
          setShowMenu(prev => prev === 'profile' ? null : 'profile')
        }}
      >
        {
          myUser ?
            <Avatar
              src={myUserImg}
              dimensions={28}
              alt="me"
              border="1px solid #fff"
            /> :
            <IconContainer
              icon="fas fa-th"
              dimensions={28}
              iconSize={14}
              iconColor="var(--primary)"
              bgColor="#fff"
            />
        }
        <i className="fal fa-angle-down" />
      </div>
      <div className={`menu-dropdown ${showMenu === 'profile' ? 'show' : ''}`}>
        <div className="top">
          <div className="column">
            <h5>Tools & Resources</h5>
            <Link to="/ai-tools">
              <i className="fas fa-robot" />
              <span>AI Tools</span>
            </Link>
            <Link to="/tools">
              <i className="fas fa-flask" />
              <span>Online Tools</span>
            </Link>
            <Link to="/prompts">
              <i className="fas fa-comment-dots" />
              <span>Chat Prompts</span>
            </Link>
          </div>
          <div className="column">
            <h5>Support</h5>
            <Link to="contact-us">
              <i className="fas fa-envelope" />
              <span>Contact Us</span>
            </Link>
            <Link to="privacy-policy">
              <i className="fas fa-exclamation-circle" />
              <span>Privacy Policy</span>
            </Link>
            <Link to="disclaimer">
              <i className="fas fa-exclamation-circle" />
              <span>Disclaimer</span>
            </Link>
            <Link to="terms-of-service">
              <i className="fas fa-file-alt" />
              <span>Terms of Service</span>
            </Link>
          </div>
          <div className="column">
            <h5>Account</h5>
            {
              isPro && !isAdmin &&
              <Link to="/dashboard/">
                <i className="fas fa-tachometer" />
                <span>Pro Dashboard</span>
              </Link>
            }
            {
              isAdmin &&
              <Link to="/admin">
                <i className="fas fa-user-shield" />
                <span>Admin</span>
              </Link>
            }
            {
              !isPro &&
              <Link to="/upgrade">
                <i className="fas fa-rocket" />
                <span>Upgrade To Pro</span>
              </Link>
            }
            {
              myUser ?
                <>
                  <Link to="/my-account">
                    <i className="fas fa-user-circle" />
                    <span>My Account</span>
                  </Link>
                  <h6 onClick={() => signOut(navigate)}>
                    <i className="fas fa-sign-out" />
                    <span>Sign Out</span>
                  </h6>
                </> :
                <>
                  <Link to="/login">
                    <i className="fas fa-sign-in" />
                    <span>Sign In</span>
                  </Link>
                  <Link to="/register">
                    <i className="fas fa-user-plus" />
                    <span>Register</span>
                  </Link>
                </>
            }
          </div>
        </div>
        {
          myUser &&
          <div className="bottom">
            <div className="profile">
              <Avatar
                src={myUserImg}
                dimensions={27}
                border="1px solid var(--primary)"
              />
              <h5>{myUserName}</h5>
            </div>
            <h5>
              <span onClick={() => navigate('/my-account')}>
                {!isPro ? <i className="fas fa-flask" /> : <i className="fas fa-rocket" />}
                {myUserType} Account
              </span>
            </h5>
          </div>
        }
      </div>
    </div>
  )
}
