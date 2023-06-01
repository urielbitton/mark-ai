import React, { useEffect, useState } from 'react'
import { AppInput, AppReactSelect } from "../ui/AppInputs"
import { noWhiteSpaceChars } from "app/utils/generalUtils"
import { useLocation, useNavigate } from "react-router-dom"

export default function NavSearch() {

  const [searchString, setSearchString] = useState('')
  const [selectedType, setSelectedType] = useState('tools')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = () => {
    if (noWhiteSpaceChars(searchString) < 1) return
    if(selectedType === 'prompts') {
      return navigate(`/search/prompts?q=${searchString}`)
    }
    return navigate(`/search?q=${searchString}`)
  }

  const searchTypes = [
    { value: 'tools', icon: 'fas fa-flask', color: 'var(--primary)' },
    { value: 'prompts', icon: 'fas fa-comment-dots', color: 'var(--primary)' },
  ]

  useEffect(() => {
    setSearchString('')
  }, [location])

  return (
    <div className="nav-search-bar">
      <AppInput
        placeholder="Search"
        value={searchString}
        onChange={e => setSearchString(e.target.value)}
        iconright={searchString ? <i className="fal fa-times" /> : <i className="fal fa-search" />}
        onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
      />
      <div className="search-select">
        <AppReactSelect
          value={selectedType}
          onChange={(val) => setSelectedType(val.value)}
          options={searchTypes}
          hideDropdownArrow
          placeholder={
            <div className="input-placeholder">
              <i className={searchTypes.find((cat) => cat.value === selectedType)?.icon} />
            </div>
          }
          selectStyles={{
            control: (base) => ({
              ...base,
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '10px',
              color: '#fff',
              boxShadow: 'none',
              background: 'none',
              cursor: 'pointer',
              "&:hover": {
                border: '1px solid #fff',
              }
            }),
            option: (base, state) => ({
              ...base,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              color: 'var(--primary)',
              "&:hover": {
                background: 'var(--inputBg)'
              },
              background: state.isSelected ? 'var(--inputBg)' : '#fff',
            })
          }}
        />
      </div>
    </div>
  )
}
