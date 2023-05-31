import React, { useState } from 'react'
import ProPage from "./ProPage"
import AppTabsBar from "../ui/AppTabsBar"
import { NavLink, Route, Routes, useLocation } from "react-router-dom"
import {
  useAIToolsSubmissionsByTypeAndStatus,
  useUserToolsSubmissionsDocsCountByStatusAndType
} from "app/hooks/aitoolsHooks"
import AIToolCard from "../aitools/AIToolCard"
import './styles/MyAITools.css'
import AILoader from "../ui/AILoader"
import { AppReactSelect } from "../ui/AppInputs"
import { showXResultsOptions } from "app/data/general"
import ViewToggler from "../ui/ViewToggler"
import { toolsSubmissionModes } from "app/data/toolsData"

export default function MyAITools() {

  const location = useLocation()
  const [limit, setLimit] = useState(showXResultsOptions[0].value)
  const [viewMode, setViewMode] = useState('large')

  const limitSelect = (
    <AppReactSelect
      label="Show"
      value={limit}
      onChange={(val) => setLimit(val.value)}
      options={showXResultsOptions}
      placeholder={
        <div className="input-placeholder">
          <h5 className="cap">{showXResultsOptions.find(opt => opt.value === limit).label}</h5>
        </div>
      }
    />
  )

  const viewToggle = (
    <ViewToggler
      label="View"
      viewMode={viewMode}
      modes={toolsSubmissionModes}
      onClick={(mode) => setViewMode(mode.value)}
      themeColor
    />
  )

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
        <Route index element={
          <InReviewAITools
            limit={limit}
            viewMode={viewMode}
            limitSelect={limitSelect}
            viewToggle={viewToggle}
          />}
        />
        <Route path="approved" element={
          <ApprovedAITools
            limit={limit}
            viewMode={viewMode}
            limitSelect={limitSelect}
            viewToggle={viewToggle}
          />}
        />
        <Route path="rejected" element={
          <RejectedAITools
            limit={limit}
            viewMode={viewMode}
            limitSelect={limitSelect}
            viewToggle={viewToggle}
          />}
        />
      </Routes>
    </ProPage>
  )
}

export const ApprovedAITools = ({ limit, viewMode, limitSelect, viewToggle }) => {

  const [loading, setLoading] = useState(true)
  const tools = useAIToolsSubmissionsByTypeAndStatus('ai', "approved", limit, setLoading)
  const toolsCount = useUserToolsSubmissionsDocsCountByStatusAndType('toolsSubmissions', 'ai', 'approved')

  const toolsList = tools?.map((tool, index) => {
    return <AIToolCard
      key={index}
      tool={tool}
      submissionStatus="Approved"
      compact={viewMode === 'compact'}
    />
  })

  return (
    <div className="tools-content">
      <div className="tools-stats">
        <h5>{toolsCount} Tool{toolsCount !== 1 ? 's' : ''}</h5>
        <div className="right-side">
          {limitSelect}
          {viewToggle}
        </div>
      </div>
      <div className="tools-grid">
        {
          !loading ?
            toolsList :
            <AILoader />
        }
      </div>
    </div>
  )
}

export const InReviewAITools = ({ limit, viewMode, limitSelect, viewToggle }) => {

  const [loading, setLoading] = useState(true)
  const tools = useAIToolsSubmissionsByTypeAndStatus('ai', "in-review", limit, setLoading)
  const toolsCount = useUserToolsSubmissionsDocsCountByStatusAndType('toolsSubmissions', 'ai', 'in-review')

  const toolsList = tools?.map((tool, index) => {
    return <AIToolCard
      key={index}
      tool={tool}
      submissionStatus="In Review"
      compact={viewMode === 'compact'}
    />
  })

  return (
    <div className="tools-content">
      <div className="tools-stats">
        <h5>{toolsCount} Tool{toolsCount !== 1 ? 's' : ''}</h5>
        <div className="right-side">
          {limitSelect}
          {viewToggle}
        </div>
      </div>
      <div className="tools-grid">
        {
          !loading ?
            toolsList :
            <AILoader />
        }
      </div>
    </div>
  )
}

export const RejectedAITools = ({ limit, viewMode, limitSelect, viewToggle }) => {

  const [loading, setLoading] = useState(true)
  const tools = useAIToolsSubmissionsByTypeAndStatus('ai', "rejected", limit, setLoading)
  const toolsCount = useUserToolsSubmissionsDocsCountByStatusAndType('toolsSubmissions', 'ai', 'rejected')

  const toolsList = tools?.map((tool, index) => {
    return <AIToolCard
      key={index}
      tool={tool}
      submissionStatus="Rejected"
      compact={viewMode === 'compact'}
    />
  })

  return (
    <div className="tools-content">
      <div className="tools-stats">
        <h5>{toolsCount} Tool{toolsCount !== 1 ? 's' : ''}</h5>
        <div className="right-side">
          {limitSelect}
          {viewToggle}
        </div>
      </div>
      <div className="tools-grid">
        {
          !loading ?
            toolsList :
            <AILoader />
        }
      </div>
    </div>
  )
}