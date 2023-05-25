import React, { useState } from 'react'
import ProPage from "./ProPage"
import AppTabsBar from "../ui/AppTabsBar"
import { NavLink, Route, Routes, useLocation } from "react-router-dom"
import { useAIToolsSubmissionsByTypeAndStatus } from "app/hooks/aitoolsHooks"
import AIToolCard from "../aitools/AIToolCard"
import './styles/MyAITools.css'

export default function MyAITools() {

  const location = useLocation()

  return (
    <ProPage
      title="My AI Tools"
      className="my-ai-tools"
    >
      <AppTabsBar gap={10} sticky>
        <NavLink
          to=""
          className={location.pathname !== "/dashboard/my-ai-tools" ? "not-active" : ''}
        >
          In Review
        </NavLink>
        <NavLink to="approved">
          Approved
        </NavLink>
        <NavLink to="rejected">
          Rejected
        </NavLink>
      </AppTabsBar>
      <Routes>
        <Route index element={<InReviewAITools />} />
        <Route path="approved" element={<ApprovedAITools />} />
        <Route path="rejected" element={<RejectedAITools />} />
      </Routes>
    </ProPage>
  )
}

export const ApprovedAITools = () => {

  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(true)
  const tools = useAIToolsSubmissionsByTypeAndStatus('ai', "approved", limit, setLoading)

  const toolsList = tools?.map((tool, index) => {
    return <AIToolCard
      key={index}
      tool={tool}
      submission
    />
  })

  return (
    <div className="tools-content">
      <div className="tools-stats">
        <h5>5 Tools</h5>
      </div>
      <div className="tools-grid">
        {toolsList}
      </div>
    </div>
  )
}

export const InReviewAITools = () => {

  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(true)
  const tools = useAIToolsSubmissionsByTypeAndStatus('ai', "in-review", limit, setLoading)

  const toolsList = tools?.map((tool, index) => {
    return <AIToolCard
      key={index}
      tool={tool}
      submission
    />
  })

  return (
    <div className="tools-content">
      <div className="tools-stats">
        <h5>5 Tools</h5>
      </div>
      <div className="tools-grid">
        {toolsList}
      </div>
    </div>
  )
}

export const RejectedAITools = () => {

  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(true)
  const tools = useAIToolsSubmissionsByTypeAndStatus('ai', "rejected", limit, setLoading)

  const toolsList = tools?.map((tool, index) => {
    return <AIToolCard
      key={index}
      tool={tool}
      submission
    />
  })

  return (
    <div className="tools-content">
      <div className="tools-stats">
        <h5>5 Tools</h5>
      </div>
      <div className="tools-grid">
        {toolsList}
      </div>
    </div>
  )
}