import React, { useState } from 'react'
import './styles/ToolSubmission.css'
import AppButton from "../ui/AppButton"
import { Link, useParams } from "react-router-dom"
import { useToolSubmission } from "app/hooks/adminHooks"
import AILoader from "../ui/AILoader"
import ItemNotFound from "../ui/ItemNotFound"
import notFoundImg from "app/assets/images/item-not-found.png"
import { convertClassicDateAndTime } from "app/utils/dateUtils"
import AppBadge from "../ui/AppBadge"
import useUser from "app/hooks/userHooks"
import Avatar from "../ui/Avatar"
import AppScrollSlider from "../ui/AppScrollSlider"
import PhotoModal from "../ui/PhotoModal"

export default function ToolSubmission() {

  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState(null)
  const toolID = useParams().toolID
  const tool = useToolSubmission(toolID, setLoading)
  const submitter = useUser(tool?.submitterID)

  const additionalImagesList = tool?.images?.map((img, index) => {
    return <img
      src={img}
      key={index}
      onClick={() => setSelectedImg(img)}
    />
  })

  const handleApprove = () => {

  }

  const handleReject = () => {

  }

  const handleEdit = () => {

  }

  const handleDelete = () => {

  }

  return tool && !loading ? (
    <div className="tool-submission">
      <div className="tool-submission-card">
        <div className="toolbar">
          <h4>{tool.title}</h4>
          <div className="actions">
            <AppButton
              label="Preview"
              url=""
              buttonType="outlineBtn"
              leftIcon="fas fa-eye"
            />
            <AppButton
              label="Edit"
              onClick={handleEdit}
              buttonType="outlineBtn"
              leftIcon="fas fa-pen"
            />
            <AppButton
              label="Delete"
              onClick={handleDelete}
              buttonType="outlineBtn"
              leftIcon="fas fa-trash"
            />
            <AppButton
              label="Approve"
              onClick={handleApprove}
              buttonType="outlineBtn"
              leftIcon="far fa-check"
            />
            <AppButton
              label="Reject"
              onClick={handleReject}
              buttonType="outlineBtn"
              leftIcon="fal fa-times"
            />
          </div>
        </div>
        <div className="grid-content">
          <div className="grid-item logo">
            <h6>Logo</h6>
            <img src={tool.logo} />
          </div>
          <div className="grid-item">
            <h6>Website URL</h6>
            <h5>
              <i className="fas fa-external-link" />
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tool.url}
              </a>
            </h5>
          </div>
          <div className="grid-item">
            <h6>Tagline</h6>
            <h5>{tool.tagline}</h5>
          </div>
          <div className="grid-item">
            <h6>Description</h6>
            <h5>{tool.shortDescription}</h5>
          </div>
          <div className="grid-item">
            <h6>Category</h6>
            <h5>{tool.category}</h5>
          </div>
          <div className="grid-item">
            <h6>Tool Type</h6>
            <h5>{tool.type}</h5>
          </div>
          <div className="grid-item">
            <h6>Tags</h6>
            <h5>{tool.tags.join(", ")}</h5>
          </div>
          <div className="grid-item">
            <h6>Date Submitted</h6>
            <h5>{convertClassicDateAndTime(tool.dateSubmitted.toDate())}</h5>
          </div>
          <div className="grid-item">
            <h6>Status</h6>
            <h5>
              <AppBadge label={tool.status.replace('-', ' ')} />
            </h5>
          </div>
          <div className="grid-item">
            <h6>Tool ID</h6>
            <h5>{tool.toolID}</h5>
          </div>
          <div className="grid-item">
            <h6>Submitted By</h6>
            <Avatar
              src={submitter?.photoURL}
              dimensions={30}
              label={
                <Link to={`/admin/users/${tool.submitterID}`}>{submitter?.firstName} {submitter?.lastName}</Link>}
            />
          </div>
          <div className="grid-item images cover">
            <h6>Cover Image</h6>
            <img src={tool.mainImg} />
          </div>
          <div className="grid-item images">
            <h6>Additional Images</h6>
            <AppScrollSlider gap={10}>
              {additionalImagesList}
            </AppScrollSlider>
          </div>
        </div>
      </div>
      <div className="btn-group">
        <AppButton
          label="Check URL"
          buttonType="outlineBtn"
        />
      </div>
      <PhotoModal
        img={selectedImg}
        onClose={() => setSelectedImg(null)}
        showModal={selectedImg !== null}
        slideshow={tool?.images}
        slideShowIndex={tool?.images?.indexOf(selectedImg)}
      />
    </div>
  ) :
    loading ?
      <AILoader /> :
      <ItemNotFound
        img={notFoundImg}
        label="Tool not found"
        sublabel="The submission you are looking for does not exist."
        btnLabel="Tools Submissions"
        btnLink="/admin/submissions"
      />
}
