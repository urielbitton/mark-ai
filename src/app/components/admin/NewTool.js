import React, { useContext, useEffect, useState } from 'react'
import './styles/NewTool.css'
import {
  AppInput, AppReactSelect, AppTextarea
} from "../ui/AppInputs"
import { toolsCategoriesData, toolsTypesData } from "app/data/toolsData"
import FileUploader from "../ui/FileUploader"
import AppButton from "../ui/AppButton"
import { addNewToolService, updateAIToolService } from "app/services/aitoolsServices"
import { StoreContext } from "app/store/store"
import AIToolCard from "../aitools/AIToolCard"
import logoImg from "app/assets/images/logo-filled.png"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAITool } from "app/hooks/aitoolsHooks"

export default function NewTool() {

  const { setToasts, photoPlaceholder } = useContext(StoreContext)
  const [title, setTitle] = useState("")
  const [tagline, setTagline] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [category, setCategory] = useState(toolsCategoriesData[0].value)
  const [color1, setColor1] = useState("#865DFF")
  const [color2, setColor2] = useState("#E384FF")
  const [type, setType] = useState(toolsTypesData[0].value)
  const [url, setUrl] = useState("")
  const [tags, setTags] = useState('')
  const [mainImg, setMainImg] = useState([])
  const [logo, setLogo] = useState([])
  const [images, setImages] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const editMode = searchParams.get("edit") === "true"
  const editToolID = searchParams.get("toolID")
  const editTool = useAITool(editToolID, () => { })
  const maxFileSize = 5 * 1024 * 1024

  const validateForm = () => {
    return title
      && tagline
      && shortDescription
      && category
      && url
      && tags
      && mainImg?.length
      && logo?.length
      && images?.length > 0
  }

  const clearForm = () => {
    setTitle("")
    setTagline("")
    setShortDescription("")
    setCategory(toolsCategoriesData[0].value)
    setColor1("#865DFF")
    setColor2("#E384FF")
    setType(toolsTypesData[0].value)
    setUrl("")
    setTags("")
    setMainImg([])
    setLogo([])
    setImages([])
  }

  const handleAddTool = () => {
    if (!validateForm) return
    return addNewToolService(
      {
        title,
        tagline,
        shortDescription,
        category,
        color1,
        color2,
        url,
        tags: tags.split(",").map((tag) => tag.trim()),
        type,
        mainImg,
        logo,
        images,
      },
      setLoading,
      setToasts
    )
      .then(() => {
        navigate("/admin/library")
      })
  }

  const handleSaveTool = () => {
    if (!validateForm) return
    return updateAIToolService(
      {
        title,
        tagline,
        shortDescription,
        category,
        color1,
        color2,
        url,
        tags: tags.split(",").map((tag) => tag.trim()),
        type,
      },
      editToolID,
      {
        mainImg,
        logo,
        images
      },
      setLoading,
      setToasts
    )
      .then(() => {
        clearForm()
      })
  }

  useEffect(() => {
    if (editTool && editMode) {
      setTitle(editTool.title)
      setTagline(editTool.tagline)
      setShortDescription(editTool.shortDescription)
      setCategory(editTool.category)
      setColor1(editTool.color1)
      setColor2(editTool.color2)
      setUrl(editTool.url)
      setTags(editTool.tags.join(", "))
      setType(editTool.type)
      setMainImg([{ src: editTool.mainImg }])
      setLogo([{ src: editTool.logo }])
      setImages(editTool.images.map((img) => ({ src: img })))
    }
  }, [editTool])

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
            label="URL"
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
          <AppReactSelect
            label="Category"
            value={category}
            onChange={(val) => setCategory(val.value)}
            options={toolsCategoriesData}
            searchable
            placeholder={
              <div className="input-placeholder">
                <i className={toolsCategoriesData.find((cat) => cat.value === category)?.icon}></i>
                <h5 className="cap">{category}</h5>
              </div>
            }
          />
          <div className="split-row">
            <div className="split-row">
              <AppInput
                label="Color 1"
                placeholder="Enter a color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                type="color"
              />
              <AppInput
                label="Hex Code"
                placeholder="Enter hex code"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
              />
            </div>
            <div className="split-row">
              <AppInput
                label="Color 2"
                placeholder="Enter a color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                type="color"
              />
              <AppInput
                label="Hex Code"
                placeholder="Enter hex code"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
              />
            </div>
          </div>
          <AppInput
            label="Tags"
            placeholder="Enter tags separated by commas"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <AppReactSelect
            label="Tool Type"
            value={type}
            onChange={(val) => setType(val.value)}
            options={toolsTypesData}
            placeholder={
              <div className="input-placeholder">
                <i className={toolsTypesData.find((cat) => cat.value === type)?.icon}></i>
                <h5 className="cap">{type}</h5>
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
          <div className="btn-group">
            {
              !editMode ?
                <>
                  <AppButton
                    label="Add Tool"
                    onClick={handleAddTool}
                    loading={loading}
                    rightIcon="far fa-arrow-right"
                    disabled={!validateForm()}
                  />
                </> 
                :
                <>
                  <AppButton
                    label="Save Changes"
                    onClick={handleSaveTool}
                    loading={loading}
                  />
                  <AppButton
                    label="Cancel"
                    onClick={() => navigate(`/ai-tools/${editToolID}`)}
                    buttonType="outlineBtn"
                  />
                </>
            }
          </div>
        </div>
        <div className="right">
          <h4>Preview</h4>
          <AIToolCard
            tool={{
              title,
              tagline,
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
