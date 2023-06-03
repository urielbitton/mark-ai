import React, { useContext, useEffect, useState } from 'react'
import './styles/AIToolPage.css'
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAITool, useToolsByTypeAndCategory } from "app/hooks/aitoolsHooks"
import AILoader from "app/components/ui/AILoader"
import { convertClassicDate } from "app/utils/dateUtils"
import { extractDomainFromURL } from "app/utils/generalUtils"
import PhotoModal from "app/components/ui/PhotoModal"
import Ratings from "app/components/ui/Ratings"
import { StoreContext } from "app/store/store"
import AppButton from "app/components/ui/AppButton"
import StarRate from "app/components/ui/StarRate"
import {
  addUserToolRatingService,
  checkUserToolRatingService,
  deleteAIToolService,
  incrementToolViewsCountService,
  toggleBookmarkToolService,
  updateUserToolRatingService
} from "app/services/aitoolsServices"
import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import { useDocsCount, useUserToolsBookmarks } from "app/hooks/userHooks"
import ItemNotFound from "app/components/ui/ItemNotFound"
import notFoundImg from "app/assets/images/item-not-found.png"
import { toolsCategoriesData, toolsTypesData } from "app/data/toolsData"
import { formatViewsNumber } from "app/utils/generalUtils"
import AppScrollSlider from "app/components/ui/AppScrollSlider"
import AIToolCard from "app/components/aitools/AIToolCard"

