import PromptCard from "app/components/aitools/PromptCard"
import AILoader from "app/components/ui/AILoader"
import { usePromptsByCategory } from "app/hooks/aitoolsHooks"
import { useViewportObserver } from "app/hooks/generalHooks"
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import "./styles/PromptsCategoryPage.css"
import AppSearchBar from "app/components/ui/AppSearchBar"
import { noWhiteSpaceChars } from "app/utils/generalUtils"

export default function PromptsCategoryPage() {

  const category = useParams().category
  const limitsNum = 20
  const [searchQuery, setSearchQuery] = useState('')
  const [promptsLimit, setPromptsLimit] = useState(limitsNum)
  const [loading, setLoading] = useState(true)
  const prompts = usePromptsByCategory(category, promptsLimit, setLoading)
  const endRef = useRef(null)
  const reachedEndOfList = useViewportObserver(endRef)
  const navigate = useNavigate()

  const promptsGrid = prompts?.map((prompt, index) => {
    return <PromptCard
      prompt={prompt}
      key={index}
    />
  })

  const submitSearch = () => {
    if (noWhiteSpaceChars(searchQuery) < 1) return
    navigate(`/search/prompts?q=${searchQuery}&category=${category}`)
  }

  useEffect(() => {
    if (reachedEndOfList) {
      setPromptsLimit(prev => prev + limitsNum)
    }
  }, [reachedEndOfList])

  return (
    <div className="prompts-category-page">
      <div className="titles">
        <h6>Prompts</h6>
        <h3>{category}</h3>
      </div>
      <div className="search-section">
        <AppSearchBar
          placeholder={`Search ${category} prompts`}
          btnLabel="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          onKeyUp={(e) => e.key === 'Enter' && submitSearch()}
          onSubmit={submitSearch}
          onClear={() => setSearchQuery('')}
        />
      </div>
      <div className="prompts-grid">
        {
          !loading ?
            promptsGrid :
            <AILoader />
        }
      </div>
      <div
        ref={endRef}
        className="end-div"
      />
    </div>
  )
}
