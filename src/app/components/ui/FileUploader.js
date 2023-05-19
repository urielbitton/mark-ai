import React, { useContext, useState } from 'react'
import './styles/FileUploader.css'
import {
  convertBytesToKbMbGb, fileTypeConverter,
  uploadMultipleFilesLocal
} from "app/utils/fileUtils"
import PreventTabClose from "./PreventTabClose"
import IconContainer from "./IconContainer"
import { truncateText } from "app/utils/generalUtils"
import { StoreContext } from "app/store/store"

export default function FileUploader(props) {

  const { setToasts } = useContext(StoreContext)
  const { inputRef, isDragging, setIsDragging, uploadedFiles,
    setUploadedFiles, maxFileSize, icon, text,
    accept = "image/*, application/*", truncateFilenameAmount = 25,
    label, className = "", maxFilesNum = 20, multiple=false,
    displayMode, overwrite } = props
  const [loading, setLoading] = useState(false)
  const preventClose = !!uploadedFiles?.length || loading

  const uploadedFilesRender = uploadedFiles
  ?.filter(file => !displayMode ? file?.file : true)
  .slice(overwrite ? uploadedFiles?.length - 1 : 0)
  .map((file, i) => {
    const isMedia = file?.file?.type.includes("image") || file?.file?.type.includes("video")
    return <div
      className="file-item"
      key={i}
    >
      <div className="text">
        {
          !isMedia && !displayMode &&
          <IconContainer
            icon={fileTypeConverter(file?.file?.type)?.icon}
            iconColor={fileTypeConverter(file?.file?.type)?.color}
            bgColor="#fff"
            dimensions="30px"
            round={false}
            style={{ border: "1px solid var(--inputBorder)" }}
          />
        }
        {
          displayMode ? 
          <img src={file?.src} /> :
          file?.file?.type.includes("image") ?
            <img src={file?.src} /> :
            file?.file?.type.includes('video') &&
            <video autoPlay src={file?.src} />
        }
        <h6 title={file?.file?.name}>
          { file?.file?.name && <span>{truncateText(file?.file?.name, truncateFilenameAmount)}</span> }
          { file?.file?.size && <small>{convertBytesToKbMbGb(file?.file?.size, 0)}</small> }
        </h6>
      </div>
      <i
        className="fal fa-times remove-icon"
        onClick={() => setUploadedFiles(uploadedFiles?.filter((_, j) => j !== i))}
      />
    </div>
  })

  return (
    <div className={`app-file-uploader ${className}`}>
      {label && <h6>{label}</h6>}
      <label className={`upload-container ${isDragging ? 'dragging' : ''}`}>
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          ref={inputRef}
          onChange={(e) => uploadMultipleFilesLocal(e, maxFileSize, maxFilesNum, setUploadedFiles, setLoading, setToasts)}
          onDragEnter={() => setIsDragging(true)}
          onDrop={() => setIsDragging(false)}
          onDragLeave={() => setIsDragging(false)}
          onDragEnd={() => setIsDragging(false)}
        />
        <i className={icon} />
        <h5>{text}</h5>
      </label>
      {
        uploadedFiles?.length > 0 &&
        <div className="uploaded-files-container">
          {uploadedFilesRender}
        </div>
      }
      {/* <PreventTabClose preventClose={preventClose} /> */}
    </div>
  )
}
