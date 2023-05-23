import React, { useContext } from 'react'
import './styles/PromptCard.css'
import { copyToClipboard, truncateText } from "app/utils/generalUtils"
import { Link, useNavigate } from "react-router-dom"
import { StoreContext } from "app/store/store"
import { successToast } from "app/data/toastsTemplates"
import { useUserPromptsBookmarks } from "app/hooks/userHooks"
import { toggleBookmarkPromptService } from "app/services/aitoolsServices"
import { toolsCategoriesData } from "app/data/toolsData"

export default function PromptCard(props) {

  const { setToasts, myUserID, myUser, myUserType } = useContext(StoreContext)
  const { text, category, promptID } = props.prompt
  const { isPreview } = props
  const userBookmarks = useUserPromptsBookmarks(myUserID)
  const isBookmarked = userBookmarks.includes(promptID)
  const isProMember = myUserType === "pro" || myUserType === "admin"
  const reachedBookmarkLimit = userBookmarks.length >= 50 && !isProMember
  const navigate = useNavigate()
  const categoryIcon = toolsCategoriesData?.find(cat => cat.value === category)?.icon

  const onPromptClick = (e) => {
    copyToClipboard(text)
      .then(() => {
        setToasts(successToast('Prompt copied to clipboard!'))
      })
  }

  const toggleBookmarkPrompt = () => {
    if (!isBookmarked && reachedBookmarkLimit) {
      setToasts("You can bookmark up to 50 prompts. Upgrade your account to unlock unlimited bookmarking.")
      return navigate("/my-account/upgrade")
    }
    toggleBookmarkPromptService(promptID, myUserID, isBookmarked, setToasts)
  }

  return (
    <div
      className="prompt-card"
      key={promptID}
    >
      <div className="left-side">
        <div
          className="main-icon-container"
          onClick={onPromptClick}
        >
          <i className={`${categoryIcon} main-icon`} />
          <i className="fas fa-copy" />
        </div>
        {
          myUser &&
          <i
            className={`fa${isBookmarked ? 's' : 'r'} fa-bookmark bookmark-icon`}
            onClick={toggleBookmarkPrompt}
          />
        }
      </div>
      <Link
        to={!isPreview ? `/prompts/${promptID}` : ''}
        className="text-content"
      >
        <p>{truncateText(text, 150)}</p>
      </Link>
    </div>
  )
}
