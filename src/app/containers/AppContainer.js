import React, { useContext } from 'react'
import './styles/AppContainer.css'
import './styles/DarkMode.css'
import { StoreContext } from "app/store/store"
import PageLoader from "app/components/ui/PageLoader"
import RoutesContainer from "./RoutesContainer"
import Navbar from "app/components/layout/Navbar"
import HelmetTitle from "app/components/ui/HelmetTitle"
import PreventTabClose from "app/components/ui/PreventTabClose"

export default function AppContainer() {

  const { pageLoading, darkMode } = useContext(StoreContext)

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <HelmetTitle />
      <div className="main-content">
        <Navbar />
        <RoutesContainer />
      </div>
      <PageLoader loading={pageLoading} />
      <PreventTabClose preventClose={pageLoading} />
    </div>
  )
}
