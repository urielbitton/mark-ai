import React, { useContext } from 'react'
import './styles/RoutesContainer.css'
import ErrorPage from "app/pages/ErrorPage"
import HomePage from 'app/pages/HomePage'
import { Routes, Route } from "react-router"
import LoginPage from "app/pages/LoginPage"
import RegisterPage from "app/pages/RegisterPage"
import { StoreContext } from "app/store/store"
import MyAccountPage from "app/pages/MyAccountPage"
import AdminPage from "app/pages/AdminPage"

export default function RoutesContainer() {

  const { user } = useContext(StoreContext)

  return (
    <div className={`routes-container`}>
      <div className="site-grid">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="my-account" element={<MyAccountPage />} />
          {
            !user &&
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </>
          }
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </div>
  )
}
