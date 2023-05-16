import React, { useContext } from 'react'
import './styles/AvatarUploader.css'
import { uploadFileLocal } from "app/utils/fileUtils"
import PreventTabClose from "./PreventTabClose"
import { StoreContext } from "app/store/store"

export default function AvatarUploader(props) {

  const { setToasts, photoURLPlaceholder } = useContext(StoreContext)
  const { dimensions=140, className, handleImgClick, handleSave, 
    src, alt, editRights=true, setLoading, uploadedImg, 
    setUploadedImg, directSaving, uploadRef } = props
  const maxFileUploadSize = 1024 * 1024 * 4

  const handleCancel = () => {
    setUploadedImg(null)
    uploadRef.current.value = null
  }

  return (
    <div 
      className={`avatar-uploader ${className}`}
      style={{width: dimensions, height: dimensions}}
    >
      <img
        src={src || photoURLPlaceholder}
        onClick={handleImgClick}
        alt={alt || 'avatar'}
      />
      {
        editRights &&
        <>
          <label>
            <i className="fas fa-camera"></i>
            <input 
              type="file" 
              accept="image/*"
              hidden
              ref={uploadRef}
              onChange={(e) => uploadFileLocal(e, maxFileUploadSize, setUploadedImg, setLoading, setToasts)}
            />
          </label>
          {
            directSaving && uploadedImg?.file && 
            <>
            <span 
              className="avatar-icon save-icon"
              onClick={handleSave}
            >
              <i className="far fa-check"/>
            </span>
            <span 
              className="avatar-icon cancel-icon"
              onClick={handleCancel}
            >
              <i className="far fa-times"/>
            </span>
            </>
          }
        </>
      }
      <PreventTabClose preventClose={uploadedImg?.file} />
    </div>
  )
}
