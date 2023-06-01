import React from 'react'
import './styles/Submissions.css'
import AppTabsBar from "../ui/AppTabsBar"
import { NavLink, Route, Routes, useLocation } from "react-router-dom"
import ToolsSubmissions from "./ToolsSubmissions"
import PromptSubmissions from "./PromptSubmissions"
import GuestSubmissions from "./GuestSubmissions"

export default function Submissions() {

  const location = useLocation()

  return (
    <div className="submissions-page">
      <AppTabsBar
        sticky
        gap={10}
      >
        <NavLink
          to=""
          className={location.pathname === '/admin/submissions' ? 'active' : 'not-active'}
        >
          <i className="fas fa-layer-plus" />
          Tools Submissions
        </NavLink>
        <NavLink to="prompt-submissions">
          <i className="fas fa-layer-plus" />
          Prompt Submissions
        </NavLink>
        <NavLink to="guest-submissions">
          <i className="fas fa-layer-plus" />
          Guest Submissions
        </NavLink>
      </AppTabsBar>
      <div className="submissions-content">
        <Routes>
          <Route index element={<ToolsSubmissions />} />
          <Route path="prompt-submissions" element={<PromptSubmissions />} />
          <Route path="guest-submissions" element={<GuestSubmissions />} />
        </Routes>
      </div>
    </div>
  )
}
