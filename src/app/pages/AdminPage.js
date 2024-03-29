import AdminRouter from "app/components/admin/AdminRouter"
import AppLoadingPage from "app/components/ui/AppLoadingPage"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import { Navigate } from "react-router-dom"

export default function AdminPage() {

  const { myUser } = useContext(StoreContext)
  const isAdmin = myUser?.userType === "admin"

  return isAdmin ? <AdminRouter /> :
    myUser === null ? <AppLoadingPage /> : 
    <Navigate to="/error-404" />
}
