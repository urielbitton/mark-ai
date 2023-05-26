import React from 'react'
import './styles/ViewToggler.css'

export default function ViewToggler({ label, viewMode, modes, onClick, themeColor = false }) {

  const modesList = modes?.map((mode, index) => {
    return <div
      key={index}
      className={`mode-item ${viewMode === mode.value ? 'active' : ''}`}
      onClick={() => onClick && onClick(mode)}
    >
      <i className={mode.icon} />
    </div>
  })

  return (
    <div className="view-toggler-container">
      {label && <h6>{label}</h6>}
      <div className={`view-toggler ${themeColor ? 'theme-color' : ''}`}>
        {modesList}
      </div>
    </div>
  )
}
