import React from 'react'
import './styles/AppTabsBar.css'

export default function AppTabsBar(props) {

  const { children, sticky, className='', noSpread, gap, 
    fullSpace, noBorder } = props

  return (
    <div 
      className={`app-tabs-bar ${sticky ? 'sticky' : ''} `+
      `${noSpread ? 'no-spread' : ''} `+
      `${noBorder ? 'no-border' : ''} `+
      `${fullSpace ? 'full-space' : ''} `+
      `${className}`}
      style={{gap}}
    >
      {children}
    </div>
  )
}
