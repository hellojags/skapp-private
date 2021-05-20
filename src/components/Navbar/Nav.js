import React,{useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useHistory } from "react-router-dom"
import LandingPageNavbar from './LandingPageNavbar'
import Navbar from './Navbar'

const Nav = ({ toggle, setToggle }) => {
    let location = useLocation()
    const history = useHistory()
    let userSession = useSelector((state) => state.userSession)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (userSession?.mySky) {
            userSession.mySky.checkLogin().then((loginStatus) => {
                setIsLoggedIn(loginStatus)
                if(loginStatus)
                    history.push('/appstore');
            })
        }
    }, [userSession]);
    let Navigation =  (isLoggedIn == false || location.pathname === '/login') ?
    <LandingPageNavbar toggle={toggle} setToggle={setToggle} /> :
    <Navbar toggle={toggle} setToggle={setToggle} /> ;
    return (
        <div>
            {Navigation}
        </div>
    )
}

export default Nav
