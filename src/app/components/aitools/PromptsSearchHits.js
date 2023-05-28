import { promptsIndex } from "app/algolia"
import { useInstantSearch } from "app/hooks/searchHooks"
import React from 'react'
import PromptCard from "./PromptCard"
import AILoader from "../ui/AILoader"

export default function PromptsSearchHits(props) {

  const { query, filters, setNumOfHits, setNumOfPages, 
    pageNum, hitsPerPage, loading, setLoading, showAll=false } = props

  const promptsResults = useInstantSearch(
    query,
    promptsIndex,
    filters,
    setNumOfHits,
    setNumOfPages,
    pageNum,
    hitsPerPage,
    setLoading,
    showAll
  )

  const promptsRender = promptsResults?.map((prompt, index) => {
    return <PromptCard
      prompt={prompt}
      key={index}
    />
  })

  return (
    <div className="tools-search-hits prompts-search-hits">
      {
        !loading ?
        promptsRender :
        <AILoader />
      }
    </div>
  )
}
