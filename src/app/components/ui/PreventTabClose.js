import React, { useEffect } from "react"

export default function PreventTabClose({preventClose, ...props}) {

  const { warningMessage='You have unsaved changes. Are you sure you want to close the tab?' } = props

  const eventReturnValue = (e) => {
    return e.returnValue = warningMessage
  }

  useEffect(() => {
    if(preventClose) {
      window.addEventListener("beforeunload", eventReturnValue) 
    }
    return () => window.removeEventListener("beforeunload", eventReturnValue)
  })
 
  return (
    <></>
  )
}
