import { updateDB } from "app/services/CrudDB"
import { StoreContext } from "app/store/store"
import { convertClassicDate, convertClassicTime, getTimeAgo } from "app/utils/dateUtils"
import { truncateText } from "app/utils/generalUtils"
import React, { useContext, useState } from 'react'
import { Link } from "react-router-dom"
import './styles/NotificationCard.css'

export default function NotificationCard(props) {

  const { myUserID } = useContext(StoreContext)
  const { dateCreated, icon, isRead, notificationID, text,
    title, url } = props.notification
  const { onReadClick } = props
  const [expandID, setExpandID] = useState(null)
  const isExpanded = expandID === notificationID

  const toggleRead = (e) => {
    onReadClick()
    updateDB(`users/${myUserID}/notifications`, notificationID, {
      isRead: !isRead
    })
  }

  return (
    <div 
      className="notification-card"
      onClick={() => setExpandID(expandID === notificationID ? null : notificationID)}
    >
      <div className="left">
        <i className={icon} />
        <div className="texts">
          <h5>{title}</h5>
          <p>
            {truncateText(text, !isExpanded ? 125 : Infinity)}&nbsp;
            {
              !isExpanded && text.length > 150 &&
              <small>Read more</small>
            }
          </p>
          <h6>
            {getTimeAgo(dateCreated?.toDate())}
          </h6>
        </div>
      </div>
      <div className="right">
        <Link 
          to={url}
          onClick={() => toggleRead()}
        >
          <i className="fas fa-arrow-right" />
        </Link>  
        <i
          className={`fas fa-circle ${!isRead ? 'unread' : ''}`}
          onClick={e => toggleRead(e)}
        />
      </div>
    </div>
  )
}
