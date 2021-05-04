import React from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import LandingPageNavbar from './LandingPageNavbar'
import Navbar from './Navbar'

const Nav = ({toggle, setToggle}) => {
    let location = useLocation()
    let userSession = useSelector((state) => state.userSession)
    // const navbar = (!userSession || location.pathname === '/login') ? <LandingPageNavbar /> : <Navbar toggle={toggle} setToggle={setToggle} />
    const navbar = (!userSession || location.pathname === '/login') ? <Navbar toggle={toggle} setToggle={setToggle} /> : <LandingPageNavbar />
    return (
        <div>
            {navbar}
        </div>
    )
}

export default Nav
