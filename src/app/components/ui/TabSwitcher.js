import React from 'react'
import './styles/TabSwitcher.css'

export default function TabSwitcher(props) {

  const { tabs, activeTab, onTabClick, showIcons, width=120 } = props

  const tabsRender = tabs?.map((tab, index) => {
    return <div 
      key={index}
      className={`tab-item ${activeTab.index === index ? 'active' : ''}`}
      style={{ width }}
      onClick={() => onTabClick(tab, index)}
    >
      { showIcons && <i className={tab.icon}/> }
      <h6>{tab.label}</h6>
    </div>
  })

  return (
    <div className="tab-switcher">
      {tabsRender}
      <div 
        className="tab-indicator" 
        style={{ left: `${activeTab.index * width}px`, width }} 
      />
    </div>
  )
}
