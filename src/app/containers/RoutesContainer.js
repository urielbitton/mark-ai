import React, { useContext, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import './styles/RoutesContainer.css'
import ErrorPage from "app/pages/ErrorPage"
import HomePage from 'app/pages/HomePage'
import { Routes, Route } from "react-router"
import LoginPage from "app/pages/LoginPage"
import RegisterPage from "app/pages/RegisterPage"
import { StoreContext } from "app/store/store"
import MyAccountPage from "app/pages/MyAccountPage"
import AdminPage from "app/pages/AdminPage"
import MyCollectionPage from "app/pages/MyBookmarksPage"
import SearchPage from "app/pages/SearchPage"
import AIToolPage from "app/pages/AIToolPage"
import PromptPage from "app/pages/PromptPage"
import SearchPromptsPage from "app/pages/SearchPromptsPage"
import PromptsCategoryPage from "app/pages/PromptsCategoryPage"
import UpgradePage from "app/pages/UpgradePage"
import AIToolsPage from "app/pages/AIToolsPage"
import ToolsPage from "app/pages/ToolsPage"
import PromptsPage from "app/pages/PromptsPage"

export default function RoutesContainer() {

  const { user } = useContext(StoreContext)
  const scrollRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [location])

  return (
    <div
      className="routes-container"
      ref={scrollRef}
    >
      <div className="site-grid">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/ai-tools" element={<AIToolsPage />} />
          <Route path="/online-tools" element={<ToolsPage />} />
          <Route path="/prompts" element={<PromptsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search/prompts" element={<SearchPromptsPage />} />
          <Route path="/ai-tools/:toolID" element={<AIToolPage />} />
          <Route path="/prompts/categories/:category" element={<PromptsCategoryPage />} />
          <Route path="/prompts/:promptID" element={<PromptPage />} />
          {
            user ?
              <>
                <Route path="my-account" element={<MyAccountPage />} />
                <Route path="my-bookmarks" element={<MyCollectionPage />} />
                <Route path="my-account/upgrade" element={<UpgradePage />} />
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
