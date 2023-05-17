import React from 'react'
import AICard from "./AICard"
import './styles/AIToolsGrid.css'

export default function AIToolsGrid({tools}) {

  const toolsGrid = tools?.map((tool, index) => {
    return <AICard
      key={index}
      tool={tool}
    />
  })

  return (
    <div className="ai-tools-grid">
      {toolsGrid}
    </div>
  )
}
