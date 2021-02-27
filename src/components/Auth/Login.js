import { Button, makeStyles } from '@material-ui/core'
import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Paper, withStyles, Grid, Link, Typography } from '@material-ui/core';
import { ReactComponent as Logo } from '../../assets/img/icons/logo.svg'
import { ReactComponent as SiteLogoGray } from '../../assets/img/icons/siteLogoGray.svg'
import skyId from '../../service/idp/SnSkyId'
import SnDisclaimer from "../Utils/SnDisclaimer";
import { useHistory } from "react-router-dom"

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
    const person = useSelector((state) => state.person)
    const stUserSession = useSelector((state) => state.userSession)

    const [seed, setSeed] = useState('')
    const [value, setValue] = useState(1)
    const [isTemp, setIsTemp] = useState(true)
    //const [skyid, setSkyid] = useState(skyidObj)

    useEffect(() => {
        console.log("skyid=" + skyId);
    });

    useEffect(() => {
        console.log("stUserSession=" + stUserSession);
        if(stUserSession != null)
        {
            history.push('/apps');
        }
    },[stUserSession]);

    const loginSkyID = async () => {
        skyId.sessionStart();
       // dispatch(setLoaderDisplay(true));
    }
    const handleChange = (event, newValue) => {
        setValue(newValue)
    };
    return (
        <div className={classes.loginFormContainer}>
            <form className="login-form">
                <div>
                    <Logo />
                    <h3>Sign In to Skapp</h3>
                    {/* <p>
                        <small>
                            Enter your secret key to continue <span className="secrect-key">Create a Secret Key</span>
                        </small>

                    </p> 
                    <input className={classes.input} type="text" placeholder="12 - Word Secret Key" />*/}
                    {/* type="submit" */}
                    <Button type="submit" onClick={loginSkyID}> Login using SkyID
                   {/* <Link to="/apps" className="link" /> */}

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
