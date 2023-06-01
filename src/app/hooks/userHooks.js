import { getDocsCount } from "app/services/CrudDB"
import { doGetUserByID, getNotifsDocsCountByReadStatus, 
  getPromptsBookmarksByUserID, getToolsBookmarksByUserID, 
  getUserByID } from "app/services/userServices"
import { StoreContext } from "app/store/store"
import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from "react-router-dom"

export default function useUser(userID) {

  const [appUser, setAppUser] = useState(null)

  useEffect(() => {
    if (userID) {
      getUserByID(userID, setAppUser)
    }
    else {
      setAppUser(null)
    }
  }, [userID])

  return appUser
}

export function useUsers(userIDs) {

  const [appUsers, setAppUsers] = useState([])

  useEffect(() => {
    if (userIDs?.length) {
      const promises = userIDs.map(userID => doGetUserByID(userID))
      Promise.all(promises)
        .then(users => {
          setAppUsers(users)
        })
    }
    else {
      setAppUsers([])
    }
  }, [userIDs])

  return appUsers
}

export const useDocsCount = (path, updateTrigger) => {

  const [count, setCount] = useState(0)

  useEffect(() => {
    getDocsCount(path)
      .then(count => setCount(count))
  }, [path, updateTrigger])

  return count
}

export const useUserToolsBookmarks = (userID) => {

  const [bookmarks, setBookmarks] = useState([])

  useEffect(() => {
    if (userID) {
      getToolsBookmarksByUserID(userID, setBookmarks)
    }
  }, [userID])

  return bookmarks
}

export const useUserPromptsBookmarks = (userID) => {

  const [bookmarks, setBookmarks] = useState([])

  useEffect(() => {
    if (userID) {
      getPromptsBookmarksByUserID(userID, setBookmarks)
    }
  }, [userID])

  return bookmarks
}

export const useNotifsDocsCountByReadStatus = (status, retrigger) => {

  const { myUserID } = useContext(StoreContext)
  const [count, setCount] = useState(0)
  const location = useLocation()

  useEffect(() => {
    getNotifsDocsCountByReadStatus(myUserID, status)
      .then((count) => {
        setCount(count)
      })
      .catch((err) => console.log(err))
  }, [myUserID, status, location, retrigger])

  return count
}