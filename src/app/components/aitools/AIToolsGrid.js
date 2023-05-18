import React from 'react'
import AIToolCard from "./AIToolCard"
import './styles/AIToolsGrid.css'
import AILoader from "../ui/AILoader"

export default function AIToolsGrid({tools, loading}) {

  const toolsGrid = tools?.map((tool, index) => {
    return <AIToolCard
      key={index}
      tool={tool}
    />
  })

  return (
    <div className="ai-tools-grid">
      {
        !loading ?
        toolsGrid :
        <AILoader />
    }
    </div>
  )
}
