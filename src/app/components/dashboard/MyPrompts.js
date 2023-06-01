import React, { useState } from 'react'
import ProPage from "./ProPage"
import AppTabsBar from "../ui/AppTabsBar"
import { NavLink, Route, Routes, useLocation } from "react-router-dom"
import {
  useUserPromptsSubmissionsByStatus,
  useUserPromptsSubmissionsDocsCountByStatus,
} from "app/hooks/aitoolsHooks"
import './styles/MyAITools.css'
import AILoader from "../ui/AILoader"
import { AppReactSelect } from "../ui/AppInputs"
import { showXResultsOptions } from "app/data/general"
import ViewToggler from "../ui/ViewToggler"
import { toolsSubmissionModes } from "app/data/toolsData"
import PromptCard from "../aitools/PromptCard"

export default function MyPrompts() {

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
      title="My Prompts"
      className="my-prompts my-ai-tools"
    >
      <AppTabsBar gap={10} sticky>
        <NavLink
          to=""
          className={location.pathname !== "/dashboard/my-prompts" ? "not-active" : ''}
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
          <InReviewPrompts
            limit={limit}
            viewMode={viewMode}
            limitSelect={limitSelect}
            viewToggle={viewToggle}
          />}
        />
        <Route path="approved" element={
          <ApprovedPrompts
            limit={limit}
            viewMode={viewMode}
            limitSelect={limitSelect}
            viewToggle={viewToggle}
          />}
        />
        <Route path="rejected" element={
          <RejectedPrompts
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

export const ApprovedPrompts = ({ limit, viewMode, limitSelect, viewToggle }) => {

  const [loading, setLoading] = useState(true)
  const prompts = useUserPromptsSubmissionsByStatus("approved", limit, setLoading)
  const promptsCount = useUserPromptsSubmissionsDocsCountByStatus('promptsSubmissions', 'approved')

  const promptsList = prompts?.map((prompt, index) => {
    return <PromptCard
      key={index}
      prompt={prompt}
      submission
      submissionStatus="Approved"
      compact={viewMode === 'compact'}
      isPreview
    />
  })

  return (
    <div className="tools-content">
      <div className="tools-stats">
        <h5>{promptsCount} Prompt{promptsCount !== 1 ? 's' : ''}</h5>
        <div className="right-side">
          {limitSelect}
          {viewToggle}
        </div>
      </div>
      <div className="tools-grid">
        {
          !loading ?
            promptsList :
            <AILoader />
        }
      </div>
    </div>
  )
}

export const InReviewPrompts = ({ limit, viewMode, limitSelect, viewToggle }) => {

  const [loading, setLoading] = useState(true)
  const prompts = useUserPromptsSubmissionsByStatus("in-review", limit, setLoading)
  const promptsCount = useUserPromptsSubmissionsDocsCountByStatus('promptsSubmissions', 'in-review')

  const promptsList = prompts?.map((prompt, index) => {
    return <PromptCard
      key={index}
      prompt={prompt}
      submission
      submissionStatus="In Review"
      compact={viewMode === 'compact'}
      isPreview
    />
  })

  return (
    <div className="tools-content">
      <div className="tools-stats">
        <h5>{promptsCount} Prompt{promptsCount !== 1 ? 's' : ''}</h5>
        <div className="right-side">
          {limitSelect}
          {viewToggle}
        </div>
      </div>
      <div className="tools-grid">
        {
          !loading ?
            promptsList :
            <AILoader />
        }
      </div>
    </div>
  )
}

export const RejectedPrompts = ({ limit, viewMode, limitSelect, viewToggle }) => {

  const [loading, setLoading] = useState(true)
  const prompts = useUserPromptsSubmissionsByStatus("rejected", limit, setLoading)
  const promptsCount = useUserPromptsSubmissionsDocsCountByStatus('promptsSubmissions', 'rejected')

  const promptsList = prompts?.map((prompt, index) => {
    return <PromptCard
      key={index}
      prompt={prompt}
      submission
      submissionStatus="Rejected"
      compact={viewMode === 'compact'}
      isPreview
    />
  })

  return (
    <div className="tools-content">
      <div className="tools-stats">
        <h5>{promptsCount} Prompt{promptsCount !== 1 ? 's' : ''}</h5>
        <div className="right-side">
          {limitSelect}
          {viewToggle}
        </div>
      </div>
      <div className="tools-grid">
        {
          !loading ?
            promptsList :
            <AILoader />
        }
      </div>
    </div>
  )
}