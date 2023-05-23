import AdminDashboard from "app/components/admin/AdminDashboard"
import React from 'react'
import { Route, Routes } from "react-router-dom"
import NewTool from "./NewTool"
import ToolsLibrary from "./ToolsLibrary"
import NewPrompt from "./NewPrompt"
import PromptsLibrary from "./PromptsLibrary"

export default function AdminRouter() {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="/library" element={<ToolsLibrary />} />
      <Route path="/library/prompts" element={<PromptsLibrary />} />
      <Route path="/add-new/tool" element={<NewTool />} />
      <Route path="/add-new/prompt" element={<NewPrompt />} />
    </Routes> 
    ) 
}
