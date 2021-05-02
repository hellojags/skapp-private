import React from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import LandingPageNavbar from './LandingPageNavbar'
import Navbar from './Navbar'

const Nav = () => {
    let location = useLocation()
    let userSession = useSelector((state) => state.userSession)
    const navbar = (!userSession || location.pathname === '/login') ? <LandingPageNavbar /> : <Navbar />
    return (
        <div>
            {navbar}
        </div>
    )
}

export default Nav
