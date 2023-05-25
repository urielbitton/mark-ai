import React, { useContext, useState } from 'react'
import ProPage from "./ProPage"
import { Link, useLocation, useNavigate } from "react-router-dom"
import './styles/NewProTool.css'
import GuideSection from "./GuideSection"
import NewTool from "../admin/NewTool"
import { StoreContext } from "app/store/store"
import { submitNewToolRequestService } from "app/services/aitoolsServices"
import { createNotification } from "app/services/notifServices"

export default function NewProTool() {

  const { myUserID, setToasts } = useContext(StoreContext)
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const isAI = location.pathname.includes("ai")
  const navigate = useNavigate()

  const handleProSubmit = (tool) => {
    submitNewToolRequestService(
      tool,
      myUserID,
      setLoading,
      setToasts,
    )
      .then(() => {
        return createNotification(
          myUserID,
          `New ${isAI ? "AI" : "Online"} tool submitted for review`,
          `We have received your ${isAI ? "AI" : "Online"} tool submission and will review it shortly. You will be notified if it is approved or rejected.`,
          'fas fa-layer-plus',
          `/dashboard/${isAI ? "my-ai-tools/submissions" : "my-online-tools/submissions"}`,
        )
      })
      .then(() => {
        navigate(`/dashboard/${isAI ? "my-ai-tools" : "my-online-tools"}`)
      })
  }

  const handleProUpdate = (tool) => {

  }

  return (
    <ProPage
      title={`New ${isAI ? "AI" : "Online"} Tool Submission`}
      className="new-pro-tool"
    >
      <GuideSection title={`How to Submit a New ${isAI ? "AI" : "Online"} Tool`}>
        <p>
          To submit a new {isAI ? "AI" : "Online"} tool, please fill out the form below.
          Please note that all submissions are reviewed by our team before being published.
          If you have any questions, please contact us <Link to="/contact">here</Link>.
          A guideline for what an {isAI ? "AI" : "Online"} tool submission should look like
          can be found <Link to={`/submission-guide?type=${isAI ? 'ai' : 'online'}`}>here</Link>.
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
