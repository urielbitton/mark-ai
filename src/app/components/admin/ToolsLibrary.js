import React, { useState } from 'react'
import AIToolsGrid from "../aitools/AIToolsGrid"
import { useAiTools } from "app/hooks/aitoolsHooks"
import AppButton from "../ui/AppButton"

export default function ToolsLibrary() {

  const limitsNum = 50
  const [toolsLimit, setToolsLimit] = useState(limitsNum)
  const aitools = useAiTools(toolsLimit)

  return (
    <div className="tools-library">
      <h2>All AI Tools</h2>
      <AppButton
        label="Add New Tool"
        url="/admin/add-new-tool"
      />
      <br/><br/>
      <AIToolsGrid 
        tools={aitools}
      />
    </div>
  )
}
