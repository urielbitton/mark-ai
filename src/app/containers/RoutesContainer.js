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
import MyCollectionPage from "app/pages/MyCollectionPage"
import SearchPage from "app/pages/SearchPage"
import AIToolPage from "app/pages/AIToolPage"

export default function RoutesContainer() {

  const { user } = useContext(StoreContext)

  return (
    <div className={`routes-container`}>
      <div className="site-grid">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/ai-tools/:toolID" element={<AIToolPage />} />
          {
            user ?
              <>
                <Route path="my-account" element={<MyAccountPage />} />
                <Route path="my-collection" element={<MyCollectionPage />} />
              </> :
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
