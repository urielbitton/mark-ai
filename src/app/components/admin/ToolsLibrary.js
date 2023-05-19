import React, { useState } from 'react'
import AIToolsGrid from "../aitools/AIToolsGrid"
import { useAiTools } from "app/hooks/aitoolsHooks"
import AppButton from "../ui/AppButton"
import './styles/ToolsLibrary.css'

export default function ToolsLibrary() {

  const limitsNum = 20
  const [toolsLimit, setToolsLimit] = useState(limitsNum)
  const [loading, setLoading] = useState(true)
  const aitools = useAiTools(toolsLimit, setLoading)

  return (
    <div className="tools-library">
      <div className="title-bar">
        <h2>All AI Tools</h2>
        <AppButton
          label="Add New Tool"
          url="/admin/add-new-tool"
          rightIcon="far fa-plus"
        />
      </div>
      <br /><br />
      <AIToolsGrid
        tools={aitools}
        loading={loading}
      />
    </div>
  )
}
