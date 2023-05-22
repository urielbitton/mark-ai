import React, { useEffect, useRef, useState } from 'react'
import './styles/Homepage.css'
import AIToolsGrid from "app/components/aitools/AIToolsGrid"
import { useChatPrompts, useToolsByType } from "app/hooks/aitoolsHooks"
import AISearchBar from "app/components/aitools/AISearchBar"
import { useNavigate, useSearchParams } from "react-router-dom"
import { noWhiteSpaceChars } from "app/utils/generalUtils"
import { useViewportObserver } from "app/hooks/generalHooks"
import { toolsTypesData } from "app/data/toolsData"
import TabSwitcher from "app/components/ui/TabSwitcher"
import PromptsGrid from "app/components/aitools/PromptsGrid"

export default function HomePage() {

  const limitsNum = 10
  const [toolsLimit, setToolsLimit] = useState(limitsNum)
  const [searchQuery, setSearchQuery] = useState('')
  const [toolsLoading, setToolsLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeType, setActiveType] = useState({ type: toolsTypesData[0].value, index: 0 })
  const aitools = useToolsByType(activeType.type, toolsLimit, setToolsLoading)
  const prompts = useChatPrompts(limitsNum, setToolsLoading)
  const navigate = useNavigate()
  const endRef = useRef(null)
  const reachedEndOfList = useViewportObserver(endRef)

  const submitSearch = () => {
    if (noWhiteSpaceChars(searchQuery) < 1) return
    navigate(`/search?q=${searchQuery}`)
  }

  const onTabClick = (tab, index) => {
    setActiveType({ type: tab.value, index })
    setSearchParams({ type: tab.value })
  }

  useEffect(() => {
    if (searchParams.get('type')) {
      const type = toolsTypesData.find(tab => tab.value === searchParams.get('type'))
      if (type) {
        setActiveType({ type: type.value, index: toolsTypesData.indexOf(type) })
      }
    }
  }, [])

  useEffect(() => {
    if (reachedEndOfList) {
      setToolsLimit(prev => prev + limitsNum)
    }
  }, [reachedEndOfList])

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
        <div className="tabs-section">
          <TabSwitcher
            tabs={toolsTypesData}
            activeTab={activeType}
            onTabClick={onTabClick}
          />
        </div>
      </div>
      <div className="home-grid">
        {
          activeType.type !== 'prompt' ?
            <AIToolsGrid
              tools={aitools}
              loading={toolsLoading}
            /> 
            :
            <PromptsGrid
              prompts={prompts}
              loading={toolsLoading}
            />
        }
        <div
          ref={endRef}
          className="end-div"
        />
      </div>
    </div>
  )
}
