import React, { useContext } from 'react'
import { Link } from "react-router-dom"
import './styles/NotificationsDropdown.css'
import { markAllNotifsAsReadService } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import { successToast } from "app/data/toastsTemplates"

export default function NotificationsDropdown(props) {

  const { myUserID, setToasts } = useContext(StoreContext)
  const { label, viewAllURL, menuName, showDropdown, 
    setShowDropdown, itemsRender } = props

  const markAllRead = () => {
    markAllNotifsAsReadService(myUserID)
    .then(() => {
      setToasts(successToast('All notifications marked as read'))
    })
  } 

  return (
    <div 
      className={`notifications-dropdown nav-drop ${showDropdown == menuName ? 'show' : ''}`}
      onClick={(e) => e.stopPropagation()}
      key={menuName}
    >
      <header>
        <h5>{label}</h5>
        <div className="right">
          <small onClick={() => markAllRead()}>Read All</small>
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
