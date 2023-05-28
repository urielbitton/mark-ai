import React from 'react'
import './styles/TabSwitcher.css'

export default function TabSwitcher(props) {

  const { tabs, activeTab, onTabClick } = props

  const tabsRender = tabs?.map((tab, index) => {
    return <div 
      key={index}
      className={`tab-item ${activeTab.index === index ? 'active' : ''}`}
      onClick={() => onTabClick(tab, index)}
    >
      <h6>{tab.label}</h6>
    </div>
  })

  return (
    <div className="tab-switcher">
      {tabsRender}
      <div 
        className="tab-indicator" 
        style={{ left: `${activeTab.index * 120}px` }} 
      />
    </div>
  )
}
