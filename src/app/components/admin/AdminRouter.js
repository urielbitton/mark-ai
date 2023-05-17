import AdminDashboard from "app/components/admin/AdminDashboard"
import React from 'react'
import { Route, Routes } from "react-router-dom"
import NewTool from "./NewTool"
import ToolsLibrary from "./ToolsLibrary"

export default function AdminRouter() {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="/library" element={<ToolsLibrary />} />
      <Route path="/add-new-tool" element={<NewTool />} />
    </Routes> 
    ) 
}
