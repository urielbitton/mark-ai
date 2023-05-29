import React, { useContext, useEffect, useRef, useState } from 'react'
import './styles/Homepage.css'
import AIToolsGrid from "app/components/aitools/AIToolsGrid"
import { useToolsByType } from "app/hooks/aitoolsHooks"
import AppSearchBar from "app/components/ui/AppSearchBar"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { noWhiteSpaceChars } from "app/utils/generalUtils"
import { useViewportObserver } from "app/hooks/generalHooks"
import { homeTabSwitcherData, toolsCategoriesData } from "app/data/toolsData"
import TabSwitcher from "app/components/ui/TabSwitcher"
import PromptsGrid from "app/components/aitools/PromptsGrid"
import TypewriteText from "app/components/ui/TypewriteText"
import { homeTypewriteTexts } from "app/data/general"
import AppBadge from "app/components/ui/AppBadge"
import { StoreContext } from "app/store/store"

export default function HomePage() {

  const { isPro } = useContext(StoreContext)
  const limitsNum = 10
  const [toolsLimit, setToolsLimit] = useState(limitsNum)
  const [searchQuery, setSearchQuery] = useState('')
  const [toolsLoading, setToolsLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeType, setActiveType] = useState({ type: homeTabSwitcherData[0].value, index: 0 })
  const aitools = useToolsByType(activeType.type, toolsLimit, setToolsLoading)
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
      const type = homeTabSwitcherData.find(tab => tab.value === searchParams.get('type'))
      if (type) {
        setActiveType({ type: type.value, index: homeTabSwitcherData.indexOf(type) })
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
          Your&nbsp;<br />
          <TypewriteText
            textArray={homeTypewriteTexts}
            maxLoops={4}
            className="gradient-text"
          />
          <br />
          &nbsp;in one place
        </h1>
        <h5>Search the latest AI resources and tools</h5>
        <AppSearchBar
          placeholder="Search tools by name, category, or tags"
          btnLabel="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          onKeyUp={(e) => e.key === 'Enter' && submitSearch()}
          onSubmit={submitSearch}
          onClear={() => setSearchQuery('')}
          btnIcon="fas fa-flask"
        />
        <div className="tabs-section">
          <TabSwitcher
            tabs={homeTabSwitcherData}
            activeTab={activeType}
            onTabClick={onTabClick}
          />
          {
            !isPro &&
            <Link
              to="/submit-tool"
              className="submit-text"
            >
              Submit Tool
              <AppBadge
                label="new"
              />
            </Link>
          }
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
