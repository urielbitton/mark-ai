import React from 'react'
import AppButton from "../ui/AppButton"
import './styles/AISearchBar.css'

export default function AISearchBar({placeholder, value, onChange, onKeyUp, 
  onSubmit, btnLabel, onClear}) {

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
      />
    </div>
  )
}
