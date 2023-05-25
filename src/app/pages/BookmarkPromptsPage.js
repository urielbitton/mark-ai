import React, { useContext, useState } from 'react'
import './styles/BookmarkPage.css'
import { StoreContext } from "app/store/store"
import { useUserPromptsBookmarks } from "app/hooks/userHooks"
import { useChatPrompt } from "app/hooks/aitoolsHooks"
import SkeletonLoader from "app/components/ui/SkeletonLoader"
import PromptCard from "app/components/aitools/PromptCard"

export default function BookmarkPromptsPage() {

  const { myUserID } = useContext(StoreContext)
  const myPromptsBookmarks = useUserPromptsBookmarks(myUserID)

  const bookmarkedPrompts = myPromptsBookmarks?.map((promptID, index) => {
    return <BookmarkPromptCard
      key={index}
      promptID={promptID}
    />
  })

  return (
    <div className="bookmark-page">
      <h1>My Prompts</h1>
      <div className="bookmark-grid">
        <div className="prompts-grid">
          <h5 className="title">Chat Prompts</h5>
          {bookmarkedPrompts}
        </div>
      </div>
    </div>
  )
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
      key={promptID}
    />
}