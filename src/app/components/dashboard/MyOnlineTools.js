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
import { toolsSubmissionModes } from "app/data/toolsData"
import ViewToggler from "../ui/ViewToggler"

export default function MyOnlineTools() {

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
      title="My Online Tools"
      className="my-ai-tools"
    >
      <AppTabsBar gap={10} sticky>
        <NavLink
          to=""
          className={location.pathname !== "/dashboard/my-online-tools" ? "not-active" : ''}
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
          <InReviewOnlineTools
            limit={limit}
            viewMode={viewMode}
            limitSelect={limitSelect}
            viewToggle={viewToggle}
          />}
        />
        <Route path="approved" element={
          <ApprovedOnlineTools
            limit={limit}
            viewMode={viewMode}
            limitSelect={limitSelect}
            viewToggle={viewToggle}
          />}
        />
        <Route path="rejected" element={
          <RejectedOnlineTools
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

export const ApprovedOnlineTools = ({ limit, viewMode, limitSelect, viewToggle }) => {

  const [loading, setLoading] = useState(true)
  const tools = useAIToolsSubmissionsByTypeAndStatus('tool', "approved", limit, setLoading)
  const toolsCount = useUserToolsSubmissionsDocsCountByStatusAndType('toolsSubmissions', 'tool', 'approved')

  const toolsList = tools?.map((tool, index) => {
    return <AIToolCard
      key={index}
      tool={tool}
      submission
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

export const InReviewOnlineTools = ({ limit, viewMode, limitSelect, viewToggle }) => {

  const [loading, setLoading] = useState(true)
  const tools = useAIToolsSubmissionsByTypeAndStatus('tool', "in-review", limit, setLoading)
  const toolsCount = useUserToolsSubmissionsDocsCountByStatusAndType('toolsSubmissions', 'tool', 'in-review')

  const toolsList = tools?.map((tool, index) => {
    return <AIToolCard
      key={index}
      tool={tool}
      submission
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

export const RejectedOnlineTools = ({ limit, viewMode, limitSelect, viewToggle }) => {

  const [loading, setLoading] = useState(true)
  const tools = useAIToolsSubmissionsByTypeAndStatus('tool', "rejected", limit, setLoading)
  const toolsCount = useUserToolsSubmissionsDocsCountByStatusAndType('toolsSubmissions', 'tool', 'rejected')

  const toolsList = tools?.map((tool, index) => {
    return <AIToolCard
      key={index}
      tool={tool}
      submission
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