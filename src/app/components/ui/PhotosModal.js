import { infoToast } from "app/data/toastsTemplates"
import { updatePostFileDescriptionService } from "app/services/postsServices"
import { StoreContext } from "app/store/store"
import { convertClassicDateAndTime } from "app/utils/dateUtils"
import { convertBytesToKbMbGb } from "app/utils/fileUtils"
import { sendCursorToEnd } from "app/utils/generalUtils"
import React, { useContext, useEffect, useRef, useState } from 'react'
import AppPortal from "./AppPortal"
import IconContainer from "./IconContainer"
import './styles/PhotosModal.css'

export default function PhotosModal(props) {

  const { myUserID, setToasts } = useContext(StoreContext)
  const { showModal, portalClassName, photos, onClose,
    photosOwnerID, photosDocPath, parentDocID, slideIndex,
    photosNum, currentPhoto, onPrevious, onNext } = props
  const [showInfo, setShowInfo] = useState({ show: false, file: null })
  const [editMode, setEditMode] = useState(false)
  const [description, setDescription] = useState("")
  const isPhotosOwner = photosOwnerID === myUserID
  const inputRef = useRef(null)
  console.log(photos)

  const photosList = photos
    ?.slice(slideIndex, slideIndex + 1)
    .map((photo, index) => {
      return <img
        key={index}
        src={photo.url}
        alt={photo.name}
      />
    })

  const initEditDescription = () => {
    setEditMode(true)
    setDescription(currentPhoto?.description || "")
  }

  const resetEdit = () => {
    setEditMode(false)
    setDescription("")
  }

  const saveDescription = () => {
    if(!photosOwnerID || !photosDocPath || !parentDocID) return 
    if(!description) return setToasts(infoToast("Please enter a description"))
    updatePostFileDescriptionService(
      photosDocPath, 
      parentDocID, 
      photos, 
      currentPhoto, 
      description, 
      setToasts
    )
    .then(() => {
      resetEdit()
    })
  }

  useEffect(() => {
    if(editMode) 
      sendCursorToEnd(inputRef)
  },[editMode])

  useEffect(() => {
    if(!showInfo.show) {
      resetEdit()
    }
  },[showInfo])

  return (
    <AppPortal
      showPortal={showModal}
      className={portalClassName}
    >
      <div
        className={`photos-modal-container ${showModal ? "show" : ""}`}
      >
        <i
          className="fal fa-times close-icon"
          onClick={onClose}
        />
        <div className="photos-window">
          <div className="top-bar">
            <IconContainer
              icon="fas fa-cloud-download-alt"
              onClick={() => console.log("download")}
              iconSize="15px"
              iconColor="#fff"
              dimensions={30}
              round={false}
            />
            <IconContainer
              icon="far fa-search-plus"
              onClick={() => console.log("zoom in")}
              iconSize="15px"
              iconColor="#fff"
              dimensions={30}
              round={false}
            />
            <IconContainer
              icon="far fa-search-minus"
              onClick={() => console.log("zoom out")}
              iconSize="15px"
              iconColor="#fff"
              dimensions={30}
              round={false}
            />
            <IconContainer
              icon="fas fa-info-circle"
              onClick={() => setShowInfo({ show: true, file: currentPhoto })}
              iconSize="15px"
              iconColor="#fff"
              dimensions={30}
              round={false}
            />
          </div>
          {photosList}
        </div>
        {
          slideIndex > 0 &&
          <div
            className="photos-nav-left photos-nav-bar"
            onClick={onPrevious}
          >
            <i className="fal fa-chevron-left" />
          </div>
        }
        {
          slideIndex < photosNum - 1 &&
          <div
            className="photos-nav-right photos-nav-bar"
            onClick={onNext}
          >
            <i className="fal fa-chevron-right" />
          </div>
        }
        {
          <div
            className={`photo-info-container ${showInfo.show ? 'show' : ''}`}
            onClick={() => setShowInfo({ show: false, file: null })}
          >
            <div
              className="photo-info"
              onClick={e => e.stopPropagation()}
            >
              <div className="titles">
                <h4>Photo Details</h4>
                <i
                  className="fal fa-times"
                  onClick={() => setShowInfo({ show: false, file: null })}
                />
              </div>
              <div className="content">
                <div className="row">
                  <h5>File Name</h5>
                  <h6>{currentPhoto?.name}</h6>
                </div>
                <div className="row">
                  <h5>File Type</h5>
                  <h6>{currentPhoto?.type}</h6>
                </div>
                <div className="row">
                  <h5>File Size</h5>
                  <h6>{convertBytesToKbMbGb(currentPhoto?.size)}</h6>
                </div>
                <div className="row">
                  <h5>Date Uploaded</h5>
                  <h6>{convertClassicDateAndTime(currentPhoto?.dateUploaded?.toDate())}</h6>
                </div>
                <div className="row">
                  <h5>
                    File Description
                    {
                      isPhotosOwner &&
                      <i
                        className="fas fa-pen"
                        onClick={() => initEditDescription()}
                      />
                    }
                  </h5>
                  {
                    !editMode ?
                      <h6>{currentPhoto?.description}</h6> :
                      <div className="edit-container">
                        <textarea
                          placeholder="Enter a description..."
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          ref={inputRef}
                        />
                        <div className="btn-group">
                          <small onClick={() => saveDescription()}>Save</small>
                          <small onClick={() => resetEdit()}>Cancel</small>
                        </div>
                      </div>
                  }
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </AppPortal>
  )
}
