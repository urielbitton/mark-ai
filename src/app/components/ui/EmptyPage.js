import React from 'react'
import './styles/EmptyPage.css'
import AppButton from "./AppButton"
import PageLoader from "./PageLoader"

export default function EmptyPage(props) {

  const { img, label, sublabel, btnLabel='Add', btnLink,
  btnClick, btnIcon, object, iconImg } = props

  return !object && object !== null ? (
    <div className="empty-page">
      {
        img ?
        <img src={img} alt="no-results" /> :
        iconImg ? 
        <i className={iconImg} /> : 
        null
      }
      <h5>{label}</h5>
      <p>{sublabel}</p>
      {
        (btnLink || btnClick) &&
        <AppButton
          label={btnLabel}
          url={btnLink}
          onClick={btnClick}
          buttonType="tabActiveBtn"
          rightIcon={btnIcon}
        />
      }
    </div>
  ) :
  <PageLoader loading={!object}/>
}
