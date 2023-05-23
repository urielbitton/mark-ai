import React, { useEffect, useRef } from "react"
import './styles/ToolsPage.css'
import AppSearchBar from "app/components/ui/AppSearchBar"
import { noWhiteSpaceChars } from "app/utils/generalUtils"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import AIToolsGrid from "app/components/aitools/AIToolsGrid"
import { useToolsByType } from "app/hooks/aitoolsHooks"
import { useViewportObserver } from "app/hooks/generalHooks"

export default function AIToolsPage() {

  const limitsNum = 10
  const [toolsLimit, setToolsLimit] = useState(limitsNum)
  const [toolsLoading, setToolsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const aitools = useToolsByType('ai', toolsLimit, setToolsLoading)
  const navigate = useNavigate()
  const endRef = useRef(null)
  const reachedEndOfList = useViewportObserver(endRef)

  const submitSearch = () => {
    if (noWhiteSpaceChars(searchQuery) < 1) return
    navigate(`/search?q=${searchQuery}`)
  }

  useEffect(() => {
    if (reachedEndOfList) {
      setToolsLimit(prev => prev + limitsNum)
    }
  }, [reachedEndOfList])

  return (
    <div className="tools-page ai-tools-page">
      <div className="titles">
        <h1><span>AI</span> Tools</h1>
        <h5>Empower Your Work with Cutting-Edge AI Tools</h5>
      </div>
      <div className="search-section">
        <AppSearchBar
          placeholder="Search AI tools"
          btnLabel="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          onKeyUp={(e) => e.key === 'Enter' && submitSearch()}
          onSubmit={submitSearch}
          onClear={() => setSearchQuery('')}
          btnIcon="fas fa-robot"
        />
      </div>
      <AIToolsGrid
        tools={aitools}
        loading={toolsLoading}
      />
      <div
        ref={endRef}
        className="end-div"
      />
    </div>
  )
}
