import React, { useContext } from 'react'
import './styles/PromptCard.css'
import { copyToClipboard, truncateText } from "app/utils/generalUtils"
import { Link } from "react-router-dom"
import { StoreContext } from "app/store/store"
import { successToast } from "app/data/toastsTemplates"

export default function PromptCard(props) {

  const { setToasts } = useContext(StoreContext)
  const { prompt, category, promptID } = props.prompt

  const onPromptClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    copyToClipboard(prompt)
    .then(() => {
      setToasts(successToast('Prompt copied to clipboard!'))
    })
  }

  return (
    <Link
      to={`/prompts/${promptID}`}
      className="prompt-card"
      key={promptID}
    >
      <div
        className="icon-content"
        onClick={onPromptClick}
      >
        <i className="fas fa-comment-dots" />
        <i className="fas fa-copy" />
      </div>
      <div className="text-content">
        <h5>{category}</h5>
        <p>{truncateText(prompt, 140)}</p>
      </div>
    </Link>
  )
}
