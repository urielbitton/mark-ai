import React from 'react'
import './styles/AICard.css'
import { Link } from "react-router-dom"
import Avatar from "../ui/Avatar"
import { truncateText } from "app/utils/generalUtils"

export default function AICard(props) {

  const { toolID = '0', title, mainImg, tagline, logo,
    url, category } = props.tool
  const { isPreview } = props

  return (
    <div
      className="ai-card"
      key={toolID}
    >
      <div
        className="img-container"
        style={{ backgroundImage: `url(${mainImg})` }}
      />
      <div className="info-content">
        <div className="top-row">
          <Avatar
            src={logo}
            dimensions={27}
          />
          <small>{category}</small>
        </div>
        <h5>
          <Link to={!isPreview ? `/ai-tools/${toolID}` : ''}>
            {truncateText(title, 25)}
          </Link>
        </h5>
        <p>{truncateText(tagline, 100)}</p>
        <div className="bottom-bar">
          <small>
            <i className="fas fa-external-link-alt" />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {truncateText(url, 30)}
            </a>
          </small>
          <div className="right">
            <i className="far fa-bookmark" />
          </div>
        </div>
      </div>
    </div>
  )
}
