import React, { useEffect, useState } from 'react'
import { AppInput } from "../ui/AppInputs"
import { noWhiteSpaceChars } from "app/utils/generalUtils"
import { useLocation, useNavigate } from "react-router-dom"

export default function NavSearch() {

  const [searchString, setSearchString] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = () => {
    if (noWhiteSpaceChars(searchString) < 1) return
    navigate(`/search?q=${searchString}`)
  }

  useEffect(() => {
    setSearchString('')
  },[location])

  return (
    <div className="nav-search-bar">
      <AppInput
        placeholder="Search"
        value={searchString}
        onChange={e => setSearchString(e.target.value)}
        iconright={searchString ? <i className="fal fa-times" /> : <i className="fal fa-search" />}
        onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
      />
    </div>
  )
}
