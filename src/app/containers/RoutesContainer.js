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
import MyCollectionPage from "app/pages/BookmarkToolsPage"
import SearchPage from "app/pages/SearchPage"
import AIToolPage from "app/pages/AIToolPage"
import PromptPage from "app/pages/PromptPage"
import SearchPromptsPage from "app/pages/SearchPromptsPage"
import PromptsCategoryPage from "app/pages/PromptsCategoryPage"
import UpgradePage from "app/pages/UpgradePage"
import AIToolsPage from "app/pages/AIToolsPage"
import ToolsPage from "app/pages/ToolsPage"
import PromptsPage from "app/pages/PromptsPage"
import AppLoadingPage from "app/components/ui/AppLoadingPage"
import BookmarkToolsPage from "app/pages/BookmarkToolsPage"
import BookmarkPromptsPage from "app/pages/BookmarkPromptsPage"
import DashboardPage from "app/pages/DashboardPage"
import NotificationsPage from "app/pages/NotificationsPage"
import GuestSubmissionPage from "app/pages/GuestSubmissionPage"
import ContactPage from "app/pages/ContactPage"
import { infoToast } from "app/data/toastsTemplates"
import VerifyAccountPage from "app/pages/VerifyAccountPage"

export default function RoutesContainer() {

  const { myUser, isUserVerified, setToasts } = useContext(StoreContext)
  const scrollRef = useRef(null)
  const location = useLocation()
  const verifyAccountPage = location.pathname === '/verify-account'

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [location])

  useEffect(() => {
    if(!isUserVerified && myUser && !verifyAccountPage) {
      setToasts(infoToast(`Please verify your account. Check your email for the verification link. `+
      `If you didn't receive an email, you can request a new one in your account page.`, true))
    }
  },[isUserVerified])

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
          <Route path="/upgrade" element={<UpgradePage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/dashboard/*" element={<DashboardPage />} />
          <Route path="submit-tool" element={<GuestSubmissionPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="verify-account" element={<VerifyAccountPage />} />
          {
            myUser ?
              <>
                <Route path="my-account" element={<MyAccountPage />} />
                <Route path="my-bookmarks/tools" element={<BookmarkToolsPage />} />
                <Route path="my-bookmarks/prompts" element={<BookmarkPromptsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
              </> :
              myUser === null ? 
              <Route path="*" element={<AppLoadingPage />} />
              :
              <>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </>
          }
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </div>
  )
}
