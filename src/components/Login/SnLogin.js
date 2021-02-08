import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Paper, withStyles, Grid, Button, Link, Typography } from '@material-ui/core';
import styles from "./SnLoginStyles";
import { connect } from "react-redux";
import { bsGetImportedSpacesObj, getUserProfile, syncData, firstTimeUserSetup } from '../../service/SnSkappService';
import skyId from '../../service/idp/SnSkyId'
import { ID_PROVIDER_SKYID } from "../../utils/SnConstants";
import SnDisclaimer from "../Utils/SnDisclaimer";
import useStyles from "./SnLoginStyles"
import { useHistory } from "react-router-dom"
import { clearAllfromIDB, IDB_STORE_SKAPP } from "../../service/SnIndexedDB"
// actions 
import { setLoaderDisplay } from "../../redux/action-reducers-epic/SnLoaderAction"
import { logoutPerson, setPersonGetOtherData } from "../../redux/action-reducers-epic/SnPersonAction"
import { getUserProfileAction } from "../../redux/action-reducers-epic/SnUserProfileAction"
import { getUserMasterProfileAction } from "../../redux/action-reducers-epic/SnUserMasterProfileAction"
import { getMyFollowersAction } from "../../redux/action-reducers-epic/SnMyFollowerAction"
import { getMyFollowingsAction } from "../../redux/action-reducers-epic/SnMyFollowingAction"
import { setUserSession } from "../../redux/action-reducers-epic/SnUserSessionAction"

// let devMode = false;
// if (window.location.hostname == 'idtest.local' || window.location.hostname == 'localhost' || window.location.protocol == 'file:') {
//     devMode = true
// } else {
//     devMode = false
// }
// const skyidObj = new SkyID('skapp', skyidEventCallback, { devMode: process.env.NODE_ENV !== 'production' });

export default function SnLogin(props) {
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

    // // Run Only Once
    // useEffect(() => {
    //     console.log("skyid=" + skyid);
    // }, []);

    // // Run this code everytime on render
    // useEffect(() => {
    //     //setSkyid(new SkyID('skapp', skyidEventCallback, { devMode: process.env.NODE_ENV !== 'production' }));
    //     if (person) {
    //         props.history.push("/appstore");
    //     }
    // });
    // function skyidEventCallback(message) {
    //     switch (message) {
    //         case 'login_fail':
    //             console.log('Login failed')
    //             dispatch(setLoaderDisplay(false));
    //             break;
    //         case 'login_success':
    //             console.log('Login succeed!')
    //             onSkyIdSuccess();
    //             break;
    //         case 'destroy':
    //             console.log('Logout succeed!');
    //             onSkyIdLogout();
    //             break;
    //         default:
    //             console.log(message)
    //             dispatch(setLoaderDisplay(false));
    //             break;
    //     }
    // }
    const loginSkyID = async () => {
        skyId.sessionStart();
       // dispatch(setLoaderDisplay(true));
    }
    // const onSkyIdLogout = async () => {
    //     try {
    //         dispatch(logoutPerson(stUserSession))
    //         clearAllfromIDB({ store: IDB_STORE_SKAPP })
    //         dispatch(setLoaderDisplay(false))
    //         window.location.href = window.location.origin
    //     } catch (e) {
    //         console.log("Error during logout process.")
    //         dispatch(setLoaderDisplay(false))
    //     }
    // }
    // const onSkyIdSuccess = async () => {
    //     try {
    //         // create userSession Object
    //         let userSession = { idp: ID_PROVIDER_SKYID, skyid: skyId };
    //         const personObj = await getUserProfile(userSession);// dont proceed without pulling profile
    //         userSession = { ...userSession, person: personObj };
    //         dispatch(setUserSession(userSession));
    //         // For first time user only 
    //         let isFirstTime = await firstTimeUserSetup(userSession);
    //         if (!isFirstTime)//if not firsttime call data sync 
    //         {
    //             // call dataSync
    //             await syncData(userSession);
    //         }
    //         dispatch(setPersonGetOtherData(personObj));
    //         //dispatch(setImportedSpace(await bsGetImportedSpacesObj(userSession)));
    //         // get app profile
    //         dispatch(getUserProfileAction(userSession));
    //         dispatch(getUserMasterProfileAction(userSession));
    //         // get userFollowers
    //         dispatch(getMyFollowersAction(null));
    //         // get userFollowings
    //         dispatch(getMyFollowingsAction(null));
    //         dispatch(setLoaderDisplay(false));
    //         props.history.push("/appdetail");
    //     }
    //     catch (error) {
    //         console.log("Error during login process. login failed");
    //         dispatch(setLoaderDisplay(false));
    //     }
    // }
    const handleChange = (event, newValue) => {
        setValue(newValue)
    };
    return (
        <div style={{ paddingTop: 100 }}>
            <SnDisclaimer />
            <Grid container spacing={3} className={`most_main_grid_auth ${classes.most_main_grid_auth}`}>
                <Grid item lg={4} md={5} sm={7} xs={12} className={classes.main_grid_auth}>
                    <Paper className={`${classes.paper} ${classes.MaintabsPaper}`}>
                        <Grid container spacing={3} className="inpt-mail-pass-main-grid">
                            <Grid item lg={12} className={classes.mail_inpt_grid} style={{ margin: "auto" }}>
                                <div>
                                    <Typography style={{ color: "#1DD65F", fontWeight: "600", fontSize: 30 }}>
                                        Own Your App
                                        </Typography>
                                </div>
                                <Grid container spacing={3}>
                                    <Grid item lg={8} xs={12} style={{ margin: "auto" }}>
                                        <Button variant="contained" className={classes.butn_login} onClick={loginSkyID}>
                                            Login using SkyID
                                            </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Grid container spacing={3}>
                        <Grid item xs={12} className={classes.description_auth}>
                            Registring to Skapp,you accept our{" "}
                            <span style={{ color: "#1DD65F", fontWeight: "600" }}>
                                <Link rel="noopener noreferrer" target="_blank" href="https://skapp.hns.siasky.net/skapp/skapp-Terms.pdf">Terms of use</Link>
                            </span>{" "}and our{" "}
                            <span style={{ color: "#1DD65F", fontWeight: "600" }}>
                                <Link rel="noopener noreferrer" target="_blank" href="https://skapp.hns.siasky.net/skapp/skapp-Privacy Notice.pdf">Privacy policy</Link>
                            </span>
                            <br />
                            <span>
                                <Link rel="noopener noreferrer" target="_blank" href="mailto:hello@skyspaces.io"><span class="fa fa-envelope"></span> hello@skyspaces.io</Link>
                            </span>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};