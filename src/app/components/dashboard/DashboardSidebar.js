import React, { useEffect, useState } from 'react'
import './styles/DashboardSidebar.css'
import { proMenuLinks } from "app/data/general"
import { NavLink, useLocation } from "react-router-dom"

export default function DashboardSidebar() {

  const [openLink, setOpenLink] = useState(null)
  const location = useLocation()

  const menuLinksRender = proMenuLinks?.map((link, index) => {
    return <div
      key={index}
      className="menu-link"
      onClick={() => setOpenLink(prev => prev === index ? null : index)}
    >
      {
        !link.sublinks ?
          <NavLink
            className="link-bar"
            to={`/dashboard/${link.url}`}
          >
            <span>
              <i className={link.icon} />
              {link.label}
            </span>
          </NavLink> :
          <div className={`link-bar has-sublinks ${openLink === index ? 'open' : ''}`}>
            <span>
              <i className={link.icon} />
              {link.label}
            </span>
            <i className="far fa-angle-right" />
          </div>
      }
      {
        link.sublinks &&
        <div className={`sublinks ${openLink === index ? 'open' : ''}`}>
          {link.sublinks.map((sublink, index) => {
            return <NavLink
              key={index * 100}
              to={`/dashboard/${sublink.url}`}
              className="sublink"
              onClick={(e) => e.stopPropagation()}
            >
              <i className={sublink.icon} />
              {sublink.label}
            </NavLink>
          })}
        </div>
      }
    </div>
  })

  useEffect(() => {
    const activeLink = proMenuLinks.findIndex(link => link.sublinks?.find(sublink => sublink.url === location.pathname.split('/')[2]))
    if (activeLink !== -1) {
      setOpenLink(activeLink)
    }
  },[])

  return (
    <div className="dashboard-sidebar">
      <div className="pro-logo">
        <h5>
          <i className="fas fa-flask" />
          Pro Dashboard
        </h5>
      </div>
      <div className="menu">
        {menuLinksRender}
      </div>
    </div>
  )
}
