import React from 'react'
import AppButton from "../ui/AppButton"

export default function AdminDashboard() {
  return (
    <div>
      <AppButton
        label="Add New Tool"
        url="/admin/add-new-tool"
      />
      <AppButton
        label="Tools Library"
        url="/admin/library"
      />
    </div>
  )
}
