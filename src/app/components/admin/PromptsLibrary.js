import React from 'react'
import AppButton from "../ui/AppButton"
import './styles/ToolsLibrary.css'
import PromptsGrid from "../aitools/PromptsGrid"
import { toolsCategoriesData } from "app/data/toolsData"

export default function PromptsLibrary() {

  return (
    <div className="tools-library">
      <div className="title-bar">
        <h2>All Chat Prompts</h2>
        <AppButton
          label="Add New Prompt"
          url="/admin/add-new/prompt"
          rightIcon="far fa-plus"
        />
      </div>
      <PromptsGrid 
        categories={toolsCategoriesData.slice(2)} 
      />
    </div>
  )
}
