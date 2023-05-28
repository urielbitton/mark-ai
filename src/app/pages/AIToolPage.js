import React, { useContext, useEffect, useState } from 'react'
import './styles/AIToolPage.css'
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAITool } from "app/hooks/aitoolsHooks"
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
  updateUserToolRatingService
} from "app/services/aitoolsServices"
import { errorToast, successToast } from "app/data/toastsTemplates"
import { useDocsCount } from "app/hooks/userHooks"
import ItemNotFound from "app/components/ui/ItemNotFound"
import notFoundImg from "app/assets/images/item-not-found.png"
import { toolsTypesData } from "app/data/toolsData"
import { formatViewsNumber } from "app/utils/generalUtils"
import { v4 as uuidv4 } from 'uuid'

export default function AIToolPage({ previewTool = null }) {

  const { myUser, myUserID, setToasts, isAdmin,
    setPageLoading, toolsUID } = useContext(StoreContext)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState(null)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [ratingLoading, setRatingLoading] = useState(false)
  const toolID = useParams().toolID
  const aitool = useAITool(toolID, setLoading) || previewTool
  const ratingsCount = useDocsCount(`aitools/${toolID}/ratings`)
  const toolRating = ratingsCount ? (aitool?.rating / ratingsCount) : 0
  const allImages = aitool ? [aitool?.mainImg, ...aitool?.images] : []
  const navigate = useNavigate()
  const isToolSubmitter = myUserID && myUserID === aitool?.submitterID

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
    if(isAdmin) {
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

  useEffect(() => {
    if(!toolsUID) {
      incrementToolViewsCountService(toolID)
      .then(() => {
        localStorage.setItem('toolsUID', uuidv4())
      })
    }
  },[])

  return !loading && aitool ? (
    <div className="aitool-page">
      <div className="tool-container">
        <div
          className="tool-header"
          style={{ backgroundImage: `url(${aitool.mainImg})` }}
        />
        <div className="tool-content">
          <div className="row">
            <div className="row-item">
              <img
                src={aitool.logo}
                alt="logo"
                className="logo"
              />
              <h1>{aitool.title}</h1>
              <h5>{aitool.tagline}</h5>
            </div>
            <div className="ratings-colors row-item">
              {
                !previewTool &&
                <div className="ratings">
                  <big>{toolRating.toFixed(1)}</big>
                  <Ratings rating={toolRating} />
                  {
                    myUser &&
                    <AppButton
                      label="Rate"
                      buttonType="lightBtn"
                      onClick={() => setShowRatingModal(true)}
                    />
                  }
                </div>
              }
              <div className="colors">
                <div
                  className="color-item"
                  style={{ backgroundColor: aitool.color1 }}
                />
                <div
                  className="color-item"
                  style={{ backgroundColor: aitool.color2 }}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="row-item">
              <h6>Views</h6>
              <p>{formatViewsNumber(aitool.views)}</p>
            </div>
            <div className="row-item">
              <h6>Description</h6>
              <p>{aitool.shortDescription}</p>
            </div>
          </div>
          <div className="row">
            <div className="row-item">
              <h6>Category</h6>
              <p className="cap">{aitool.category}</p>
            </div>
            <div className="row-item">
              <h6>Website URL</h6>
              <a
                href={`https://${extractDomainFromURL(aitool.url)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="far fa-external-link" />
                {extractDomainFromURL(aitool.url)}
              </a>
            </div>
          </div>
          <div className="row">
            <div className="row-item">
              <h6>Type</h6>
              <p className="cap">
                <i className={toolsTypesData.find((type) => type.value === aitool.type).icon} />&nbsp;&nbsp;
                {aitool.type === 'ai' ? 'AI' : aitool.type}
              </p>
            </div>
            <div className="row-item">
              <h6>Tags</h6>
              <p>{tagsList}</p>
            </div>
          </div>
          <div className="row">
            <div className="row-item">
              <h6>{!previewTool ? 'Date Added' : 'Date Submitted'}</h6>
              <p>{convertClassicDate(!previewTool ? aitool.dateAdded.toDate() : aitool.dateSubmitted.toDate())}</p>
            </div>
            <div className="row-item">
              <h6>Date Created</h6>
              <p>{convertClassicDate(aitool.dateCreated.toDate())}</p>
            </div>
          </div>
          <div className="imgs-flex">
            <h4>Images</h4>
            {imgsList}
          </div>
        </div>
      </div>
      <PhotoModal
        img={selectedImg}
        onClose={() => setSelectedImg(null)}
        showModal={selectedImg !== null}
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
        />
      </div>
      {
        (isAdmin || isToolSubmitter) &&
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
