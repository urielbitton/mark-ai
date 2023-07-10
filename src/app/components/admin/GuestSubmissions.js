import React, { useContext, useEffect, useState } from 'react'
import SubmissionsPages from "./SubmissionsPages"
import {
  useGuestToolsSubmissionsByStatus,
  useGuestToolsSubmissionsCountByStatus
} from "app/hooks/adminHooks"
import { showXResultsOptions } from "app/data/general"
import AppTable from "../ui/AppTable"
import AppTableRow from "../ui/AppTableRow"
import { convertClassicDate } from "app/utils/dateUtils"
import AILoader from "../ui/AILoader"
import { beautifyUrl, truncateText } from "app/utils/generalUtils"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { AppInput, AppReactSelect } from "../ui/AppInputs"
import AppButton from "../ui/AppButton"
import TabSwitcher from "../ui/TabSwitcher"
import { toolsStatusSwitchData } from "app/data/toolsData"
import AppBadge from "../ui/AppBadge"
import DropdownIcon from "../ui/DropDownIcon"
import AppModal from "../ui/AppModal"
import NewTool from "./NewTool"
import { StoreContext } from "app/store/store"
import { adminCreateToolFromGuestSubmission } from "app/services/adminServices"
import { successToast } from "app/data/toastsTemplates"

export default function GuestSubmissions() {

  const { setToasts } = useContext(StoreContext)
  const limitsNum = 10
  const [limit, setLimit] = useState(limitsNum)
  const [loading, setLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [searchString, setSearchString] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createTitle, setCreateTitle] = useState('')
  const [createUrl, setCreateUrl] = useState('')
  const [submitter, setSubmitter] = useState(null)
  const [externalAddTool, setExternalAddTool] = useState(null)
  const [activeStatus, setActiveStatus] = useState({ status: toolsStatusSwitchData[0].value, index: 0 })
  const [searchParams, setSearchParams] = useSearchParams()
  const submissions = useGuestToolsSubmissionsByStatus(activeStatus.status, limit, setLoading)
  const submissionsCount = useGuestToolsSubmissionsCountByStatus(activeStatus.status)
  const navigate = useNavigate()

  const handleInitToolCreation = (submission) => {
    setShowCreateModal(true)
    setCreateTitle(submission.title)
    setCreateUrl(submission.url)
    setSubmitter({
      name: submission.name,
      email: submission.email,
      submissionID: submission.submissionID
    })
  }

  const approveTool = (submission) => {

  }

  const rejectTool = (submission) => {

  }

  const deleteTool = (submission) => {

  }

  const submissionsList = submissions?.map((submission, index) => {
    return <SubmissionRow
      key={index}
      submission={submission}
      initToolCreation={handleInitToolCreation}
      approveTool={approveTool}
      rejectTool={rejectTool}
      deleteTool={deleteTool}
    />
  })

  const handleSearch = () => {
    navigate(`/admin/submissions/search?q=${searchString}&type=guests`)
  }

  const handleCreate = () => {
    const tool = externalAddTool
    adminCreateToolFromGuestSubmission(tool, submitter, setCreateLoading, setToasts)
      .then(() => {
        setToasts(successToast('Tool created from guest submission successfully'))
        setShowCreateModal(false)
        setExternalAddTool(null)
        window.location.reload()
      })
  }

  useEffect(() => {
    if(searchParams.get('status') === 'approved') 
      setActiveStatus({ status: 'approved', index: 1 })
    else if (searchParams.get('status') === 'rejected') 
      setActiveStatus({ status: 'rejected', index: 2 })
    else 
      setActiveStatus({ status: 'in-review', index: 0 })
  }, [searchParams])

  return (
    <SubmissionsPages
      title={`${submissions?.length} of ${submissionsCount} Guest Submissions`}
      leftComponent={
        <AppInput
          placeholder="Search Submissions"
          value={searchString}
          onChange={e => setSearchString(e.target.value)}
          onKeyUp={e => e.key === 'Enter' && handleSearch()}
          iconright={
            <div
              className="icon-container"
              onClick={handleSearch}
            >
              <i className="far fa-search" />
            </div>
          }
        />
      }
      rightComponent={<>
        <TabSwitcher
          tabs={toolsStatusSwitchData}
          activeTab={activeStatus}
          onTabClick={(status, index) => {
            setActiveStatus({ status: status.value, index })
            setSearchParams({ status: status.value })
          }}
          showIcons
          width={105}
        />
        <AppReactSelect
          label="Show"
          value={limit}
          onChange={(val) => setLimit(val.value)}
          options={showXResultsOptions}
          placeholder={
            <div className="input-placeholder">
              <h5 className="cap">{limit} results</h5>
            </div>
          }
        />
      </>}
      className=""
    >
      {
        !loading ?
          <AppTable
            headers={[
              { label: 'Title' },
              { label: 'URL' },
              { label: 'Submitter' },
              { label: 'Email' },
              { label: 'Date Submitted' },
              { label: 'Status' },
              { label: 'Actions', small: true }
            ]}
            rows={submissionsCount > 0 ? submissionsList : <h5 className="no-tools-text">No tools found.</h5>}
          /> :
          <AILoader />
      }
      {
        submissionsCount > limit &&
        <AppButton
          label="Show More"
          onClick={() => setLimit(limit + limitsNum)}
          className="show-more-btn"
        />
      }
      <AppModal
        label="Create Tool From Submission"
        showModal={showCreateModal}
        setShowModal={setShowCreateModal}
        className="create-tool-modal"
        actions={
          <>
            <AppButton
              label="Create"
              onClick={handleCreate}
              loading={createLoading}
            />
            <AppButton
              label="Cancel"
              onClick={() => setShowCreateModal(false)}
              buttonType="outlineBtn"
            />
          </>
        }
      >
        <NewTool
          createTitle={createTitle}
          createUrl={createUrl}
          createFromSubmission
          setExternalAddTool={setExternalAddTool}
        />
      </AppModal>
    </SubmissionsPages>
  )
}

