import React from 'react'
import { Route, Routes } from "react-router-dom"
import ProDashboard from "./ProDashboard"
import DashboardSidebar from "./DashboardSidebar"
import './styles/DashboardRouter.css'

export default function DashboardRouter() {
  return (
    <div className="dashboard-container">
      <DashboardSidebar />
      <div className="dashboard-content">
        <Routes>
          <Route index element={<ProDashboard />} />
        </Routes>
      </div>
    </div>
  )
}
