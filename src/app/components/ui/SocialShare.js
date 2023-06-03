import React from 'react'
import { EmailShareButton, FacebookShareButton,
  LinkedinShareButton, PinterestShareButton,
  RedditShareButton, TelegramShareButton,
  TumblrShareButton, TwitterShareButton,
  WhatsappShareButton, WorkplaceShareButton
} from "react-share"

export default function SocialShare() {
  return (
    <div className="social-share-container">
      <h4>Share On</h4>
      <div className="share-flex">
        <FacebookShareButton url="" />
      </div>
    </div>
  )
}
