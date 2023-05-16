import React, { useState } from 'react'
import { AppInput } from "../ui/AppInputs"

export default function NavSearch() {

  const [searchString, setSearchString] = useState('')

  return (
    <div className="nav-search-bar">
      <AppInput
        placeholder="Search"
        value={searchString}
        onChange={e => setSearchString(e.target.value)}
        iconright={searchString ? <i className="fal fa-times"/> : <i className="fal fa-search" />}
      />
    </div>
  )
}
