import React from 'react'
import AIToolCard from "./AIToolCard"
import './styles/AIToolsGrid.css'
import AILoader from "../ui/AILoader"

export default function AIToolsGrid({ tools, loading }) {

  const toolsGrid = tools?.map((tool, index) => {
    return <AIToolCard
      tool={tool}
      key={index}
    />
  })

  return (
    <div className="ai-tools-grid">
      {
        !loading ?
          <div className="content">
            {toolsGrid}
          </div> :
          <AILoader />
      }
    </div>
  )
}
