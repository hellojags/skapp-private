import { Button, makeStyles } from '@material-ui/core'
import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Paper, withStyles, Grid, Link, Typography } from '@material-ui/core';
import { ReactComponent as Logo } from '../../assets/img/icons/logo.svg'
import { ReactComponent as SiteLogoGray } from '../../assets/img/icons/siteLogoGray.svg'
import SnDisclaimer from "../Utils/SnDisclaimer";
import { useHistory } from "react-router-dom"
import { setLoaderDisplay } from '../../redux/action-reducers-epic/SnLoaderAction';
import { handleMySkyLogin } from '../../service/skynet-api';
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
    const stUserSession = useSelector((state) => state.userSession)

    const [userID, setUserID] = useState();
    // choose a data domain for saving files in MySky
    const dataDomain = 'localhost';

    useEffect(() => {
    }, []);

    const { installedAppsStoreForLogin } = useSelector((state) => state.snInstalledAppsStore);

    useEffect(() => {
        console.log("stUserSession=" + stUserSession);
        if (stUserSession?.mySky != null) {
            if (installedAppsStoreForLogin) {
                history.push('/');
            } else {
                history.push('/apps');
            }
        }
    }, [stUserSession]);
    const handleLogin = async () => {
        const result = await handleMySkyLogin();
        setUserID(result.userID);
        alert("result.userID : " + result.userID)
        await onMySkySuccess(result.mySky, result.userID);
        dispatch(setLoaderDisplay(true));
    }
    // login - helper functions
    const onMySkySuccess = async (mySky,userID) => {
        try {
            // create userSession Object
            let userSession = { idp: ID_PROVIDER_SKYID, mySky};
            const userProfileObj = await getUserProfile(userID);// dont proceed without pulling profile
            userSession = { ...userSession, userProfile: userProfileObj };
            dispatch(setUserSession(userSession));
            // get userFollowers
            dispatch(getMyFollowersAction(null));
            // get userFollowings
            dispatch(getMyFollowingsAction(null));
            dispatch(setLoaderDisplay(false));
            //window.history.pushState({}, '', '/appdetail')
        }
        catch (error) {
            console.log("Error during login process. login failed");
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
