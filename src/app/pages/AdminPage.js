import AdminRouter from "app/components/admin/AdminRouter"
import AppLoadingPage from "app/components/ui/AppLoadingPage"
import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'

export default function AdminPage() {

  const { myUser } = useContext(StoreContext)

  return myUser ? <AdminRouter /> :
    myUser === null ? <AppLoadingPage /> : null
}
