import React from 'react'
import './styles/AppTable.css'

export default function AppTable(props) {

  const { headers, rows } = props

  const headersRender = headers?.map((header, index) => {
    return <h5
      key={index}
      className={`header-item ${header.small ? 'small' : ''}`}
    >
      {header.label}
    </h5>
  })

  return (
    <div className="app-table-container">
      <div className="app-table">
        <div className="headers">
          {headersRender}
        </div>
        <div className="rows">
          {rows}
        </div>
      </div>
    </div>
  )
}
