import React, { useEffect, useState } from 'react'
import './styles/ToolSubmission.css'
import AppButton from "../ui/AppButton"
import { Link, useParams } from "react-router-dom"
import { usePromptSubmission } from "app/hooks/adminHooks"
import AILoader from "../ui/AILoader"
import ItemNotFound from "../ui/ItemNotFound"
import notFoundImg from "app/assets/images/item-not-found.png"
import { convertClassicDateAndTime } from "app/utils/dateUtils"
import AppBadge from "../ui/AppBadge"
import useUser from "app/hooks/userHooks"
import Avatar from "../ui/Avatar"
import {
  adminApprovePromptSubmissionService,
  adminDeleteToolSubmissionService,
  adminRejectPromptSubmissionService,
} from "app/services/aitoolsServices"
import { useContext } from "react"
import { StoreContext } from "app/store/store"

export default function PromptSubmission() {

  const { setToasts, setPageLoading } = useContext(StoreContext)
  const [loading, setLoading] = useState(true)
  const promptID = useParams().promptID
  const prompt = usePromptSubmission(promptID, setLoading)
  const submitter = useUser(prompt?.submitterID)
  const [reviewMode, setReviewMode] = useState(true)
  const isRejected = prompt?.status === 'rejected'

  const handleApprove = () => {
    const confirm = window.confirm("Are you sure you want to approve this prompt? This will notify the submitter.")
    if (!confirm) return
    adminApprovePromptSubmissionService(prompt, setPageLoading, setToasts)
      .then(() => setReviewMode(false))
  }

  const handleReject = () => {
    if (isRejected) return
    const confirm = window.confirm("Are you sure you want to reject this prompt? This will notify the submitter.")
    if (!confirm) return
    adminRejectPromptSubmissionService(prompt, setPageLoading, setToasts)
      .then(() => window.location.reload())
  }

  const handleEdit = () => {

  }

  const handleDelete = () => {
    const confirm = window.confirm("Are you sure you want to delete this prompt?")
    if (!confirm) return
    adminDeleteToolSubmissionService(promptID, setPageLoading, setToasts)
  }

  useEffect(() => {
    if (prompt?.status === 'approved') {
      setReviewMode(false)
    }
  }, [prompt])

  return prompt && !loading ? (
    <div className="tool-submission">
      <div className="tool-submission-card">
        <div className="toolbar">
          <h4>{prompt.short}</h4>
          {
            reviewMode ? (
              <div className="actions">
                {
                  isRejected &&
                  <h3 className="rejected-title">Prompt Rejected</h3>
                }
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
              <h3 className="approved-title">Prompt Approved</h3>
          }
        </div>
        <div className="grid-content">
          <div className="grid-item">
            <h6>Short</h6>
            <h5>{prompt.short}</h5>
          </div>
          <div className="grid-item">
            <h6>Text</h6>
            <h5>{prompt.text}</h5>
          </div>
          <div className="grid-item">
            <h6>Category</h6>
            <h5>{prompt.category}</h5>
          </div>
          <div className="grid-item">
            <h6>Tags</h6>
            <h5>{prompt.tags.join(", ")}</h5>
          </div>
          <div className="grid-item">
            <h6>Date Submitted</h6>
            <h5>{convertClassicDateAndTime(prompt.dateSubmitted.toDate())}</h5>
          </div>
          <div className="grid-item">
            <h6>Status</h6>
            <h5>
              <AppBadge label={prompt.status.replace('-', ' ')} />
            </h5>
          </div>
          <div className="grid-item">
            <h6>Prompt ID</h6>
            <h5>{prompt.promptID}</h5>
          </div>
          <div className="grid-item">
            <h6>Submitted By</h6>
            <Avatar
              src={submitter?.photoURL}
              dimensions={30}
              label={
                <Link to={`/admin/users/${prompt.submitterID}`}>{submitter?.firstName} {submitter?.lastName}</Link>}
            />
          </div>
        </div>
      </div>
    </div>
  ) :
    loading ?
      <AILoader /> :
      <ItemNotFound
        img={notFoundImg}
        label="Prompt not found"
        sublabel="The submission you are looking for does not exist."
        btnLabel="Prompts Submissions"
        btnLink="/admin/submissions/prompts"
      />
}
