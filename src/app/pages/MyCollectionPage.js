import React, { useContext, useState } from 'react'
import './styles/MyCollectionPage.css'
import AIToolsGrid from "app/components/aitools/AIToolsGrid"
import { StoreContext } from "app/store/store"
import { useUserBookmarks } from "app/hooks/userHooks"
import AIToolCard from "app/components/aitools/AIToolCard"
import { useAITool } from "app/hooks/aitoolsHooks"
import SkeletonLoader from "app/components/ui/SkeletonLoader"

export default function MyCollectionPage() {

  const { myUserID } = useContext(StoreContext)
  const myBookmarks = useUserBookmarks(myUserID)

  const bookmarkedTools = myBookmarks?.map((toolID, index) => {
    return <BookmarkToolCard
      toolID={toolID}
      key={index}
    />
  })

  return (
    <div className="collection-page">
      <h1>My Collection</h1>
      <div className="ai-tools-grid">
        {bookmarkedTools}
      </div>
    </div>
  )
}

export const BookmarkToolCard = ({ toolID }) => {

  const [loading, setLoading] = useState(true)
  const tool = useAITool(toolID, setLoading)

  return !loading ? (
    <AIToolCard
      tool={tool}
      key={toolID}
    />
  ) :
    <SkeletonLoader />
}
