import AppSearchBar from "app/components/ui/AppSearchBar"
import AIToolsSearchHits from "app/components/aitools/AIToolsSearchHits"
import AppPagination from "app/components/ui/AppPagination"
import React, { useEffect, useState } from 'react'
import { useSearchParams } from "react-router-dom"
import './styles/SearchPage.css'
import { noWhiteSpaceChars } from "app/utils/generalUtils"
import noDataImg from "app/assets/images/no-data.png"
import AppButton from "app/components/ui/AppButton"

export default function SearchPage() {

  const [searchString, setSearchString] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [numOfHits, setNumOfHits] = useState(0)
  const [numOfPages, setNumOfPages] = useState(0)
  const [pageNum, setPageNum] = useState(0)
  const [hitsPerPage, setHitsPerPage] = useState(20)
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q')
  const urlTagQuery = searchParams.get('tag')
  const urlCategoryQuery = searchParams.get('category')
  const filters = urlCategoryQuery ? `category: ${urlCategoryQuery}` : urlTagQuery ? `tags:${urlTagQuery}` : ''
  const noResults = numOfHits === 0 && noWhiteSpaceChars(searchQuery) > 0

  const submitSearch = () => {
    setSearchQuery(searchString)
    setSearchParams({ q: searchString }) 
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
    <div className="search-page">
      <div className="titles">
        <h1 className="gradient-text">Tools Search</h1>
      </div>
      <div className="search-container">
        <AppSearchBar
          placeholder="Search by name, category, or tag..."
          btnLabel="Search"
          onChange={(e) => setSearchString(e.target.value)}
          value={searchString}
          onKeyUp={(e) => e.key === 'Enter' && submitSearch()}
          onSubmit={submitSearch}
          onClear={clearInput}
        />
      </div>
      <div className="search-info">
        {
          (searchQuery.length > 0 || urlCategoryQuery || urlTagQuery) &&
          <div className="search-stats">
            <h4>Search: <span>"{searchQuery}"</span></h4>
            <h5>
              {numOfHits} result{numOfHits !== 1 ? 's' : ''} found
              {
                urlCategoryQuery ?
                  <span> in <span className="category tag">"{urlCategoryQuery}"</span></span> :
                  urlTagQuery ? 
                    <span> with tag <span className="tag">"{urlTagQuery}"</span></span> :
                    null
              }
            </h5>
            {
              urlCategoryQuery &&
              <AppButton
                label="Clear category"
                onClick={() => clearCategory()}
              />
            }
          </div>
        }
      </div>
      <AIToolsSearchHits
        query={searchQuery}
        filters={filters}
        setNumOfHits={setNumOfHits}
        setNumOfPages={setNumOfPages}
        pageNum={pageNum}
        hitsPerPage={hitsPerPage}
        loading={loading}
        setLoading={setLoading}
        showAll={urlTagQuery || urlCategoryQuery}
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
