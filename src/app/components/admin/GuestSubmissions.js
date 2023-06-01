import React, { useState } from 'react'
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
import { Link, useNavigate } from "react-router-dom"
import { AppInput, AppReactSelect } from "../ui/AppInputs"
import AppButton from "../ui/AppButton"
import TabSwitcher from "../ui/TabSwitcher"
import { toolsStatusSwitchData } from "app/data/toolsData"
import AppBadge from "../ui/AppBadge"
import DropdownIcon from "../ui/DropDownIcon"

export default function GuestSubmissions() {

  const limitsNum = 4
  const [limit, setLimit] = useState(limitsNum)
  const [loading, setLoading] = useState(false)
  const [searchString, setSearchString] = useState('')
  const [activeStatus, setActiveStatus] = useState({ status: toolsStatusSwitchData[0].value, index: 0 })
  const submissions = useGuestToolsSubmissionsByStatus(activeStatus.status, limit, setLoading)
  const submissionsCount = useGuestToolsSubmissionsCountByStatus(activeStatus.status)
  const navigate = useNavigate()

  const submissionsList = submissions?.map((submission, index) => {
    return <SubmissionRow
      key={index}
      submission={submission}
    />
  })

  const handleSearch = () => {
    navigate(`/admin/submissions/search?q=${searchString}&type=guests`)
  }

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
          onTabClick={(status, index) => setActiveStatus({ status: status.value, index })}
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
            rows={submissionsList}
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

  const [showOptions, setShowOptions] = useState(false)

  const moreOptions = [
    { label: 'Preview Tool', icon: 'fas fa-eye', onClick: () => { } },
    { label: 'Create', icon: 'far fa-plus', onClick: () => { } },
    { label: 'Approve', icon: 'fas fa-check-circle', onClick: () => { } },
    { label: 'Reject', icon: 'fas fa-times-circle', onClick: () => { } },
    { label: 'Delete', icon: 'fas fa-trash', onClick: () => { } },
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