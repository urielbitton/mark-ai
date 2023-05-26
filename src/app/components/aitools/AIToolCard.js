import React, { useContext } from 'react'
import './styles/AIToolCard.css'
import { Link, useNavigate } from "react-router-dom"
import Avatar from "../ui/Avatar"
import { beautifyUrl, formatViewsNumber, truncateText } from "app/utils/generalUtils"
import { StoreContext } from "app/store/store"
import { toggleBookmarkToolService } from "app/services/aitoolsServices"
import { infoToast } from "app/data/toastsTemplates"
import { useUserToolsBookmarks } from "app/hooks/userHooks"

export default function AIToolCard(props) {

  const { myUser, myUserID, setToasts } = useContext(StoreContext)
  const { toolID = '0', title, mainImg, tagline, logo,
    url, category, type, views } = props.tool
  const { isPreview, submission, submissionStatus, compact } = props
  const navigate = useNavigate()
  const userBookmarks = useUserToolsBookmarks(myUserID)
  const isBookmarked = userBookmarks.includes(toolID)
  const isAIType = type === 'ai'

  const Image = React.memo(() => {
    return <img
      src={mainImg}
      alt={title}
      width="100%"
      height={150}
    />
  })

  const handleBookmarkClick = () => {
    if (isPreview) return
    if (myUser) {
      toggleBookmarkToolService(
        toolID,
        myUserID,
        isBookmarked,
        setToasts
      )
    }
    else {
      navigate('/login')
      setToasts(infoToast("Please login to bookmark tools"))
    }
  }

  return (
    <div
      className={`ai-card ${compact ? 'compact' : ''}`}
      key={toolID}
    >
      <Link
        to={!isPreview && !submission ? `/ai-tools/${toolID}` : submission ? `/dashboard/tool-preview/${toolID}` : ''}
        className="img-container"
      >
        <Image />
      </Link>
      <div className="info-content">
        <div className="top-row">
          <Avatar
            src={logo}
            dimensions={27}
          />
          <div className="category-container">
            <i className={isAIType ? 'fas fa-robot' : 'fas fa-flask'} />
            <small onClick={() => navigate(`/search?q=${category}`)}>
              {category}
            </small>
          </div>
        </div>
        <h5>
          <Link to={!isPreview && !submission ? `/ai-tools/${toolID}` : submission ? `/dashboard/tool-preview/${toolID}` : ''}>
            {truncateText(title, 25)}
          </Link>
        </h5>
        <p>{truncateText(tagline, 73)}</p>
        <div className="bottom-bar">
          <small>
            <i className="fas fa-external-link-alt" />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {truncateText(beautifyUrl(url), 30)}
            </a>
          </small>
          <div className="right">
            <div className="views-container">
              <small>{formatViewsNumber(views)}</small>
              <i className="fas fa-eye" />
            </div>
            {
              submission ?
                <small className="status">Status: <span>{submissionStatus}</span></small> :
                <i
                  className={`fa${isBookmarked ? 's' : 'r'} fa-bookmark`}
                  onClick={handleBookmarkClick}
                />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
