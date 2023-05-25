import Register from "app/auth/Register"
import React from 'react'
import logo from 'app/assets/images/logo.png'
import { Link } from "react-router-dom"

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <Link
        to="/"
        className="logo-container"
      >
        <img src={logo} className="logo" alt="logo" />
        <h5>MARK<span>AI</span></h5>
      </Link>
      <Register />
    </div>
  )
}
