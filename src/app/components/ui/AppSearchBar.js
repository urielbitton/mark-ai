import React from 'react'
import AppButton from "./AppButton"
import './styles/AppSearchBar.css'

export default function AppSearchBar({placeholder, value, onChange, onKeyUp, 
  onSubmit, btnLabel, onClear, btnIcon=null}) {

  return (
    <div className="ai-searchbar">
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyUp={onKeyUp}
      />
      { 
        value !== '' && 
        <i 
          className="fal fa-times" 
          onClick={onClear}
        /> 
      }
      <AppButton
        label={btnLabel}
        onClick={onSubmit}
        buttonType="gradientBtn"
        rightIcon={btnIcon}
      />
    </div>
  )
}
