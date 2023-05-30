import React, { useState } from 'react'
import './styles/ToolsPage.css'
import PromptsGrid from "app/components/aitools/PromptsGrid"
import { toolsCategoriesData } from "app/data/toolsData"
import AppSearchBar from "app/components/ui/AppSearchBar"
import { noWhiteSpaceChars } from "app/utils/generalUtils"
import { useNavigate } from "react-router-dom"

export default function PromptsPage() {

  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const submitSearch = () => {
    if (noWhiteSpaceChars(searchQuery) < 1) return
    navigate(`/search/prompts?q=${searchQuery}`)
  }

  return (
    <div className="tools-page prompts-page">
      <div className="titles">
        <h1 className="gradient-text">Chat Prompts</h1>
        <h5>Discover powerful and high yielding chat prompts</h5>
      </div>
      <div className="search-section">
        <AppSearchBar
          placeholder="Search chat prompts"
          btnLabel="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          onKeyUp={(e) => e.key === 'Enter' && submitSearch()}
          onSubmit={submitSearch}
          onClear={() => setSearchQuery('')}
          btnIcon="fas fa-comment-dots"
        />
      </div>
      <PromptsGrid
        categories={toolsCategoriesData.slice(2)}
      />
    </div>
  )
}