export default function AIToolPage({ previewTool = null }) {

  const { myUser, myUserID, setToasts, isAdmin,
    setPageLoading, isUserVerified } = useContext(StoreContext)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState(null)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [ratingLoading, setRatingLoading] = useState(false)
  const [similarsLimit, setSimilarsLimit] = useState(5)
  const toolID = useParams().toolID
  const aitool = useAITool(toolID, setLoading) || previewTool
  const similarTools = useToolsByTypeAndCategory(aitool?.type, aitool?.category, similarsLimit, setLoading)
  const ratingsCount = useDocsCount(`aitools/${toolID}/ratings`)
  const toolRating = ratingsCount ? (aitool?.rating / ratingsCount) : 0
  const allImages = aitool ? [aitool?.mainImg, ...aitool?.images] : []
  const navigate = useNavigate()
  const userBookmarks = useUserToolsBookmarks(myUserID)
  const isBookmarked = userBookmarks.includes(toolID)

  const imgsList = allImages?.map((img, index) => {
    return <img
      key={index}
      src={img}
      alt={`img-${index}`}
      onClick={() => setSelectedImg(img)}
    />
  })

  const tagsList = aitool?.tags?.map((tag, index) => {
    return <small
      key={index}
      className="tag"
    >
      <Link to={`/search?tag=${tag}`}>
        {index === 0 ? tag : `, ${tag}`}
      </Link>
    </small>
  })

  const similarToolsList = similarTools
  ?.filter((tool) => tool?.toolID !== toolID)
  .map((tool, index) => {
    return <AIToolCard 
      key={index}
      tool={tool}
    />
  })

  const submitRating = () => {
    if (previewTool) return setToasts(errorToast("You can't rate a non approved tool."))
    setRatingLoading(true)
    checkUserToolRatingService(aitool.toolID, myUserID)
      .then((userRating) => {
        if (userRating) {
          updateUserToolRatingService(aitool.toolID, myUserID, userRating.rating, selectedRating)
            .then(() => {
              setRatingLoading(false)
              setToasts(successToast("Rating updated successfully"))
              setShowRatingModal(false)
            })
            .catch((error) => {
              console.log(error)
              setRatingLoading(false)
              setToasts(errorToast("Error updating rating"))
            })
        }
        else {
          addUserToolRatingService(aitool.toolID, myUserID, selectedRating)
            .then(() => {
              setRatingLoading(false)
              setToasts(successToast("Rating added successfully"))
              setShowRatingModal(false)
            })
            .catch((error) => {
              console.log(error)
              setRatingLoading(false)
              setToasts(errorToast("Error adding rating"))
            })
        }
      })
      .catch((error) => {
        console.log(error)
        setRatingLoading(false)
      })
  }

  const handleEditTool = () => {
    if (isAdmin) {
      navigate(`/admin/add-new/tool?toolID=${toolID}&edit=true`)
    }
    else {
      aitool?.type === 'ai' ?
        navigate(`/dashboard/new-ai-tool?toolID=${toolID}&edit=true`) :
        navigate(`/dashboard/new-online-tool?toolID=${toolID}&edit=true`)
    }
  }

  const handleDeleteTool = () => {
    const confirm = window.confirm("Are you sure you want to delete this tool?")
    if (!confirm) return
    deleteAIToolService(toolID, setPageLoading, setToasts)
      .then(() => {
        navigate("/admin/library")
      })
  }

  const handleBookmarkTool = () => {
    if (!isUserVerified) return setToasts(infoToast('Please verify your account to bookmark tools.', true))
    if (myUser) {
      toggleBookmarkToolService(
        toolID,
        myUserID,
        isBookmarked,
        setToasts
      )
    }
    else {
      navigate('/login')
      setToasts(infoToast("Please login to bookmark tools"))
    }
  }

  const handlePageViews = () => {
    if (previewTool) return
    const viewedTools = localStorage.getItem('viewedTools')
    const viewedToolsArray = viewedTools ? JSON.parse(viewedTools) : []
    if (!viewedToolsArray.includes(toolID)) {
      incrementToolViewsCountService(toolID)
        .then(() => {
          localStorage.setItem('viewedTools', JSON.stringify([...viewedToolsArray, toolID]))
        })
    }
  }

  useEffect(() => {
    handlePageViews()
  }, [])

  return !loading && aitool ? (
    <div className="aitool-page">
      <div className="tool-container">
        <div
          className="tool-header"
          style={{ backgroundImage: `url(${aitool.mainImg})` }}
        />
        <div className="tool-content">
          <div className="row header">
            <div className="row-item left-row">
              <img
                src={aitool.logo}
                alt="logo"
                className="logo"
              />
              <div className="texts">
                <h1>{aitool.title}</h1>
                <h5>{aitool.tagline}</h5>
                {
                  <AppButton
                    label={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                    leftIcon={`fa${isBookmarked ? 's' : 'r'} fa-bookmark`}
                    onClick={!previewTool ? handleBookmarkTool : null}
                  />
                }
              </div>
            </div>
            <div className="right-row">
              <a
                href={`https://${extractDomainFromURL(aitool.url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="url-link"
              >
                <i className="far fa-external-link" />
                {extractDomainFromURL(aitool.url)}
              </a>
              <div className="btns">
                <AppButton
                  label="Share"
                  leftIcon="far fa-share-alt"
                  buttonType="invertedBtn"
                />
                {
                  myUser &&
                  <AppButton
                    label="Rate"
                    onClick={() => setShowRatingModal(true)}
                    leftIcon="far fa-star"
                  />
                }
              </div>
            </div>
          </div>
          <div className="stats-section section">
            <div className="stats-item">
              <h6>{ratingsCount} Ratings</h6>
              <big>{toolRating.toFixed(1)}</big>
              <Ratings rating={toolRating} />
            </div>
            <div className="stats-item">
              <h6>Views</h6>
              <big>{formatViewsNumber(aitool.views)}</big>
              <small>Page Views</small>
            </div>
            <div className="stats-item">
              <h6>Type</h6>
              <big>
                <i className={toolsTypesData.find((type) => type.value === aitool.type).icon} />
              </big>
              <small className="cap">{aitool.type === 'ai' ? 'AI' : aitool.type}</small>
            </div>
            <div className="stats-item">
              <h6>Category</h6>
              <big>
                <i className={toolsCategoriesData.find((category) => category.value === aitool.category).icon} />
              </big>
              <small className="cap">{aitool.category.replaceAll('-', ' ')}</small>
            </div>
          </div>
          <div className="preview-section section">
            <h4 className="section-title">Preview</h4>
            <AppScrollSlider gap={10}>
              {imgsList}
            </AppScrollSlider>
          </div>
          <div className="description-section section">
            <h4 className="section-title">Description</h4>
            <p>{aitool.shortDescription}</p>
          </div>
          {
            aitool.features &&
            <div className="features-section section">
              <h4 className="section-title">Features</h4>
            </div>
          }
          <div className="information-section section">
            <h4 className="section-title">Information</h4>
            <div className="row">
              <div className="row-item">
                <h6>Tags</h6>
                <p className="tags">{tagsList}</p>
              </div>
              <div className="row-item">
                <h6>Paid</h6>
                <p>{aitool.isPaid ? 'Yes' : 'No'}</p>
              </div>
            </div>
            <div className="row">
              <div className="row-item">
                <h6>Date Created</h6>
                <p>{convertClassicDate(aitool.dateCreated.toDate())}</p>
              </div>
              <div className="row-item">
                <h6>{!previewTool ? 'Date Added' : 'Date Submitted'}</h6>
                <p>{convertClassicDate(!previewTool ? aitool.dateAdded.toDate() : aitool.dateSubmitted.toDate())}</p>
              </div>
            </div>
          </div>
          <div className="similar-section section">
            <h4 className="section-title">Similar Tools</h4>
            <AppScrollSlider gap={15}>
              {similarToolsList}
            </AppScrollSlider>
          </div>
        </div>
      </div>
      <PhotoModal
        img={selectedImg}
        onClose={() => setSelectedImg(null)}
        showModal={selectedImg !== null}
        slideshow={[aitool.mainImg, ...aitool.images]}
        slideShowIndex={[aitool.mainImg, ...aitool.images].indexOf(selectedImg)}
      />
      <div className={`ratings-modal ${showRatingModal ? 'show' : ''}`}>
        <i
          className="fal fa-times"
          onClick={() => setShowRatingModal(false)}
        />
        <div className="big-star">
          <i className="fas fa-star" />
          <big>{selectedRating}</big>
        </div>
        <h4>Rate {aitool.title}</h4>
        <StarRate
          rating={selectedRating}
          setRating={setSelectedRating}
          numOfStars={5}
        />
        <AppButton
          label="Submit"
          onClick={submitRating}
          loading={ratingLoading}
          buttonType="outlineWhiteBtn"
        />
      </div>
      {
        isAdmin &&
        <div className="btn-group">
          <AppButton
            label="Edit Tool"
            onClick={handleEditTool}
          />
          <AppButton
            label="Delete Tool"
            buttonType="outlineRedBtn"
            onClick={handleDeleteTool}
          />
        </div>
      }
    </div>
  ) :
    loading ?
      <div className="aitool-page loading">
        <AILoader />
      </div> :
      <ItemNotFound
        img={notFoundImg}
        label="Tool not found"
        sublabel="The tool or website you are looking for does not exist."
        btnLabel="All Tools"
        btnLink="/ai-tools"
      />
}
