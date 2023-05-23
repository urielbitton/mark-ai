import React, { useEffect, useRef } from "react"
import './styles/ToolsPage.css'
import AppSearchBar from "app/components/ui/AppSearchBar"
import { noWhiteSpaceChars } from "app/utils/generalUtils"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import AIToolsGrid from "app/components/aitools/AIToolsGrid"
import { useToolsByType } from "app/hooks/aitoolsHooks"
import { useViewportObserver } from "app/hooks/generalHooks"

export default function ToolsPage() {

  const limitsNum = 10
  const [toolsLimit, setToolsLimit] = useState(limitsNum)
  const [toolsLoading, setToolsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const onlineTools = useToolsByType('tool', toolsLimit, setToolsLoading)
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
    <div className="tools-page nonai-tools-page">
      <div className="titles">
        <h1><span>Online</span> Tools</h1>
        <h5>Your Gateway to Efficiency and Productivity</h5>
      </div>
      <div className="search-section">
        <AppSearchBar
          placeholder="Search online tools"
          btnLabel="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          onKeyUp={(e) => e.key === 'Enter' && submitSearch()}
          onSubmit={submitSearch}
          onClear={() => setSearchQuery('')}
          btnIcon="fas fa-flask"
        />
      </div>
      <AIToolsGrid
        tools={onlineTools}
        loading={toolsLoading}
      />
      <div
        ref={endRef}
        className="end-div"
      />
    </div>
  )
}
