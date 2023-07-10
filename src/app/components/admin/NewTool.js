import React, { useContext, useEffect, useState } from 'react'
import './styles/NewTool.css'
import {
  AppInput, AppReactSelect, AppTextarea
} from "../ui/AppInputs"
import { toolsCategoriesData, toolsHasAppOptions, toolsTypesData } from "app/data/toolsData"
import FileUploader from "../ui/FileUploader"
import AppButton from "../ui/AppButton"
import { addNewToolService, checkIfURLExists, updateAIToolService } from "app/services/aitoolsServices"
import { StoreContext } from "app/store/store"
import AIToolCard from "../aitools/AIToolCard"
import logoImg from "app/assets/images/logo-filled.png"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useAITool } from "app/hooks/aitoolsHooks"
import { noWhiteSpaceChars, validateURL } from "app/utils/generalUtils"
import { errorToast, infoToast, successToast } from "app/data/toastsTemplates"
import { toolsIsPaidOptions } from "app/data/toolsData"
import IconContainer from "../ui/IconContainer"

export default function NewTool(props) {

  const { setToasts, photoPlaceholder, isAdmin } = useContext(StoreContext)
  const { proUser, handleProSubmit, handleProUpdate,
    proLoading, proTool, createTitle, createUrl,
    createFromSubmission, setExternalAddTool } = props
  const [title, setTitle] = useState("")
  const [tagline, setTagline] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [category, setCategory] = useState(toolsCategoriesData[2].value)
  const [type, setType] = useState(toolsTypesData[0].value)
  const [url, setUrl] = useState("")
  const [tags, setTags] = useState('')
  const [isPaid, setIsPaid] = useState(toolsIsPaidOptions[0].value)
  const [hasApp, setHasApp] = useState(toolsHasAppOptions[0].value)
  const [features, setFeatures] = useState([])
  const [featureText, setFeatureText] = useState("")
  const [mainImg, setMainImg] = useState([])
  const [logo, setLogo] = useState([])
  const [images, setImages] = useState([])
  const [video, setVideo] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkLoading, setCheckLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const editMode = searchParams.get("edit") === "true"
  const editToolID = searchParams.get("toolID")
  const editTool = useAITool(editToolID, () => { }) || proTool
  const maxFileSize = 5 * 1024 * 1024
  const maxVideoSize = 10 * 1024 * 1024
  const isOnlineTool = location.pathname.includes("online")

  const validateForm = () => {
    return title
      && tagline
      && shortDescription
      && category
      && validateURL(url)
      && tags
      && mainImg?.length
      && logo?.length
      && images?.length > 0
  }

  const handleAddTool = () => {
    if (!validateURL(url)) return setToasts(errorToast("Please enter a valid URL."))
    if (!validateForm) return setToasts(errorToast("Please fill all the fields correctly."))
    if (proUser) {
      return handleProSubmit({
        title,
        tagline,
        shortDescription,
        category,
        url,
        tags: tags.split(",").map((tag) => tag.trim()),
        type,
        isPaid,
        hasApp,
        features,
        mainImg,
        logo,
        images,
      })
    }
    return addNewToolService(
      {
        title,
        tagline,
        shortDescription,
        category,
        url,
        tags: tags.split(",").map((tag) => tag.trim()),
        type,
        isPaid,
        hasApp,
        features,
        mainImg,
        logo,
        images,
        video,
      },
      setLoading,
      setToasts
    )
      .then((res) => {
        if (res !== 'error')
          navigate("/admin/library")
      })
  }

  const handleSaveTool = () => {
    if (!validateURL(url)) return setToasts(errorToast("Please enter a valid URL."))
    if (!validateForm) return setToasts(errorToast("Please fill all the fields correctly."))
    if (proUser) {
      return handleProUpdate(
        {
          title,
          tagline,
          shortDescription,
          category,
          url,
          tags: tags.split(",").map((tag) => tag.trim()),
          type,
          isPaid,
          hasApp,
          features,
        },
        editToolID,
        {
          mainImg,
          logo,
          images
        })
    }
    return updateAIToolService(
      {
        title,
        tagline,
        shortDescription,
        category,
        url,
        tags: tags.split(",").map((tag) => tag.trim()),
        type,
        isPaid,
        hasApp,
        features,
      },
      editToolID,
      {
        mainImg,
        logo,
        images,
        video
      },
      setLoading,
      setToasts
    )
      .then((res) => {
        if (res !== 'error')
          navigate(`/ai-tools/${editToolID}`)
      })
  }

  const handleCheckURL = () => {
    if (!validateURL(url)) return setToasts(errorToast("Please enter a valid URL."))
    setCheckLoading(true)
    checkIfURLExists(url, editMode ? editToolID : null)
      .then((exists) => {
        if (exists) {
          setToasts(infoToast(`The url - ${url} - already belongs to an existing tool on MarkAI. Please choose another url and make sure the tool is not a duplicate.`, true))
        }
        else {
          setToasts(successToast("This URL is available."))
        }
        setCheckLoading(false)
      })
      .catch((err) => {
        setToasts(infoToast("There was an error checking the URL. Please try again."))
        setCheckLoading(false)
        console.log(err)
      })
  }

  const handleAddFeature = () => {
    if (noWhiteSpaceChars(featureText) > 0) {
      setFeatures([...features, featureText])
      setFeatureText("")
    }
  }

  const featuresList = features?.map((feature, index) => {
    return <div 
      className="feature-item"
      key={index}
    >
      <h6>{feature}</h6>
      <IconContainer
        icon="fal fa-times"
        onClick={() => setFeatures(features.filter((_, i) => i !== index))}
        iconSize={18}
        dimensions={25}
        iconColor="var(--ternary)"
      />
    </div>
  })

  useEffect(() => {
    if (editTool && editMode) {
      setTitle(editTool.title)
      setTagline(editTool.tagline)
      setShortDescription(editTool.shortDescription)
      setCategory(editTool.category)
      setUrl(editTool.url)
      setTags(editTool.tags.join(", "))
      setType(editTool.type)
      setIsPaid(editTool.isPaid)
      setHasApp(editTool.hasApp)
      setFeatures(editTool.features)
      setMainImg([{ src: editTool.mainImg }])
      setLogo([{ src: editTool.logo }])
      setImages(editTool.images.map((img) => ({ src: img })))
      setVideo([{ src: editTool.video }])
    }
  }, [editTool])

  useEffect(() => {
    if (!editMode) {
      setType(toolsTypesData[!isOnlineTool ? 0 : 1].value)
    }
  }, [location])

  useEffect(() => {
    if(createTitle) {
      setTitle(createTitle)
      setUrl(createUrl)
    }
  },[createTitle])

  useEffect(() => {
    if(setExternalAddTool) {
      setExternalAddTool({
        title,
        tagline,
        shortDescription,
        category,
        url,
        tags: tags.split(",").map((tag) => tag.trim()),
        type,
        isPaid,
        hasApp,
        features,
        mainImg,
        logo,
        images,
        video,
      })
    }
  },[title, tagline, shortDescription, category, 
    url, tags, type, isPaid, hasApp, features, 
    mainImg, logo, images, video])

  return (
    <div className="new-tool-page">
      <div className="new-card">
        <div className="left">
          <h2>{!editMode ? 'Add New Tool' : 'Update Tool'}</h2>
          <AppInput
            label="Title"
            placeholder="Enter a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <AppInput
            label={<>URL &nbsp;{noWhiteSpaceChars(url) ? validateURL(url) ? <i className="fas fa-check-circle" /> : <i className="fas fa-times-circle" /> : ''}</>}
            placeholder="Enter a URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <AppInput
            label="Tagline"
            placeholder="Enter a tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
          <AppTextarea
            label="Short Description"
            placeholder="Enter a short description"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
          <div className="add-features-section">
            <h6>Features</h6>
            <div className="feature-adder">
              <input
                placeholder="Enter a feature description"
                value={featureText}
                onChange={(e) => setFeatureText(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && handleAddFeature()}
              />
              <AppButton
                iconBtn
                rightIcon="far fa-plus"
                onClick={handleAddFeature}
                buttonType="outlineBtn"
                disabled={noWhiteSpaceChars(featureText) < 1}
              />  
            </div>
            <div className="features-list">
              {featuresList}
            </div>
          </div>
          <AppReactSelect
            label="Category"
            value={category}
            onChange={(val) => setCategory(val.value)}
            options={toolsCategoriesData.slice(2)}
            searchable
            placeholder={
              <div className="input-placeholder">
                <i className={toolsCategoriesData.find((cat) => cat.value === category)?.icon} />
                <h5 className="cap">{category}</h5>
              </div>
            }
          />
          <AppInput
            label="Tags"
            placeholder="Enter tags separated by commas"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <div className="split-row">
            <AppReactSelect
              label="Has App"
              value={hasApp}
              onChange={(val) => setHasApp(val.value)}
              options={toolsHasAppOptions}
              placeholder={
                <div className="input-placeholder">
                  <i className={toolsHasAppOptions.find((has) => has.value === hasApp)?.icon} />
                  <h5 className="cap">{toolsHasAppOptions.find((has) => has.value === hasApp)?.label}</h5>
                </div>
              }
            />
            <AppReactSelect
            label="Tool Type"
            value={isPaid}
            onChange={(val) => setIsPaid(val.value)}
            options={toolsIsPaidOptions.slice(0, 2)}
            placeholder={
              <div className="input-placeholder">
                <i className={toolsIsPaidOptions.find((paid) => paid.value === isPaid)?.icon} />
                <h5 className="cap">{toolsIsPaidOptions.find((paid) => paid.value === isPaid)?.label}</h5>
              </div>
            }
          />
          </div>
          <AppReactSelect
            label="Tool Type"
            value={type}
            onChange={(val) => setType(val.value)}
            options={toolsTypesData.slice(0, 2)}
            placeholder={
              <div className="input-placeholder">
                <i className={toolsTypesData.find((cat) => cat.value === type)?.icon} />
                <h5 className="cap">{toolsTypesData.find((cat) => cat.value === type)?.label}</h5>
              </div>
            }
          />
          <FileUploader
            label="Cover Image"
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            uploadedFiles={mainImg}
            setUploadedFiles={setMainImg}
            maxFileSize={maxFileSize}
            truncateFilenameAmount={60}
            accept="image/*"
            icon="fas fa-cloud-upload-alt"
            text="Drop files here or click to browse"
            className="commonInput"
            displayMode={editMode}
            overwrite
          />
          <FileUploader
            label="Logo"
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            uploadedFiles={logo}
            setUploadedFiles={setLogo}
            maxFileSize={maxFileSize}
            truncateFilenameAmount={60}
            accept="image/*"
            icon="fas fa-cloud-upload-alt"
            text="Drop files here or click to browse"
            className="commonInput"
            displayMode={editMode}
            overwrite
          />
          <FileUploader
            label="Additional Images"
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            uploadedFiles={images}
            setUploadedFiles={setImages}
            maxFileSize={maxFileSize}
            truncateFilenameAmount={60}
            accept="image/*"
            multiple
            icon="fas fa-cloud-upload-alt"
            text="Drop files here or click to browse"
            className="commonInput"
            displayMode={editMode}
          />
          {
            isAdmin &&
            <FileUploader
              label="Optional Video (BETA)"
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              uploadedFiles={video}
              setUploadedFiles={setVideo}
              maxFileSize={maxVideoSize}
              truncateFilenameAmount={60}
              accept="video/*"
              icon="fas fa-cloud-upload-alt"
              text="Drop files here or click to browse"
              className="commonInput"
              displayMode={editMode}
              overwrite
            />
          }
          <div 
            className="btn-group"
            style={{ display: createFromSubmission ? "none" : "flex"}}
          >
            {
              !editMode ?
                <>
                  <AppButton
                    label={!proUser ? "Add Tool" : "Submit for Review"}
                    onClick={handleAddTool}
                    loading={proLoading || loading}
                    rightIcon="far fa-arrow-right"
                    disabled={!validateForm()}
                  />
                </>
                :
                <>
                  <AppButton
                    label="Save Changes"
                    onClick={handleSaveTool}
                    loading={proLoading || loading}
                  />
                  {
                    !proUser &&
                    <AppButton
                      label="Cancel"
                      onClick={() => navigate(`/ai-tools/${editToolID}`)}
                      buttonType="outlineBtn"
                    />
                  }
                </>
            }
            <AppButton
              label="Check URL"
              onClick={handleCheckURL}
              loading={checkLoading}
              buttonType="outlineBtn"
              rightIcon="fas fa-check-circle"
            />
          </div>
        </div>
        <div className="right">
          <h4>Preview</h4>
          <AIToolCard
            tool={{
              title,
              tagline,
              type,
              category,
              url,
              mainImg: mainImg[0]?.src || photoPlaceholder,
              logo: logo[0]?.src || logoImg,
            }}
            isPreview
          />
        </div>
      </div>
    </div>
  )
}
