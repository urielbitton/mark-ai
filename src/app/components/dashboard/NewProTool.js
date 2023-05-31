import React, { useContext, useState } from 'react'
import ProPage from "./ProPage"
import { Link, useLocation, useNavigate } from "react-router-dom"
import './styles/NewProTool.css'
import GuideSection from "./GuideSection"
import NewTool from "../admin/NewTool"
import { StoreContext } from "app/store/store"
import {
  submitNewToolRequestService, updateApprovedToolService,
  updateNonApprovedToolService
} from "app/services/aitoolsServices"
import { createNotification } from "app/services/notifServices"

export default function NewProTool() {

  const { myUserID, setToasts } = useContext(StoreContext)
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const isAI = location.pathname.includes("ai")
  const navigate = useNavigate()
  const toolsLink = `/dashboard/${isAI ? "my-ai-tools" : "my-online-tools"}`

  const updateCreateNotification = () => {
    navigate(toolsLink)
    return createNotification(
      myUserID,
      `Tool submission updated`,
      `We have received your tool submission update and will review it shortly. You will then be notified if it is approved or rejected.`,
      'fas fa-layer-plus',
      toolsLink,
    )
  }

  const handleProSubmit = (tool) => {
    submitNewToolRequestService(
      tool,
      myUserID,
      setLoading,
      setToasts,
    )
      .then(() => {
        navigate(toolsLink)
        return createNotification(
          myUserID,
          `New ${isAI ? "AI" : "Online"} tool submitted for review`,
          `We have received your ${isAI ? "AI" : "Online"} tool submission and will review it shortly. You will then be notified if it is approved or rejected.`,
          'fas fa-layer-plus',
          toolsLink,
        )
      })
  }

  const handleProUpdate = (tool) => {
    if (tool.status !== "approved") {
      return updateNonApprovedToolService(
        tool,
        tool.toolID,
        {
          mainImg: tool.mainImg,
          logo: tool.logo,
          images: tool.images,
        },
        setLoading,
        setToasts
      )
        .then(() => updateCreateNotification())
    }
    return updateApprovedToolService(
      tool,
      tool.toolID,
      {
        mainImg: tool.mainImg,
        logo: tool.logo,
        images: tool.images,
      },
      setLoading,
      setToasts
    )
      .then(() => updateCreateNotification())
  }

  return (
    <ProPage
      title={`New ${isAI ? "AI" : "Online"} Tool Submission`}
      className="new-pro-tool"
    >
      <GuideSection title={`How to Submit an ${isAI ? "AI" : "Online"} Tool`}>
        <p>
          To submit a new {isAI ? "AI" : "Online"} tool, please fill out the form below.
          Please note that all submissions are reviewed by our team before being published.
          If you have any questions, please use the <Link to="/contact">contact us</Link> page.
          A guideline for what an {isAI ? "AI" : "Online"} tool submission should look like
          can be found on the <Link to={`submission-guide?type=${isAI ? 'ai' : 'online'}`}>Submission Guide</Link> page.
        </p>
      </GuideSection>
      <NewTool
        proUser
        handleProSubmit={handleProSubmit}
        handleProUpdate={handleProUpdate}
        proLoading={loading}
      />
    </ProPage>
  )
}
