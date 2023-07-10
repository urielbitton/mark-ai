import React, { useContext, useEffect, useState } from 'react'
import SubmissionsPages from "./SubmissionsPages"
import {
  usePromptsSubmissionsByStatus,
  usePromptsSubmissionsCountByStatus
} from "app/hooks/adminHooks"
import { showXResultsOptions } from "app/data/general"
import AppTable from "../ui/AppTable"
import AppTableRow from "../ui/AppTableRow"
import { convertClassicDate } from "app/utils/dateUtils"
import AILoader from "../ui/AILoader"
import { truncateText } from "app/utils/generalUtils"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import useUser from "app/hooks/userHooks"
import { AppInput, AppReactSelect } from "../ui/AppInputs"
import AppButton from "../ui/AppButton"
import TabSwitcher from "../ui/TabSwitcher"
import { toolsStatusSwitchData } from "app/data/toolsData"
import AppBadge from "../ui/AppBadge"
import { adminApprovePromptSubmissionService, adminRejectPromptSubmissionService } from "app/services/aitoolsServices"
import { StoreContext } from "app/store/store"

export default function PromptsSubmissions() {

  const limitsNum = 10
  const [limit, setLimit] = useState(limitsNum)
  const [loading, setLoading] = useState(false)
  const [searchString, setSearchString] = useState('')
  const [activeStatus, setActiveStatus] = useState({ status: toolsStatusSwitchData[0].value, index: 0 })
  const [searchParams, setSearchParams] = useSearchParams()
  const submissions = usePromptsSubmissionsByStatus(activeStatus.status, limit, setLoading)
  const submissionsCount = usePromptsSubmissionsCountByStatus(activeStatus.status)
  const navigate = useNavigate()

  const submissionsList = submissions?.map((submission, index) => {
    return <SubmissionRow
      key={index}
      submission={submission}
    />
  })

  const handleSearch = () => {
    navigate(`/admin/submissions/search?q=${searchString}&type=prompts`)
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
      title={`${submissions?.length} of ${submissionsCount} Prompts Submissions`}
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
              <h5 className="cap">{limit} Results</h5>
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
              { label: 'Short' },
              { label: 'Text' },
              { label: 'Category' },
              { label: 'Submitter' },
              { label: 'Date Submitted' },
              { label: 'Status' },
              { label: 'Actions' }
            ]}
            rows={submissionsCount > 0 ? submissionsList : <h5 className="no-tools-text">No prompts found.</h5>}
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
    </SubmissionsPages>
  )
}

export const SubmissionRow = ({ submission }) => {

  const { setPageLoading, setToasts } = useContext(StoreContext)
  const submitter = useUser(submission?.submitterID)

  const handleApprove = () => {
    const confirm = window.confirm("Are you sure you want to approve this prompt? This will notify the submitter.")
    if (!confirm) return
    adminApprovePromptSubmissionService(submission, setPageLoading, setToasts)
      .then(() => {
        window.location.reload()
      })
  }

  const handleReject = () => {
    const confirm = window.confirm("Are you sure you want to reject this prompt? This will notify the submitter.")
    if (!confirm) return
    adminRejectPromptSubmissionService(submission, setPageLoading, setToasts)
      .then(() => {
        window.location.reload()
      })
  }

  return submission ? (
    <AppTableRow
      index={submission.submissionID}
      cells={[
        <h6 className="internal-link">
          <Link to={`/admin/submissions/prompt/${submission.promptID}`}>{truncateText(submission.short, 20)}</Link>
        </h6>,
        <h6 title={submission.text}>{truncateText(submission.text, 20)}</h6>,
        <h6 className="cap">{submission.category}</h6>,
        <h6 className="internal-link">
          <Link to={`/admin/users/${submitter?.userID}`}>{submitter?.firstName} {submitter?.lastName}</Link>
        </h6>,
        <h6>{convertClassicDate(submission.dateSubmitted.toDate())}</h6>,
        <h6 className="cap">
          <AppBadge
            label={submission.status.replace('-', ' ')}
            bgColor={submission.status === 'rejected' && 'var(--lightRed)'}
            color={submission.status === 'rejected' && 'var(--red)'}
          />
        </h6>,
        <div className="actions-row row-item">
          {
            submission.status !== 'approved' &&
            <>
              <AppButton
                label="Approve"
                buttonType="invertedBtn"
                onClick={handleApprove}
              />
              <AppButton
                label="Reject"
                buttonType="invertedBtn"
                onClick={handleReject}
              />
            </>
          }
        </div>
      ]}
    />
  ) : null

}