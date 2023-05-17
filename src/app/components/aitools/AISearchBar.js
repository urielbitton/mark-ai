import React from 'react'
import AppButton from "../ui/AppButton"
import './styles/AISearchBar.css'

export default function AISearchBar({placeholder, value, onChange, onKeyUp, 
  onSubmit, btnLabel}) {

  return (
    <div className="ai-searchbar">
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyUp={onKeyUp}
      />
      <AppButton
        label={btnLabel}
        onClick={onSubmit}
      />
    </div>
  )
}
