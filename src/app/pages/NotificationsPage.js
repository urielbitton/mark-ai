import NotificationCard from "app/components/notifications/NotificationCard"
import AppButton from "app/components/ui/AppButton"
import { AppReactSelect } from "app/components/ui/AppInputs"
import HelmetTitle from "app/components/ui/HelmetTitle"
import { showXResultsOptions } from "app/data/general"
import { useAllNotifications } from "app/hooks/notificationHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import './styles/NotificationsPage.css'
import { useNotifsDocsCountByReadStatus } from "app/hooks/userHooks"

export default function NotificationsPage() {

  const { myUserID } = useContext(StoreContext)
  const limitsNum = showXResultsOptions[0].value
  const [retrigger, setRetrigger] = useState(0)
  const [notifsLimit, setNotifsLimit] = useState(limitsNum)
  const allNotifications = useAllNotifications(myUserID, notifsLimit)
  const unreadNotifsCount = useNotifsDocsCountByReadStatus(false, retrigger)
  const totalNotifsCount = useNotifsDocsCountByReadStatus(null, retrigger)

  const notificationsList = allNotifications?.map((notif, index) => {
    return <NotificationCard
      key={index}
      notification={notif}
      onReadClick={() => setRetrigger(prev => prev + 1)}
    />
  })

  return (
    <div className="notifications-page">
      <HelmetTitle title="Notifications" />
      <h1>Notifications</h1>
      <div className="toolbar">
        <div className="texts">
          <h6>Showing <span>{allNotifications?.length}</span> notifications</h6>
          <h6>Unread: <span>{unreadNotifsCount}</span></h6>
        </div>
        <AppReactSelect
          label="Show"
          value={notifsLimit}
          onChange={(val) => setNotifsLimit(val.value)}
          options={showXResultsOptions}
          placeholder={
            <div className="input-placeholder">
              <h5 className="cap">{showXResultsOptions.find((cat) => cat.value === notifsLimit)?.label}</h5>
            </div>
          }
        />
      </div>
      <div className="notifications-list">
        {notificationsList}
      </div>
      {
        notifsLimit < totalNotifsCount &&
        <AppButton
          label="Load More"
          onClick={() => setNotifsLimit(notifsLimit + limitsNum)}
          className="load-more-btn"
        />
      }
    </div>
  )
}
