import React, { useState } from 'react'
import SubmissionsPages from "./SubmissionsPages"
import { useToolsSubmissionsByStatus, 
  useToolsSubmissionsCountByStatus } from "app/hooks/adminHooks"
import { showXResultsOptions } from "app/data/general"
import AppTable from "../ui/AppTable"
import AppTableRow from "../ui/AppTableRow"
import { convertClassicDate } from "app/utils/dateUtils"
import AILoader from "../ui/AILoader"
import { beautifyUrl } from "app/utils/generalUtils"
import { Link } from "react-router-dom"
import useUser from "app/hooks/userHooks"
import { AppInput, AppReactSelect } from "../ui/AppInputs"
import AppButton from "../ui/AppButton"
import TabSwitcher from "../ui/TabSwitcher"
import { toolsStatusSwitchData } from "app/data/toolsData"
import AppBadge from "../ui/AppBadge"

export default function ToolsSubmissions() {

  const limitsNum = 20
  const [limit, setLimit] = useState(limitsNum)
  const [loading, setLoading] = useState(false)
  const [searchString, setSearchString] = useState('')
  const [query, setQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState({status: toolsStatusSwitchData[0].value, index:0})
  const submissions = useToolsSubmissionsByStatus(activeStatus.status, limit, setLoading)
  const submissionsCount = useToolsSubmissionsCountByStatus(activeStatus.status)

  const submissionsList = submissions?.map((submission, index) => {
    return <SubmissionRow
      key={index}
      submission={submission}
    />
  })

  const handleSearch = () => {
    setQuery(searchString)
  }

  return (
    <SubmissionsPages
      title={`${submissionsCount} Tools Submissions`}
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
          onTabClick={(status, index) => setActiveStatus({status, index})}
          showIcons
          width={110}
        />
        <AppReactSelect
          label="Show"
          value={limit}
          onChange={(val) => setLimit(val.value)}
          options={showXResultsOptions}
          placeholder={
            <div className="input-placeholder">
              <h5 className="cap">{showXResultsOptions.find(opt => opt.value === limit).label}</h5>
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
        submissionsCount > limitsNum &&
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

  return submission ? (
    <AppTableRow
      index={submission.submissionID}
      cells={[
        <img className="small" src={submission.logo} />,
        <h6 className="internal-link"><Link to={`/admin/tool-preview/${submission.toolID}`}>{submission.title}</Link></h6>,
        <h6><a href={`https://${beautifyUrl(submission.url)}`} rel="noreferrer" target="_blank">{beautifyUrl(submission.url)}</a></h6>,
        <h6 className="small cap">{submission.type === 'ai' ? <i className="fas fa-robot" /> : <i className="fas fa-flask" />}</h6>,
        <h6 className="cap">{submission.category}</h6>,
        <h6 className="internal-link"><Link to={`/admin/users/${submitter?.userID}`}>{submitter?.firstName} {submitter?.lastName}</Link></h6>,
        <h6>{convertClassicDate(submission.dateSubmitted.toDate())}</h6>,
        <h6 className="cap"><AppBadge label={submission.status.replace('-', ' ')} /></h6>,
        <div className="actions-row row-item">
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