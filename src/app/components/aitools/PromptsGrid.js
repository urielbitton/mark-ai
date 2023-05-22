import React from 'react'
import PromptCard from "./PromptCard"
import AILoader from "../ui/AILoader"
import './styles/AIToolsGrid.css'

export default function PromptsGrid({ prompts, loading }) {

  const promptsGrid = prompts?.map((prompt, index) => {
    return <PromptCard
      prompt={prompt}
      key={index}
    />
  })

  return (
    <div className="prompts-grid ai-tools-grid">
      {
        !loading ?
          <div className="content">
            {promptsGrid}
          </div> :
          <AILoader />
      }
    </div>
  )
}
