import { useAIToolPreview } from "app/hooks/aitoolsHooks"
import AIToolPage from "app/pages/AIToolPage"
import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import AILoader from "../ui/AILoader"
import AppButton from "../ui/AppButton"
import {
  cancelDeleteToolSubmissionService,
  deleteToolSubmissionService
} from "app/services/aitoolsServices"
import { StoreContext } from "app/store/store"

export default function ToolPreview() {

  const { setToasts } = useContext(StoreContext)
  const [loading, setLoading] = useState(true)
  const toolID = useParams().toolID
  const previewTool = useAIToolPreview(toolID, setLoading)
  const navigate = useNavigate()
  const isApproved = previewTool?.status === "approved"
  const isRequestedDelete = previewTool?.requestDelete
  const isAI = previewTool?.type === "ai"

  const handleDeleteTool = () => {
    const confirm = window.confirm("Are you sure you want to delete this tool?")
    if (!confirm) return
    const path = isApproved ? 'tools' : 'toolsSubmissions'
    deleteToolSubmissionService(path, toolID, setLoading, setToasts)
      .then(() => {
        navigate("/dashboard/my-prompts")
      })
  }

  const handleCancelDeleteTool = () => {
    const confirm = window.confirm("Are you sure you want to cancel your delete request for this tool?")
    if (!confirm) return
    const path = isApproved ? 'tools' : 'toolsSubmissions'
    cancelDeleteToolSubmissionService(path, toolID, setLoading, setToasts)
  }

  return (
    <div
      className="tool-preview-page"
      key={toolID}
    >
      <div className="title-bar">
        <div className="left-side side">
          <AppButton
            label="Back"
            buttonType="invertedBtn"
            leftIcon="fal fa-arrow-left"
            onClick={() => navigate(-1)}
          />
          <h3>Tool Preview</h3>
        </div>
        <div className="right-side side">
          <AppButton
            label="Edit"
            leftIcon="fas fa-pen"
            url={`/dashboard/new-${isAI ? 'ai' : 'online'}-tool?toolID=${toolID}&edit=true`}
            buttonType="outlineBtn"
          />
          {
            !isRequestedDelete ?
              <AppButton
                label="Request Delete"
                leftIcon="fas fa-trash"
                onClick={handleDeleteTool}
                buttonType="outlineBtn"
              /> :
              <AppButton
                label="Cancel Delete Request"
                leftIcon="fas fa-trash-undo"
                onClick={handleCancelDeleteTool}
                buttonType="outlineBtn"
              />
          }
        </div>
      </div>
      {
        !loading ?
          <AIToolPage
            previewTool={previewTool}
          /> :
          <AILoader />
      }
    </div>
  )
}
