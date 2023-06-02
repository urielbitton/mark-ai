import Login from "app/auth/Login"
import React, { useContext, useEffect } from 'react'
import logo from 'app/assets/images/logo.png'
import { Link, useNavigate } from "react-router-dom"
import { StoreContext } from "app/store/store"

export default function LoginPage() {

  const { myUser } = useContext(StoreContext)
  const navigate = useNavigate()

  useEffect(() => {
    if(myUser) {
      navigate('/')
    }
  }, [myUser])

  return myUser !== null ? (
    <div className="auth-page">
      <Link 
        to="/" 
        className="logo-container"
      >
        <img src={logo} className="logo" alt="logo" />
        <h5>MARK<span>AI</span></h5>
      </Link>
      <Login />
    </div>
  ) :
  null
}
