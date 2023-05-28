import { StoreContext } from "app/store/store"
import React, { useContext } from 'react'
import './styles/MobileSidebar.css'

export default function MobileSidebar() {

  const { showMobileSidebar, setShowMobileSidebar } = useContext(StoreContext)

  // const menuRender = 

  return (
    <div className={`mobile-sidebar ${showMobileSidebar ? 'show' : ''}`}>

    </div>
  )
}
