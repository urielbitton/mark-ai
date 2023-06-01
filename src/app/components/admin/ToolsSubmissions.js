import React, { useState } from 'react'
import SubmissionsPages from "./SubmissionsPages"
import {
  useToolsSubmissionsByStatus,
  useToolsSubmissionsCountByStatus
} from "app/hooks/adminHooks"
import { showXResultsOptions } from "app/data/general"
import AppTable from "../ui/AppTable"
import AppTableRow from "../ui/AppTableRow"
import { convertClassicDate } from "app/utils/dateUtils"
import AILoader from "../ui/AILoader"
import { beautifyUrl, truncateText } from "app/utils/generalUtils"
import { Link, useNavigate } from "react-router-dom"
import useUser from "app/hooks/userHooks"
import { AppInput, AppReactSelect } from "../ui/AppInputs"
import AppButton from "../ui/AppButton"
import TabSwitcher from "../ui/TabSwitcher"
import { toolsStatusSwitchData } from "app/data/toolsData"
import AppBadge from "../ui/AppBadge"
import IconContainer from "../ui/IconContainer"

export default function ToolsSubmissions() {

  const limitsNum = 20
  const [limit, setLimit] = useState(limitsNum)
  const [loading, setLoading] = useState(false)
  const [searchString, setSearchString] = useState('')
  const [activeStatus, setActiveStatus] = useState({ status: toolsStatusSwitchData[0].value, index: 0 })
  const submissions = useToolsSubmissionsByStatus(activeStatus.status, limit, setLoading)
  const submissionsCount = useToolsSubmissionsCountByStatus(activeStatus.status)
  const navigate = useNavigate()

  const submissionsList = submissions?.map((submission, index) => {
    return <SubmissionRow
      key={index}
      submission={submission}
    />
  })

  const handleSearch = () => {
    navigate(`/admin/submissions/search?q=${searchString}&type=tools`)
  }

  return (
    <SubmissionsPages
      title={`${submissions?.length} of ${submissionsCount} Tools Submissions`}
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
              { label: 'Logo', small: true },
              { label: 'Title' },
              { label: 'URL' },
              { label: 'Type', small: true },
              { label: 'Category' },
              { label: 'Submitter' },
              { label: 'Date Submitted' },
              { label: 'Status' },
              { label: 'Actions' }
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

  const submitter = useUser(submission?.submitterID)
  const navigate = useNavigate()

  return submission ? (
    <AppTableRow
      index={submission.submissionID}
      cells={[
        <img className="small" src={submission.logo} />,
        <h6 className="internal-link">
          <Link to={`/admin/submissions/tool/${submission.toolID}`}>{truncateText(submission.title, 30)}</Link>
        </h6>,
        <h6>
          <a href={`https://${beautifyUrl(submission.url)}`} rel="noreferrer" target="_blank">
          {truncateText(beautifyUrl(submission.url), 25)}
          </a>
        </h6>,
        <h6 className="small cap">{submission.type === 'ai' ? <i className="fas fa-robot" /> : <i className="fas fa-flask" />}</h6>,
        <h6 className="cap">{submission.category}</h6>,
        <h6 className="internal-link"><Link to={`/admin/users/${submitter?.userID}`}>{submitter?.firstName} {submitter?.lastName}</Link></h6>,
        <h6>{convertClassicDate(submission.dateSubmitted.toDate())}</h6>,
        <h6 className="cap"><AppBadge label={submission.status.replace('-', ' ')} /></h6>,
        <div className="actions-row row-item">
          <IconContainer
            icon="fas fa-eye"
            iconColor="var(--primary)"
            iconSize={14}
            dimensions={25}
            onClick={() => navigate(`/admin/tool-preview/${submission.toolID}`)}
            title="Preview Tool"
          />
          <AppButton
            label="Approve"
            buttonType="invertedBtn"
          />
          <AppButton
            label="Reject"
            buttonType="invertedBtn"
          />
        </div>
      ]}
    />
  ) : null

}