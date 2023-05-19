import React from 'react'
import './styles/ItemNotFound.css'
import AppButton from "./AppButton"

export default function ItemNotFound(props) {

  const { img, label, sublabel, btnLabel='Add', btnLink,
  btnClick, btnIcon, iconImg } = props

  return (
    <div className="item-not-found">
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
  ) 
}
