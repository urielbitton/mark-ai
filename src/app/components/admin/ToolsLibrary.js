import React, { useState } from 'react'
import AIToolsGrid from "../aitools/AIToolsGrid"
import { useAllTools } from "app/hooks/aitoolsHooks"
import AppButton from "../ui/AppButton"
import './styles/ToolsLibrary.css'
import { useDocsCount } from "app/hooks/userHooks"

export default function ToolsLibrary() {

  const limitsNum = 20
  const [toolsLimit, setToolsLimit] = useState(limitsNum)
  const [loading, setLoading] = useState(true)
  const aitools = useAllTools(toolsLimit, setLoading)
  const totalTools = useDocsCount('aitools')
  const hasMoreTools = toolsLimit < totalTools

  return (
    <div className="tools-library">
      <div className="title-bar">
        <h2>All Tools ({totalTools})</h2>
        <AppButton
          label="Add New Tool"
          url="/admin/add-new/tool"
          rightIcon="far fa-plus"
        />
      </div>
      <br /><br />
      <AIToolsGrid
        tools={aitools}
        loading={loading}
      />
      {
        hasMoreTools &&
        <div className="btn-group">
          <AppButton
            label="Load More"
            onClick={() => setToolsLimit(prev => prev + limitsNum)}
          />
        </div>
      }
    </div>
  )
}
