import React, { useContext, useEffect, useState } from 'react'
import './styles/PromptPage.css'
import IconContainer from "app/components/ui/IconContainer"
import { useChatPrompt } from "app/hooks/aitoolsHooks"
import { Link, useNavigate, useParams } from "react-router-dom"
import { copyToClipboard } from "app/utils/generalUtils"
import AILoader from "app/components/ui/AILoader"
import { infoToast, successToast } from "app/data/toastsTemplates"
import { StoreContext } from "app/store/store"
import AppButton from "app/components/ui/AppButton"
import {
  deletePromptService, incrementPromptViewsCountService,
  toggleBookmarkPromptService
} from "app/services/aitoolsServices"
import { useUserPromptsBookmarks } from "app/hooks/userHooks"
import { toolsCategoriesData } from "app/data/toolsData"
import { convertClassicDate } from "app/utils/dateUtils"

export default function PromptPage({ previewPrompt = null }) {

  const { setToasts, isAdmin, myUserID, isPro, isUserVerified } = useContext(StoreContext)
  const [loading, setLoading] = useState(true)
  const [iconHover, setIconHover] = useState(false)
  const [iconClicked, setIconClicked] = useState(false)
  const promptID = useParams().promptID
  const prompt = useChatPrompt(promptID, setLoading) || previewPrompt
  const navigate = useNavigate()
  const userBookmarks = useUserPromptsBookmarks(myUserID)
  const isBookmarked = userBookmarks.includes(promptID)
  const reachedBookmarkLimit = userBookmarks.length >= 50 && !isPro
  const categoryIcon = toolsCategoriesData?.find(cat => cat.value === prompt?.category)?.icon
  const isPromptSubmitter = myUserID && myUserID === prompt?.submitterID

  const tagsList = prompt?.tags?.map((tag, index) => {
    return <small
      key={index}
      className="tag"
    >
      <Link to={`/search/prompts?tag=${tag}`}>
        {index === 0 ? tag : `, ${tag}`}
      </Link>
    </small>
  })

  const handleCopyText = () => {
    setIconClicked(true)
    copyToClipboard(prompt.text)
      .then(() => {
        setToasts(successToast("Prompt copied to clipboard!"))
        setTimeout(() => setIconClicked(false), 3000)
      })
  }

  const handleDeletePrompt = () => {
    const confirm = window.confirm("Are you sure you want to delete this prompt?")
    if (!confirm) return
    deletePromptService(promptID, setLoading, setToasts)
      .then(() => {
        navigate("/admin/library/prompts")
      })
  }

  const handleEditPrompt = () => {
    if (isAdmin) {
      navigate(`/admin/add-new/prompt?promptID=${promptID}&edit=true`)
    }
    else {
      navigate(`/dashboard/new-prompt?promptID=${promptID}&edit=true`)
    }
  }

  const toggleBookmarkPrompt = () => {
    if (!isUserVerified) return setToasts(infoToast('Please verify your account to bookmark prompts.', true))
    if (!myUserID) return setToasts(infoToast("You must be logged in to bookmark prompts."))
    if (!isBookmarked && reachedBookmarkLimit) {
      setToasts("You can bookmark up to 50 prompts. Upgrade your account to unlock unlimited bookmarking.")
      return navigate("/my-account/upgrade")
    }
    toggleBookmarkPromptService(promptID, myUserID, isBookmarked, setToasts)
  }

  const handlePageViews = () => {
    if (previewPrompt) return
    const viewedPrompts = localStorage.getItem('viewedPrompts')
    const viewedPromptsArray = viewedPrompts ? JSON.parse(viewedPrompts) : []
    if (!viewedPromptsArray.includes(promptID)) {
      incrementPromptViewsCountService(promptID)
        .then(() => {
          localStorage.setItem('viewedPrompts', JSON.stringify([...viewedPromptsArray, promptID]))
        })
    }
  }

  useEffect(() => {
    handlePageViews()
  }, [])

  return prompt && !loading ? (
    <div className="prompt-page">
      <IconContainer
        icon={iconClicked ? "fas fa-check" : !iconHover ? categoryIcon : "fas fa-copy"}
        dimensions={100}
        iconSize={32}
        bgColor="var(--primaryGradient)"
        iconColor="#fff"
        onClick={handleCopyText}
        onHover={(value) => setIconHover(value)}
      />
      <h4>{prompt.category.replaceAll('-', ' ')}</h4>
      <h5 className="short">{prompt.short}</h5>
      <div
        className="prompt-bubble"
        onClick={handleCopyText}
      >
        <p>{prompt.text}</p>
      </div>
      <div className="text-info">
        <h5><i className="fas fa-hashtag" />Tags</h5>
        <p>{prompt.tags ? tagsList : 'No Tags'}</p>
        <h6 className="views">
          <i className="fas fa-eye" />
          {!previewPrompt ? prompt.views : 0} views
        </h6>
        {
          !previewPrompt ?
            <h6 className="date">
              Added: {convertClassicDate(prompt.dateAdded?.toDate())}
            </h6>
            :
            <h6 className="date">
              Submitted: {convertClassicDate(prompt.dateSubmitted?.toDate())}
            </h6>
        }
        {
          !previewPrompt &&
          <AppButton
            label={!isBookmarked ? "Bookmark Prompt" : 'Remove Bookmark'}
            onClick={toggleBookmarkPrompt}
            buttonType={!isBookmarked ? "outlineBtn" : "primaryBtn"}
            rightIcon={`fa${isBookmarked ? 's' : 'r'} fa-bookmark`}
          />
        }
      </div>
      {
        isAdmin &&
        <div className="btn-group">
          <AppButton
            label="Edit Prompt"
            onClick={handleEditPrompt}
          />
          <AppButton
            label="Delete Prompt"
            onClick={handleDeletePrompt}
            buttonType="outlineRedBtn"
          />
        </div>
      }
    </div>
  ) :
    loading ?
      <AILoader /> :
      null
}