export const SubmissionRow = ({ submission, initToolCreation, approveTool, rejectTool, deleteTool }) => {

  const [showOptions, setShowOptions] = useState(false)
  const isApproved = submission.status === 'approved'

  const moreOptions = [
    ...(!isApproved ? [{ label: 'Create', icon: 'fas fa-plus', onClick: () => initToolCreation(submission) }] : []),
    ...(!isApproved ? [{ label: 'Approve', icon: 'fas fa-check-circle', onClick: () => approveTool(submission) }] : []),
    { label: 'Reject', icon: 'fas fa-times-circle', onClick: () => rejectTool(submission) },
    { label: 'Delete', icon: 'fas fa-trash', onClick: () => deleteTool(submission) }
  ]

  return submission ? (
    <AppTableRow
      index={submission.submissionID}
      cells={[
        <h6 className="internal-link"><Link to={`/admin/tool-preview/${submission.toolID}`}>{submission.title}</Link></h6>,
        <h6>
          <a href={`https://${beautifyUrl(submission.url)}`} rel="noreferrer" target="_blank" className="lower">
            {truncateText(beautifyUrl(submission.url), 25)}
          </a>
        </h6>,
        <h6>{submission?.name}</h6>,
        <h6>
          <a href={`mailto:${submission?.email}`} className="lower">
            {truncateText(submission?.email, 25)}
          </a>
        </h6>,
        <h6>{convertClassicDate(submission.dateSubmitted.toDate())}</h6>,
        <h6 className="cap"><AppBadge label={submission.status.replace('-', ' ')} /></h6>,
        <div className="actions-row row-item small">
          <DropdownIcon
            items={moreOptions}
            showMenu={showOptions}
            setShowMenu={setShowOptions}
            onClick={() => setShowOptions(prev => !prev)}
            icon="far fa-ellipsis-h"
            iconColor="var(--darkGrayText)"
            iconSize={18}
            dimensions={25}
            tooltip="More Options"
            dropdownPosition="place-right-bottom"
            round
          />
        </div>
      ]}
    />
  ) : null

}