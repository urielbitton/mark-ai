import React, { useContext, useState } from 'react'
import ProPage from "./ProPage"
import GuideSection from "./GuideSection"
import { Link, useNavigate } from "react-router-dom"
import NewPrompt from "../admin/NewPrompt"
import { StoreContext } from "app/store/store"
import { createNotification } from "app/services/notifServices"
import { submitNewPromptRequestService, updateApprovedPromptService, 
  updateNonApprovedPromptService } from "app/services/aitoolsServices"

export default function NewProPrompt() {

  const { myUserID, setToasts } = useContext(StoreContext)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const updateCreateNotification = () => {
    navigate(`/dashboard/my-prompts`)
    return createNotification(
      myUserID,
      `Prompt submission updated`,
      `We have received your prompt submission update and will review it shortly. You will then be notified if it is approved or rejected.`,
      'fas fa-layer-plus',
      `/dashboard/my-prompts`,
    )
  }

  const handleProSubmit = (prompt) => {
    submitNewPromptRequestService(
      prompt,
      myUserID,
      setLoading,
      setToasts,
    )
      .then(() => {
        navigate(`/dashboard/my-prompts`)
        return createNotification(
          myUserID,
          `New prompt submitted for review`,
          `We have received your prompt submission and will review it shortly. You will then be notified if it is approved or rejected.`,
          'fas fa-layer-plus',
          `/dashboard/my-prompts`,
        )
      })
  }

  const handleProUpdate = (prompt) => {
    if(prompt.status !== "approved") {
      return updateNonApprovedPromptService(
        prompt, 
        prompt.promptID, 
        setLoading, 
        setToasts
      )
      .then(() => updateCreateNotification())
    }
    return updateApprovedPromptService(
      prompt,
      prompt.promptID,
      setLoading,
      setToasts
    )
    .then(() => updateCreateNotification())
  }

  return (
    <ProPage
      title="New Prompt"
      className="new-pro-prompt"
    >
      <GuideSection title={`How to Submit a prompt`}>
        <p>
          To submit a prompt, please fill out the form below.
          Please note that all submissions are reviewed by our team before being published.
          If you have any questions, please use the <Link to="/contact">contact us</Link> page.
          A guideline for what a prompt submission should look like
          can be found on the <Link to={`submission-guide?type=prompt`}>Submission Guide</Link> page.
        </p>
      </GuideSection>
      <NewPrompt
        proUser
        handleProSubmit={handleProSubmit}
        handleProUpdate={handleProUpdate}
        proLoading={loading}
      />
    </ProPage>
  )
}
