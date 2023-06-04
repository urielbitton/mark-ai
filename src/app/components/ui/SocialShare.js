// @ts-nocheck
import React from 'react'
import { EmailShareButton, FacebookShareButton,
  LinkedinShareButton, PinterestShareButton,
  RedditShareButton, TelegramShareButton,
  TumblrShareButton, TwitterShareButton,
  WhatsappShareButton, PocketShareButton
} from "react-share"
import './styles/SocialShare.css'

export default function SocialShare({url, title=''}) {
  return (
    <div className="social-share-container">
      <h4>{title}</h4>
      <div className="share-flex">
        <EmailShareButton url={url} style={{background: 'var(--primary)'}}>
          <i className="fas fa-envelope" />
        </EmailShareButton>
        <FacebookShareButton url={url} style={{background: '#1778F2'}}>
          <i className="fab fa-facebook-f" />
        </FacebookShareButton>
        <TwitterShareButton url={url} style={{background: '#1DA1F2'}}>
          <i className="fab fa-twitter" />
        </TwitterShareButton>
        <LinkedinShareButton url={url} style={{background: '#0077B5'}}>
          <i className="fab fa-linkedin-in" />
        </LinkedinShareButton>
        <PinterestShareButton url={url} style={{background: '#E60023'}}>
          <i className="fab fa-pinterest-p" />
        </PinterestShareButton>
        <RedditShareButton url={url} style={{background: '#FF4500'}}>
          <i className="fab fa-reddit-alien" />
        </RedditShareButton>
        <TelegramShareButton url={url} style={{background: '#0088cc'}}>
          <i className="fab fa-telegram-plane" />
        </TelegramShareButton>
        <TumblrShareButton url={url} style={{background: '#35465C'}}>
          <i className="fab fa-tumblr" />
        </TumblrShareButton>
        <WhatsappShareButton url={url} style={{background: '#25D366'}}>
          <i className="fab fa-whatsapp" />
        </WhatsappShareButton>
        <PocketShareButton url={url} style={{background: '#EF4056'}}>
          <i className="fab fa-get-pocket" />
        </PocketShareButton>
      </div>
    </div>
  )
}
