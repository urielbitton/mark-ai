import React from 'react'
import './styles/RoutesContainer.css'
import ErrorPage from "app/pages/ErrorPage"
import HomePage from 'app/pages/HomePage'
import { Routes, Route } from "react-router"
import SettingsPage from "app/pages/SettingsPage"
import MyProfilePage from "app/pages/MyProfilePage"

export default function RoutesContainer() {

  return (
    <div className={`routes-container`}>
      <div className="site-grid">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="my-profile" element={<MyProfilePage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </div>
  )
}
