import { aitoolsIndex } from "app/algolia"
import { useInstantSearch } from "app/hooks/searchHooks"
import React from 'react'
import AICard from "./AIToolCard"
import AIToolsGrid from "./AIToolsGrid"

export default function AIToolsSearchHits(props) {

  const { query, filters, setNumOfHits, setNumOfPages, 
    pageNum, hitsPerPage, loading, setLoading, showAll=false } = props

  const allAITools = useInstantSearch(
    query,
    aitoolsIndex,
    filters,
    setNumOfHits,
    setNumOfPages,
    pageNum,
    hitsPerPage,
    setLoading,
    showAll
  )

  return (
    <div className="tools-search-hits">
      <AIToolsGrid
        tools={allAITools}
        loading={loading}
      />
    </div>
  )
}
