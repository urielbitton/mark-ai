import React, { useContext, useState } from 'react'
import AppButton from "../ui/AppButton"
import { updateEveryToolWithProps } from "app/services/adminServices"
import { StoreContext } from "app/store/store"
import { errorToast, successToast } from "app/data/toastsTemplates"

export default function AdminDashboard() {

  const { setToasts } = useContext(StoreContext)
  const [loading, setLoading] = useState(false)

  const handleAddProps = () => {
    const path = 'prompts'
    const confirm = window.confirm(`Are you sure you want to add props to all ${path} docs?`)
    if (!confirm) return
    setLoading(true)
    updateEveryToolWithProps(path, null)
    .then(() => {
      console.log('views initialized')
      setToasts(successToast('Props added to DB docs'))
      setLoading(false)
    })
    .catch((error) => {
      setLoading(false)
      setToasts(errorToast(error.message))
      console.log(error)
    })
  }

  return (
    <div>
      <AppButton
        label="Add New Tool"
        url="/admin/add-new/tool"
      />
      <AppButton
        label="Add New Prompt"
        url="/admin/add-new/prompt"
      />
      <AppButton
        label="Tools Library"
        url="/admin/library"
      />
      <AppButton
        label="Prompts Library"
        url="/admin/library/prompts"
      />
      <AppButton
        label="Add Props To DB Docs"
        onClick={handleAddProps}
        loading={loading}
      />  
    </div>
  )
}
