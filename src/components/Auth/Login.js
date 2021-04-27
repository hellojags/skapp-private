import { Button, makeStyles } from '@material-ui/core'
import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Paper, withStyles, Grid, Link, Typography } from '@material-ui/core';
import { ReactComponent as Logo } from '../../assets/img/icons/logo.svg'
import { ReactComponent as SiteLogoGray } from '../../assets/img/icons/siteLogoGray.svg'
import SnDisclaimer from "../Utils/SnDisclaimer";
import { useHistory } from "react-router-dom"
import { setLoaderDisplay } from '../../redux/action-reducers-epic/SnLoaderAction';
import { initMySky } from '../../service/skynet-api';
import { getUserProfile } from '../../service/SnSkappService';
import { ID_PROVIDER_SKYID } from "../../utils/SnConstants";

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
        alignItems: 'center'
    },
    poweredBy: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& span': {
            color: '#4E4E4E'
        },
        marginTop: '2.5rem',
        marginBottom: '3.5rem'
    }
})
const Login = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const userSession = useSelector((state) => state.userSession)

    const [userID, setUserID] = useState();
    // choose a data domain for saving files in MySky
    const dataDomain = 'localhost';
    const { installedAppsStoreForLogin } = useSelector((state) => state.snInstalledAppsStore);

    useEffect(() => {
        console.log("userSession=" + userSession);
        if (userSession?.mySky != null) {
            if (installedAppsStoreForLogin) {
                history.push('/');
            } else {
                history.push('/apps');
            }
        }
    }, [userSession]);

    const handleLogin = async () => {
        let result =null;
        try {
            dispatch(setLoaderDisplay(true));
            //console.log("BEFORE: userSession" + userSession);
            // if user session and mysky is present and user is already logged in
            if (userSession != null && userSession?.mySky != null) {
                const loggedIn = await userSession.mySky.checkLogin();
                if (!loggedIn) {
                    await userSession.mySky.requestLoginAccess();
                }
                return;
            }
            else {
                result = await initMySky();
                if (!result.loggedIn) {
                    await result.userSession.mySky.requestLoginAccess();
                    let userID = await result.userSession.mySky.userID();
                    result.userSession.userID = userID;
                }
            }
            await dispatch(setUserSession(result.userSession));
            // on success do following
            //alert("handleLogin: newSession " + result.userSession);
            //alert("handleLogin: newSession " + result.userSession.userID);
            const userProfileObj = await getUserProfile(result.userSession);// dont proceed without pulling profile
            //newSession = { ...newSession, userProfile: userProfileObj};
            //alert("AFTER: userSession(old)" + userSession);
            //history.push('/apps');
            // get userFollowers
            //await dispatch(getMyFollowersAction(null));
            // get userFollowings
            //await dispatch(getMyFollowingsAction(null));
            //window.history.pushState({}, '', '/appdetail')
            dispatch(setLoaderDisplay(false));
        } catch (error) {
            console.log(error);
            dispatch(setLoaderDisplay(false));
        }
    }
    return (
        <div className={classes.loginFormContainer}>
            <form className="login-form">
                <div>
                    <Logo />
                    <h3>Sign In to Skapp</h3>
                    <Button onClick={handleLogin}> Login using MySky
                    </Button>
                    <div className={classes.poweredBy}>
                        <span>Powered by </span><SiteLogoGray />
                    </div>
                </div>
            </form>
        </div>
    )
}
export default Login
