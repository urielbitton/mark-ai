import React, { useContext, useState } from 'react'
import './styles/PromptPage.css'
import IconContainer from "app/components/ui/IconContainer"
import { useChatPrompt } from "app/hooks/aitoolsHooks"
import { useNavigate, useParams } from "react-router-dom"
import { copyToClipboard } from "app/utils/generalUtils"
import AILoader from "app/components/ui/AILoader"
import { successToast } from "app/data/toastsTemplates"
import { StoreContext } from "app/store/store"
import AppButton from "app/components/ui/AppButton"
import { deletePromptService, toggleBookmarkPromptService } from "app/services/aitoolsServices"
import { useUserPromptsBookmarks } from "app/hooks/userHooks"
import { toolsCategoriesData } from "app/data/toolsData"

export default function PromptPage() {

  const { setToasts, isAdmin, myUserID, myUserType } = useContext(StoreContext)
  const [loading, setLoading] = useState(true)
  const [iconHover, setIconHover] = useState(false)
  const [iconClicked, setIconClicked] = useState(false)
  const promptID = useParams().promptID
  const prompt = useChatPrompt(promptID, setLoading)
  const navigate = useNavigate()
  const userBookmarks = useUserPromptsBookmarks(myUserID)
  const isBookmarked = userBookmarks.includes(promptID)
  const isProMember = myUserType === "pro" || myUserType === "admin"
  const reachedBookmarkLimit = userBookmarks.length >= 50 && !isProMember
  const categoryIcon = toolsCategoriesData?.find(cat => cat.value === prompt?.category)?.icon

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

  const toggleBookmarkPrompt = () => {
    if(!isBookmarked && reachedBookmarkLimit) {
      setToasts("You can bookmark up to 50 prompts. Upgrade your account to unlock unlimited bookmarking.")
      return navigate("/my-account/upgrade")
    }
    toggleBookmarkPromptService(promptID, myUserID, isBookmarked, setToasts)
  }

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
      <h4>{prompt.category}</h4>
      <div 
        className="prompt-bubble"
        onClick={handleCopyText}
      >
        <p>{prompt.text}</p>
      </div>
      <div className="text-info">
        <h5><i className="fas fa-hashtag"/>Tags</h5>
        <p>{prompt.tags ? prompt.tags.join(", ") : 'No Tags'}</p>
        <AppButton
          label={!isBookmarked ? "Bookmark Prompt" : 'Remove Bookmark'}
          onClick={toggleBookmarkPrompt}
          buttonType={!isBookmarked ? "outlineBtn" : "primaryBtn"}
          rightIcon={`fa${isBookmarked ? 's' : 'r'} fa-bookmark`}
        />
      </div>
      {
        isAdmin &&
        <div className="btn-group">
          <AppButton
            label="Edit Prompt"
            onClick={() => navigate(`/admin/add-new/prompt?promptID=${promptID}&edit=true`)}
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
