import React from 'react'
import { Route, Routes } from "react-router-dom"
import ProDashboard from "./ProDashboard"
import DashboardSidebar from "./DashboardSidebar"
import './styles/DashboardRouter.css'
import MyAITools from "./MyAITools"
import MyOnlineTools from "./MyOnlineTools"
import MyPrompts from "./MyPrompts"
import NewProTool from "./NewProTool"
import NewProPrompt from "./NewProPrompt"
import ProSettings from "./ProSettings"
import SubmissionGuide from "./SubmissionGuide"
import ToolPreview from "./ToolPreview"

export default function DashboardRouter() {
  return (
    <div className="dashboard-container">
      <DashboardSidebar />
      <div className="dashboard-content">
        <Routes>
          <Route index element={<ProDashboard />} />
          <Route path="my-ai-tools/*" element={<MyAITools />} />
          <Route path="my-online-tools/*" element={<MyOnlineTools />} />
          <Route path="my-prompts/*" element={<MyPrompts />} />
          <Route path="new-ai-tool" element={<NewProTool />} />
          <Route path="new-online-tool" element={<NewProTool />} />
          <Route path="new-prompt" element={<NewProPrompt />} />
          <Route path="settings" element={<ProSettings />} />
          <Route path="submission-guide" element={<SubmissionGuide />} />
          <Route path="tool-preview/:toolID" element={<ToolPreview />} />
        </Routes>
      </div>
    </div>
  )
}
