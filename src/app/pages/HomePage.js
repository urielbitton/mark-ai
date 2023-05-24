import React, { useEffect, useRef, useState } from 'react'
import './styles/Homepage.css'
import AIToolsGrid from "app/components/aitools/AIToolsGrid"
import { useToolsByType } from "app/hooks/aitoolsHooks"
import AppSearchBar from "app/components/ui/AppSearchBar"
import { useNavigate, useSearchParams } from "react-router-dom"
import { noWhiteSpaceChars } from "app/utils/generalUtils"
import { useViewportObserver } from "app/hooks/generalHooks"
import { toolsCategoriesData, toolsTypesData } from "app/data/toolsData"
import TabSwitcher from "app/components/ui/TabSwitcher"
import PromptsGrid from "app/components/aitools/PromptsGrid"
import TypewriteText from "app/components/ui/TypewriteText"
import { homeTypewriteTexts } from "app/data/general"

export default function HomePage() {

  const limitsNum = 10
  const [toolsLimit, setToolsLimit] = useState(limitsNum)
  const [searchQuery, setSearchQuery] = useState('')
  const [toolsLoading, setToolsLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeType, setActiveType] = useState({ type: toolsTypesData[0].value, index: 0 })
  const aitools = useToolsByType(activeType.type, toolsLimit, setToolsLoading)
  const navigate = useNavigate()
  const endRef = useRef(null)
  const reachedEndOfList = useViewportObserver(endRef)

  const btnIconRender = activeType.type === 'ai' ? "fas fa-robot" :
    activeType.type === 'tool' ? "fas fa-flask" :
    activeType.type === 'prompt' ? "fas fa-comment-dots" : ''

  const submitSearch = () => {
    if (noWhiteSpaceChars(searchQuery) < 1) return
    if(activeType.type !== 'prompt') {
      navigate(`/search?q=${searchQuery}`)
    }
    else {
      navigate(`/search/prompts?q=${searchQuery}`)
    }
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
        <h1>
          Your&nbsp;
          <TypewriteText 
            textArray={homeTypewriteTexts} 
            maxLoops={4}
            className="gradient-text"
          />
          &nbsp;in one place
        </h1>
        <h5>Search the latest AI resources and tools</h5>
        <AppSearchBar
          placeholder={activeType.type !== 'prompt' ? "Search by name, category, or tag..." : 'Search by prompt or category'}
          btnLabel="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          onKeyUp={(e) => e.key === 'Enter' && submitSearch()}
          onSubmit={submitSearch}
          onClear={() => setSearchQuery('')}
          btnIcon={btnIconRender}
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
              categories={toolsCategoriesData}
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
