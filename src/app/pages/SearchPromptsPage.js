import AppSearchBar from "app/components/ui/AppSearchBar"
import AppPagination from "app/components/ui/AppPagination"
import React, { useEffect, useState } from 'react'
import { useSearchParams } from "react-router-dom"
import './styles/SearchPage.css'
import { noWhiteSpaceChars } from "app/utils/generalUtils"
import noDataImg from "app/assets/images/no-data.png"
import PromptsSearchHits from "app/components/aitools/PromptsSearchHits"
import AppButton from "app/components/ui/AppButton"

export default function SearchPromptsPage() {

  const [searchString, setSearchString] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [numOfHits, setNumOfHits] = useState(0)
  const [numOfPages, setNumOfPages] = useState(0)
  const [pageNum, setPageNum] = useState(0)
  const [hitsPerPage, setHitsPerPage] = useState(20)
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q')
  const categoryMode = searchParams.get('category')
  const filters = !categoryMode ? '' : `category: ${categoryMode}`
  const noResults = numOfHits === 0 && noWhiteSpaceChars(searchQuery) > 0

  const submitSearch = () => {
    setSearchQuery(searchString)
  }

  const clearInput = () => {
    setSearchString('')
    setSearchQuery('')
    setSearchParams({})
  }

  const clearCategory = () => {
    setSearchParams({})
    setSearchQuery(searchString)
  }

  useEffect(() => {
    if (urlQuery) {
      setSearchString(urlQuery)
      setSearchQuery(urlQuery)
    }
  }, [])

  return (
    <div className="search-page search-prompts-page">
      <div className="search-section">
        <div className="search-container">
          <AppSearchBar
            placeholder="Search by prompt, category, or tag..."
            btnLabel="Search"
            onChange={(e) => setSearchString(e.target.value)}
            value={searchString}
            onKeyUp={(e) => e.key === 'Enter' && submitSearch()}
            onSubmit={submitSearch}
            onClear={clearInput}
          />
        </div>
        {
          searchQuery.length > 0 &&
          <div className="search-stats">
            <h4>Search: <span>"{searchQuery}"</span></h4>
            <h5>
              {numOfHits} result{numOfHits !== 1 ? 's' : ''} found
              {
                categoryMode ?
                  <span> in <span className="category">{categoryMode}</span></span> :
                  null
              }
            </h5>
            {
              categoryMode &&
              <AppButton
                label="Clear category"
                onClick={() => clearCategory()}
              />
            }
          </div>
        }
      </div>
      <PromptsSearchHits
        query={searchQuery}
        filters={filters}
        setNumOfHits={setNumOfHits}
        setNumOfPages={setNumOfPages}
        pageNum={pageNum}
        hitsPerPage={hitsPerPage}
        loading={loading}
        setLoading={setLoading}
      />
      {
        noResults ?
          <div className="no-results">
            <img
              src={noDataImg}
              alt="No results found"
            />
            <h5>No results found for "{searchQuery}"</h5>
          </div> :
          numOfHits > 0 ?
            <AppPagination
              pageNum={pageNum}
              setPageNum={setPageNum}
              numOfPages={numOfPages}
              dimensions="30px"
            /> :
            null
      }
    </div>
  )
}
