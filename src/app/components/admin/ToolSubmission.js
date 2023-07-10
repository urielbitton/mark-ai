import React, { useEffect, useState } from 'react'
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
import { adminApproveToolSubmissionService, 
  adminDeleteToolSubmissionService, 
  adminRejectToolSubmissionService, 
  checkIfURLExists } from "app/services/aitoolsServices"
import { infoToast, successToast } from "app/data/toastsTemplates"
import { useContext } from "react"
import { StoreContext } from "app/store/store"

export default function ToolSubmission() {

  const { setToasts, setPageLoading } = useContext(StoreContext)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState(null)
  const [coverImg, setCoverImg] = useState(null)
  const toolID = useParams().toolID
  const tool = useToolSubmission(toolID, setLoading)
  const submitter = useUser(tool?.submitterID)
  const [reviewMode, setReviewMode] = useState(true)
  const isRejected = tool?.status === 'rejected'

  const additionalImagesList = tool?.images?.map((img, index) => {
    return <img
      src={img}
      key={index}
      onClick={() => setSelectedImg(img)}
    />
  })

  const handleCheckURL = async () => {
    const result = await checkIfURLExists(tool.url, toolID)
    if (result) {
      return setToasts(infoToast("URL already exists in the database."))
    }
    return setToasts(successToast("URL does not exist in the database yet."))
  }

  const handleApprove = () => {
    const confirm = window.confirm("Are you sure you want to approve this tool? This will notify the submitter.")
    if (!confirm) return
    adminApproveToolSubmissionService(tool, setPageLoading, setToasts)
      .then(() => setReviewMode(false))
  }

  const handleReject = () => {
    if (isRejected) return
    const confirm = window.confirm("Are you sure you want to reject this tool? This will notify the submitter.")
    if (!confirm) return
    adminRejectToolSubmissionService(tool, setPageLoading, setToasts)
      .then(() => window.location.reload())
  }

  const handleEdit = () => {

  }

  const handleDelete = () => {
    const confirm = window.confirm("Are you sure you want to delete this tool?")
    if (!confirm) return
    adminDeleteToolSubmissionService(toolID, setPageLoading, setToasts)
  }

  useEffect(() => {
    if (tool?.status === 'approved') {
      setReviewMode(false)
    }
  }, [tool])

  return tool && !loading ? (
    <div className="tool-submission">
      <div className="tool-submission-card">
        <div className="toolbar">
          <h4>{tool.title}</h4>
          {
            reviewMode ? (
              <div className="actions">
                {
                  isRejected &&
                  <h3 className="rejected-title">Tool Rejected</h3>
                }
                <AppButton
                  label="Check URL"
                  onClick={handleCheckURL}
                  buttonType="outlineBtn"
                  leftIcon="fas fa-check-circle"
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
                  leftIcon="fas fa-check"
                />
                {
                  !isRejected &&
                  <AppButton
                    label="Reject"
                    onClick={handleReject}
                    buttonType="outlineBtn"
                    leftIcon="fas fa-times"
                  />
                }
              </div>
            ) :
              <h3 className="approved-title">Tool Approved</h3>
          }
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
            <img
              src={tool.mainImg}
              onClick={() => setCoverImg(tool.mainImg)}
            />
          </div>
          <div className="grid-item images">
            <h6>Additional Images ({tool.images?.length})</h6>
            <AppScrollSlider gap={10}>
              {additionalImagesList}
            </AppScrollSlider>
          </div>
        </div>
      </div>
      <PhotoModal
        img={coverImg}
        onClose={() => setCoverImg(null)}
        showModal={coverImg !== null}
      />
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
