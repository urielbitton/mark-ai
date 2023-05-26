import { useAIToolPreview } from "app/hooks/aitoolsHooks"
import AIToolPage from "app/pages/AIToolPage"
import React, { useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import AILoader from "../ui/AILoader"
import AppButton from "../ui/AppButton"

export default function ToolPreview() {

  const [loading, setLoading] = useState(true)
  const toolID = useParams().toolID
  const previewTool = useAIToolPreview(toolID, setLoading)
  const navigate = useNavigate()

  return (
    <div className="tool-preview-page">
      <div className="title-bar">
        <AppButton
          label="Back"
          buttonType="invertedBtn"
          leftIcon="fal fa-arrow-left"
          onClick={() => navigate(-1)}
        />
        <h3>Tool Preview</h3>
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
