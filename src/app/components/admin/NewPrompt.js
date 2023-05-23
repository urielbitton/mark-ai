import React, { useContext, useEffect, useState } from 'react'
import './styles/NewTool.css'
import {
  AppInput, AppReactSelect, AppTextarea
} from "../ui/AppInputs"
import { toolsCategoriesData } from "app/data/toolsData"
import AppButton from "../ui/AppButton"
import { StoreContext } from "app/store/store"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useChatPrompt } from "app/hooks/aitoolsHooks"
import PromptCard from "../aitools/PromptCard"
import { addNewPromptService, updatePromptService } from "app/services/aitoolsServices"

export default function NewPrompt() {

  const { setToasts } = useContext(StoreContext)
  const [text, setText] = useState("")
  const [category, setCategory] = useState(toolsCategoriesData[0].value)
  const [short, setShort] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const editMode = searchParams.get("edit") === "true"
  const editPromptID = searchParams.get("promptID")
  const editPrompt = useChatPrompt(editPromptID, setLoading)

  const validateForm = () => {
    return text
      && category
  }

  const clearForm = () => {
    setText("")
    setShort("")
    setTags("")
  }

  const handleAddPrompt = () => {
    if (!validateForm) return
    addNewPromptService(
      {
        text,
        category,
        short,
        tags: tags.split(',').map((tag) => tag.trim()),
      },
      setLoading,
      setToasts
    )
      .then(() => {
        clearForm()
      })
  }

  const handleSavePrompt = () => {
    if (!validateForm) return
    updatePromptService(
      {
        text,
        category,
        short,
        tags: tags.split(',').map((tag) => tag.trim()),
      },
      editPromptID,
      setLoading,
      setToasts
    )
    .then(() => {
      navigate(`/prompts/${editPromptID}`)
    })
  }

  useEffect(() => {
    if (editPrompt && editMode) {
      setText(editPrompt.text)
      setCategory(editPrompt.category)
      setShort(editPrompt.short)
      setTags(editPrompt.tags.join(", "))
    }
  }, [editPrompt])

  return (
    <div className="new-tool-page">
      <div className="new-card">
        <div className="left">
          <h2>{!editMode ? 'Add New Tool' : 'Update Tool'}</h2>
          <AppTextarea
            label="Prompt Text"
            placeholder="Enter a prompt"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <AppInput
            label="Short"
            placeholder="Enter a short description"
            value={short}
            onChange={(e) => setShort(e.target.value)}
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
          <AppInput
            label="Tags"
            placeholder="Enter tags separated by commas"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <div className="btn-group">
            {
              !editMode ?
                <AppButton
                  label="Add Prompt"
                  onClick={handleAddPrompt}
                  loading={loading}
                  rightIcon="far fa-arrow-right"
                  disabled={!validateForm()}
                /> :
                <>
                  <AppButton
                    label="Save Changes"
                    onClick={handleSavePrompt}
                    loading={loading}
                  />
                  <AppButton
                    label="Cancel"
                    onClick={() => navigate(`/prompts/${editPromptID}`)}
                    buttonType="outlineBtn"
                  />
                </>
            }
          </div>
        </div>
        <div className="right">
          <h4>Preview</h4>
          <PromptCard
            prompt={{
              text,
              short,
              category,
              tags,
            }}
            isPreview
          />
        </div>
      </div>
    </div>
  )
}
