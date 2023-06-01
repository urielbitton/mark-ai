import AdminDashboard from "app/components/admin/AdminDashboard"
import React, { useContext, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom"
import NewTool from "./NewTool"
import ToolsLibrary from "./ToolsLibrary"
import NewPrompt from "./NewPrompt"
import PromptsLibrary from "./PromptsLibrary"
import './styles/AdminRouter.css'
import AppTabsBar from "../ui/AppTabsBar"
import { StoreContext } from "app/store/store"
import { updateEveryToolWithProps } from "app/services/adminServices"
import { errorToast, successToast } from "app/data/toastsTemplates"
import AppButton from "../ui/AppButton"
import Submissions from "./Submissions"

export default function AdminRouter() {

  const { setToasts } = useContext(StoreContext)
  const [loading, setLoading] = useState(false)
  const location = useLocation()

  const handleAddProps = () => {
    const path = 'prompts'
    const confirm = window.confirm(`Are you sure you want to add props to all ${path} docs?`)
    if (!confirm) return
    setLoading(true)
    updateEveryToolWithProps(path, null)
      .then(() => {
        console.log('views initialized')
        setToasts(successToast('Props added to DB docs'))
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        setToasts(errorToast(error.message))
        console.log(error)
      })
  }

  return (
    <div className="admin-router">
      <AppTabsBar
        sticky
        gap={10}
      >
        <NavLink
          to=""
          className={location.pathname === '/admin' ? 'active' : 'not-active'}
        >
          <i className="fas fa-user-shield" />
          Dashboard
        </NavLink>
        <NavLink to="submissions">
          <i className="fas fa-layer-plus" />
          Submissions
        </NavLink>
        <NavLink
          to="library"
          className={location.pathname === '/admin/library' ? 'active' : 'not-active'}
        >
          <i className="fas fa-flask" />
          Tools Library
        </NavLink>
        <NavLink to="library/prompts">
          <i className="fas fa-comment-dots" />
          Prompts Library
        </NavLink>
        <AppButton
          label="Add Props"
          onClick={handleAddProps}
          loading={loading}
          leftIcon="far fa-plus"
        />
      </AppTabsBar>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="library" element={<ToolsLibrary />} />
        <Route path="library/prompts" element={<PromptsLibrary />} />
        <Route path="add-new/tool" element={<NewTool />} />
        <Route path="add-new/prompt" element={<NewPrompt />} />
        <Route path="submissions/*" element={<Submissions />} />
      </Routes>
    </div>
  )
}
