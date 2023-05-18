import React, { useState } from 'react'
import './styles/Homepage.css'
import AIToolsGrid from "app/components/aitools/AIToolsGrid"
import { useAiTools } from "app/hooks/aitoolsHooks"
import AISearchBar from "app/components/aitools/AISearchBar"
import { useNavigate } from "react-router-dom"
import { noWhiteSpaceChars } from "app/utils/generalUtils"

export default function HomePage() {

  const limitsNum = 20
  const [toolsLimit, setToolsLimit] = useState(limitsNum)
  const [searchQuery, setSearchQuery] = useState('')
  const [toolsLoading, setToolsLoading] = useState(true)
  const aitools = useAiTools(toolsLimit, setToolsLoading)
  const navigate = useNavigate()

  const submitSearch = () => {
    if(noWhiteSpaceChars(searchQuery) < 1) return
    navigate(`/search?q=${searchQuery}`)
  }

  return (
    <div className="homepage">
      <div className="hero-section">
        <h1>Your <span>AI</span> tools in one place</h1>
        <h5>Search the latest AI resources and tools</h5>
        <AISearchBar 
          placeholder="Search by name, category, or tag..."
          btnLabel="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          onKeyUp={(e) => e.key === 'Enter' && submitSearch()}
          onSubmit={submitSearch}
          onClear={() => setSearchQuery('')}
        />
      </div>
      <div className="home-grid">
        <AIToolsGrid 
          tools={aitools}
          loading={toolsLoading}
        />
      </div>
    </div>
  )
}
