import React, { useContext, useState } from 'react'
import './styles/BookmarkPage.css'
import { StoreContext } from "app/store/store"
import { useUserToolsBookmarks } from "app/hooks/userHooks"
import AIToolCard from "app/components/aitools/AIToolCard"
import { useAITool } from "app/hooks/aitoolsHooks"
import SkeletonLoader from "app/components/ui/SkeletonLoader"

export default function BookmarkToolsPage() {

  const { myUserID } = useContext(StoreContext)
  const myToolsBookmarks = useUserToolsBookmarks(myUserID)

  const bookmarkedTools = myToolsBookmarks?.map((toolID, index) => {
    return <BookmarkToolCard
      key={index}
      toolID={toolID}
    />
  })

  return (
    <div className="bookmark-page">
      <h1>My Tools</h1>
      <div className="bookmark-grid">
        <div className="ai-tools-grid">
          <h5 className="title">AI & Online Tools</h5>
          {bookmarkedTools}
        </div>
      </div>
    </div>
  )
}

export const BookmarkToolCard = ({ toolID }) => {

  const [loading, setLoading] = useState(true)
  const tool = useAITool(toolID, setLoading)

  return !loading ? (
    <AIToolCard
      key={toolID}
      tool={tool}
    />
  ) :
    <SkeletonLoader />
}
