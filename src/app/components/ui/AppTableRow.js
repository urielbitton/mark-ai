import React from 'react'
import './styles/AppTableRow.css'

export default function AppTableRow(props) {

  const { cells, handleCheckChange, className='' } = props


  const itemsRender = cells
  ?.filter(item => item !== undefined && item !== null)
  .map((item, index) => {
    return <div
      key={index}
      className="row-item"
    >
      {
        typeof item === 'boolean' ?
          <input
            type="checkbox"
            checked={item}
            onChange={handleCheckChange}
          /> :
          item
      }
    </div>
  })

  return (
    <div className={`app-table-row ${className}`}>
      {itemsRender}
    </div>
  )
}
