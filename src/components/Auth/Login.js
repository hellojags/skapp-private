import { Button, makeStyles } from '@material-ui/core'
import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Paper, withStyles, Grid, Link, Typography } from '@material-ui/core';
import { ReactComponent as Logo } from '../../assets/img/icons/logo.svg'
import { ReactComponent as Logo1 } from '../../assets/img/icons/logo1.svg'
import { ReactComponent as SiteLogoWhite } from '../../assets/img/icons/siteLogoWhite.svg'
import { ReactComponent as SiteLogoDark } from '../../assets/img/icons/siteLogoDark.svg'
import SnDisclaimer from "../Utils/SnDisclaimer";
import { useHistory } from "react-router-dom"
import { setLoaderDisplay } from '../../redux/action-reducers-epic/SnLoaderAction';
import { initMySky } from '../../service/skynet-api';
import { getProfile, getPreferences } from '../../service/SnSkappService';
import { setUserProfileAction } from '../../redux/action-reducers-epic/SnUserProfileAction';
import { setUserPreferencesAction } from '../../redux/action-reducers-epic/SnUserPreferencesAction';
import { getMyFollowersAction } from "../../redux/action-reducers-epic/SnMyFollowerAction"
import { getMyFollowingsAction } from "../../redux/action-reducers-epic/SnMyFollowingAction"
import { setUserSession } from "../../redux/action-reducers-epic/SnUserSessionAction"

const useStyles = makeStyles({
    input: {
        '&:focus': {
            outline: 'none',
            borderColor: '#1DBF73'
        },
        background: '#fff',
        border: '1px solid #D9E1EC',
        borderRadius: 8,
        height: 45,
        width: '100%',
        fontSize: 18,
        padding: 20,
        '@media only screen and (max-width: 1440px)': {
            height: 45,
            // width: '100%',
            fontSize: 16,
            padding: 15,
        },
        '@media only screen and (max-width: 575px)': {
            height: 45,
            // width: '100%',
            fontSize: '14px !important',
            padding: 10,
        }

    },
    loginFormContainer: {
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    lightText: {
        color: '#fff'
    },
    darkText: {
        color: '#2A2C34!important'
    },
    poweredBy: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        /* '& span': {
            color: '#fff'
        }, */
        marginTop: '2.5rem',
        marginBottom: '3.5rem'
    },
})
const Login = ({ toggle }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const userSession = useSelector((state) => state.userSession)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userID, setUserID] = useState();
    // choose a data domain for saving files in MySky
    const { installedAppsStoreForLogin } = useSelector((state) => state.snInstalledAppsStore);
    useEffect(() => {
        const initalizeMySky = async () => {
            if (userSession == null || userSession?.mySky == null) {
                const result = await initMySky();
                let userID = await result.userSession.mySky.userID();
                result.userSession.userID = userID;
                dispatch(setUserSession(result.userSession));
            }
            if (userSession?.mySky != null) {
                const loggedIn = await userSession.mySky.checkLogin();
                setIsLoggedIn(loggedIn)
            }
        }
        initalizeMySky();
    }, []);
    useEffect(() => {
        console.log("##### checkActiveLogin :: userSession = " + userSession);
        if (userSession?.mySky != null && isLoggedIn) {
            if (installedAppsStoreForLogin) {
                history.push('/');
            } else {
                history.push('/appstore');
            }
        }
    }, [userSession, isLoggedIn]);
    const handleLogin = async () => {
        let result = null;
        try {
            dispatch(setLoaderDisplay(true));
            const loggedIn = await userSession.mySky.checkLogin();
            if (!loggedIn) {
                await userSession.mySky.requestLoginAccess();
                const loggedIn = await userSession.mySky.checkLogin();
                if(loggedIn)
                {
                    const userProfile = await getProfile();
                    dispatch(setUserProfileAction(userProfile));
                    const userPrefrences = await getPreferences();
                    dispatch(setUserPreferencesAction(userPrefrences));
                    userSession.isLogin = true
                    dispatch(setUserSession(userSession));
                    setIsLoggedIn(true)
                }
            }
            dispatch(setLoaderDisplay(false));
        } catch (error) {
            console.log(error);
            dispatch(setLoaderDisplay(false));
        }
    }

    { toggle ? document.body.className = "darkBodyColor" : document.body.className = "lightBodyColor" }

    return (
        <div className={classes.loginFormContainer}>
            <form className={toggle ? 'darkLogin-form' : 'lightLogin-form'}>
                <div>
                    {toggle ? <Logo1 /> : <Logo />}
                    <h3 className={toggle ? classes.lightText : classes.darkText}>Sign In to Skapp</h3>
                    {(userSession?.mySky) ?
                        <Button onClick={handleLogin}> Login using MySky
                        </Button> :
                        <Button onClick={handleLogin}> Loading...
                        </Button>
                    }
                    <div className={classes.poweredBy}>
                        <span className={toggle ? classes.lightText : classes.darkText}>Powered by </span>
                        <SiteLogoDark />
                    </div>
                </div>
            </form>
        </div>
    )
}
export default Login
