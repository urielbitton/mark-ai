import DashboardRouter from "app/components/dashboard/DashboardRouter"
import AppLoadingPage from "app/components/ui/AppLoadingPage"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import { Navigate } from "react-router-dom"

export default function DashboardPage() {

  const { myUser, isPro } = useContext(StoreContext)

  return (
    isPro ? <DashboardRouter /> :
    myUser === null ? <AppLoadingPage /> : 
    <Navigate to="/error-404" />
  )
}
