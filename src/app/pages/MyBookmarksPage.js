import React, { useContext, useState } from 'react'
import './styles/MyCollectionPage.css'
import { StoreContext } from "app/store/store"
import { useUserToolsBookmarks, useUserPromptsBookmarks } from "app/hooks/userHooks"
import AIToolCard from "app/components/aitools/AIToolCard"
import { useAITool, useChatPrompt } from "app/hooks/aitoolsHooks"
import SkeletonLoader from "app/components/ui/SkeletonLoader"
import PromptCard from "app/components/aitools/PromptCard"

export default function MyBookmarksPage() {

  const { myUserID } = useContext(StoreContext)
  const myToolsBookmarks = useUserToolsBookmarks(myUserID)
  const myPromptsBookmarks = useUserPromptsBookmarks(myUserID)

  const bookmarkedTools = myToolsBookmarks?.map((toolID, index) => {
    return <BookmarkToolCard
      key={index}
      toolID={toolID}
    />
  })

  const bookmarkedPrompts = myPromptsBookmarks?.map((promptID, index) => {
    return <BookmarkPromptCard
      key={index}
      promptID={promptID}
    />
  })

  return (
    <div className="collection-page">
      <h1>My Bookmarks</h1>
      <div className="collection-grid">
        <div className="ai-tools-grid">
          <h5 className="title">AI & Online Tools</h5>
          {bookmarkedTools}
        </div>
        <div className="prompts-grid">
          <h5 className="title">Chat Prompts</h5>
          {bookmarkedPrompts}
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

export const BookmarkPromptCard = ({ promptID }) => {

  const [loading, setLoading] = useState(true)
  const prompt = useChatPrompt(promptID, setLoading)

  return !loading ? (
    <PromptCard
      key={promptID}
      prompt={prompt}
    />
  ) :
    <SkeletonLoader 
      small 
      borderRadius={45}
    />
}