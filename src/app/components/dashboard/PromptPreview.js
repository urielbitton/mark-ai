import { usePromptPreview } from "app/hooks/aitoolsHooks"
import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import AILoader from "../ui/AILoader"
import AppButton from "../ui/AppButton"
import PromptPage from "app/pages/PromptPage"
import { cancelDeletePromptSubmissionService, 
  deletePromptSubmissionService } from "app/services/aitoolsServices"
import { StoreContext } from "app/store/store"

export default function PromptPreview() {

  const { setToasts } = useContext(StoreContext)
  const [loading, setLoading] = useState(true)
  const promptID = useParams().promptID
  const previewPrompt = usePromptPreview(promptID, setLoading)
  const navigate = useNavigate()
  const isApproved = previewPrompt?.status === "approved"
  const isRequestedDelete = previewPrompt?.requestDelete

  const handleDeletePrompt = () => {
    const confirm = window.confirm("Are you sure you want to delete this prompt?")
    if (!confirm) return
    const path = isApproved ? 'prompts' : 'promptsSubmissions'
    deletePromptSubmissionService(path, promptID, setLoading, setToasts)
      .then(() => {
        navigate("/dashboard/my-prompts")
      })
  }

  const handleCancelDeletePrompt = () => {
    const confirm = window.confirm("Are you sure you want to cancel your delete request for this prompt?")
    if (!confirm) return
    const path = isApproved ? 'prompts' : 'promptsSubmissions'
    cancelDeletePromptSubmissionService(path, promptID, setLoading, setToasts)
  }

  return (
    <div
      className="tool-preview-page"
      key={promptID}
    >
      <div className="title-bar">
        <div className="left-side side">
          <AppButton
            label="Back"
            buttonType="invertedBtn"
            leftIcon="fal fa-arrow-left"
            onClick={() => navigate(-1)}
          />
          <h3>Prompt Preview</h3>
        </div>
        <div className="right-side side">
          <AppButton
            label="Edit"
            leftIcon="fas fa-pen"
            url={`/dashboard/new-prompt?promptID=${promptID}&edit=true`}
            buttonType="outlineBtn"
          />
          {
            !isRequestedDelete ?
              <AppButton
                label="Request Delete"
                leftIcon="fas fa-trash"
                onClick={handleDeletePrompt}
                buttonType="outlineBtn"
              /> :
              <AppButton
                label="Cancel Delete Request"
                leftIcon="fas fa-trash-undo"
                onClick={handleCancelDeletePrompt}
                buttonType="outlineBtn"
              />
          }
        </div>
      </div>
      {
        !loading ?
          <PromptPage
            previewPrompt={previewPrompt}
          /> :
          <AILoader />
      }
    </div>
  )
}
