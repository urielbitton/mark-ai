import React, { useContext } from 'react'
import './styles/PromptCard.css'
import { copyToClipboard, truncateText } from "app/utils/generalUtils"
import { Link, useNavigate } from "react-router-dom"
import { StoreContext } from "app/store/store"
import { infoToast, successToast } from "app/data/toastsTemplates"
import { useUserPromptsBookmarks } from "app/hooks/userHooks"
import { toggleBookmarkPromptService } from "app/services/aitoolsServices"
import { toolsCategoriesData } from "app/data/toolsData"

export default function PromptCard(props) {

  const { setToasts, myUserID, myUser, isPro,
    isUserVerified } = useContext(StoreContext)
  const { text, category, promptID, short } = props.prompt
  const { isPreview, submissionStatus, compact } = props
  const userBookmarks = useUserPromptsBookmarks(myUserID)
  const isBookmarked = userBookmarks.includes(promptID)
  const reachedBookmarkLimit = userBookmarks.length >= 50 && !isPro
  const navigate = useNavigate()
  const categoryIcon = toolsCategoriesData?.find(cat => cat.value === category)?.icon

  const onPromptClick = (e) => {
    copyToClipboard(text)
      .then(() => {
        setToasts(successToast('Prompt copied to clipboard!'))
      })
  }

  const toggleBookmarkPrompt = () => {
    if (!isUserVerified) {
      setToasts(infoToast('Please verify your account to bookmark prompts.', true))
      return navigate("/my-account/verify-account")
    }
    if (!myUser) {
      setToasts(infoToast('Please login to bookmark prompts.'))
      return navigate('/login')
    }
    if (!isBookmarked && reachedBookmarkLimit) {
      setToasts("You can bookmark up to 50 prompts. Upgrade your account to unlock unlimited bookmarking.")
      return navigate("/my-account/upgrade")
    }
    toggleBookmarkPromptService(promptID, myUserID, isBookmarked, setToasts)
  }

  return (
    <div
      className={`prompt-card ${isPreview ? 'preview' : ''} ${compact ? 'compact' : ''}`}
      key={promptID}
    >
      <div className="left-side">
        <div
          className={`main-icon-container ${isPreview ? 'preview' : ''}`}
          onClick={onPromptClick}
        >
          <i className={`${categoryIcon} main-icon`} />
          <i className="fas fa-copy" />
        </div>
        {
          myUser && !isPreview && 
          <i
            className={`fa${isBookmarked ? 's' : 'r'} fa-bookmark bookmark-icon`}
            onClick={toggleBookmarkPrompt}
          />
        }
      </div>
      <div className="main-prompt-content">
        <Link
          to={!isPreview && !submissionStatus ? `/prompts/${promptID}` : submissionStatus ? `/dashboard/prompt-preview/${promptID}` : ''}
          className="text-content"
        >
          <h6>{short}</h6>
          <p>{truncateText(text, !compact ? 165 : 70)}</p>
        </Link>
        {submissionStatus && <small className="submission-status">Status: <span>{submissionStatus}</span></small>}
      </div>
    </div>
  )
}
