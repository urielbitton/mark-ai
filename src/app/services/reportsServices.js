import { errorToast, successToast } from "app/data/toastsTemplates"
import { getRandomDocID, setDB } from "./CrudDB"

export const createReportService = (userID, orgID, reason, message, reportedContent, setLoading, setToasts) => {
  setLoading(true)
  const path = `organizations/${orgID}/reports`
  const docID = getRandomDocID(path)
  return setDB(path, docID, {
    userID,
    orgID,
    reason,
    message,
    reportedContent,
    dateCreated: new Date(),
    reportID: docID,
    isResolved: false,
    isSeen: false,
  })
  .then(() => {
    setLoading(false)
    setToasts(successToast("Your report was sent to your organization admin. Thank you for your submission."))
  })
  .catch(err => {
    setLoading(false)
    setToasts(errorToast("Something went wrong. Please try again."))
    console.log(err)
  })
}