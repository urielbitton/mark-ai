import React, { useEffect, useRef } from "react"
import './styles/ToolsPage.css'
import AppSearchBar from "app/components/ui/AppSearchBar"
import { noWhiteSpaceChars } from "app/utils/generalUtils"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import AIToolsGrid from "app/components/aitools/AIToolsGrid"
import { useToolsByPopularityAndType, useToolsByTypeAndCategory } from "app/hooks/aitoolsHooks"
import { useViewportObserver } from "app/hooks/generalHooks"
import { toolsCategoriesData } from "app/data/toolsData"
import { AppReactSelect } from "app/components/ui/AppInputs"
import AppScrollSlider from "app/components/ui/AppScrollSlider"

export default function OnlineToolsPage() {

  const limitsNum = 10
  const [toolsLimit, setToolsLimit] = useState(limitsNum)
  const [toolsLoading, setToolsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewsNum, setViewsNum] = useState(50)
  const [ratingNum, setRatingNum] = useState(4)
  const [selectedCategory, setSelectedCategory] = useState('ratings')
  const onlineTools = useToolsByTypeAndCategory('tool', selectedCategory, toolsLimit, setToolsLoading)
  const popularTools = useToolsByPopularityAndType('tool', selectedCategory, viewsNum, ratingNum, toolsLimit, setToolsLoading)
  const navigate = useNavigate()
  const endRef = useRef(null)
  const reachedEndOfList = useViewportObserver(endRef)
  const isPopularCategory = selectedCategory === 'ratings' || selectedCategory === 'views'

  const toolsCategoriesRender = toolsCategoriesData.map((cat, index) => {
    return <h6
      key={index}
      className={selectedCategory === cat.value ? 'selected' : ''}
      onClick={() => setSelectedCategory(cat.value)}
    >
      <i className={cat.icon} />
      {cat.label}
    </h6>
  })

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
        <h1 className="gradient-text">Online Tools</h1>
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
      <div className="categories-section">
        <div className="left">
          <h4>Categories</h4>
          <AppReactSelect
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val.value)}
            options={toolsCategoriesData}
            searchable
            placeholder={
              <div className="input-placeholder">
                <i className={toolsCategoriesData.find((cat) => cat.value === selectedCategory)?.icon} />
                <h5 className="cap">{selectedCategory}</h5>
              </div>
            }
          />
        </div>
        <div className="right">
          <AppScrollSlider>
            {toolsCategoriesRender}
          </AppScrollSlider>
        </div>
      </div>
      <AIToolsGrid
        tools={!isPopularCategory ? onlineTools : popularTools}
        loading={toolsLoading}
      />
      <div
        ref={endRef}
        className="end-div"
      />
    </div>
  )
}
