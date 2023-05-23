import React, { useState } from 'react'
import PromptCard from "./PromptCard"
import AILoader from "../ui/AILoader"
import './styles/AIToolsGrid.css'
import { usePromptsByCategory } from "app/hooks/aitoolsHooks"
import AppButton from "../ui/AppButton"

export default function PromptsGrid({ categories }) {

  const limitsNum = 7

  const promptsCategoryRender = categories
    .sort((a, b) => a.label < b.label ? -1 : 1)
    .map((category, index) => {
      return <PromptsCategoryColumn
        category={category}
        limit={limitsNum}
        key={index}
      />
    })

  return (
    <div className="prompts-grid ai-tools-grid">
      <div className="content">
        {promptsCategoryRender}
      </div>
    </div>
  )
}

export const PromptsCategoryColumn = ({ category, limit }) => {

  const [loading, setLoading] = useState(true)
  const prompts = usePromptsByCategory(category.value, limit, setLoading)

  const promptsFlex = prompts?.map((prompt, index) => {
    return <PromptCard
      prompt={prompt}
      key={index}
    />
  })

  return (
    <div className="prompts-category-column">
      <h4>
        <i className={`fas fa-${category.icon}`} />
        {category.label}
      </h4>
      <div className="prompts-list">
        {
          !loading ?
            promptsFlex :
            <AILoader />
        }
        {
          prompts?.length > 0 ?
            <AppButton
              label="View All"
              url={`/prompts/categories/${category.value}`}
            /> :
            <small>There are no prompts for this category</small>
        }
      </div>
    </div>
  )

}