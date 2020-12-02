import React from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox, Tabs, Tab, InputAdornment, Typography } from '@material-ui/core';
import LockIcon from "@material-ui/icons/Lock";
import { Face, Fingerprint, PermIdentity } from '@material-ui/icons';
import styles from "./sn.login.styles";
import {
    mapStateToProps,
    matchDispatcherToProps,
} from "./sn.login.container";
import { connect } from "react-redux";
import { bsGetImportedSpacesObj,bsGetSkyIDProfile,syncData , firstTimeUserSetup } from '../../blockstack/blockstack-api';
import SkyID from "skyid";
import {ID_PROVIDER_SKYID} from "../../sn.constants";

let devMode = true;
if (window.location.hostname == 'idtest.local' || window.location.hostname == 'localhost' || window.location.protocol == 'file:') {
     devMode = true
} else {
     devMode = true
}
class snLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seed: null,
            value: 1,
            isTemp: true,
            skyid: null,
        }
        this.onSkyIdSuccess = this.onSkyIdSuccess.bind(this);
        this.skyidEventCallback = this.skyidEventCallback.bind(this)
    }
    componentDidMount() {
        this.initializeSkyId({devMode : true});
        if (this.props.showDesktopMenu === false) {
            this.props.setDesktopMenuState(true);
        }
        if (this.props.person) {
            this.props.history.push("/upload");
        }
    }
    componentDidUpdate() {
        if (this.props.person) {
            this.props.history.push("/upload");
        }
    }
    handleSeedChange = (evt) => {
        this.setState({
            seed: evt.target.value
        });
    }
    initializeSkyId = (opts) => {
        this.setState({ skyid: new SkyID('SkySpaces', this.skyidEventCallback, opts) });
    }
    loginSkyID = async () => {
        this.state.skyid.sessionStart();
        this.props.setLoaderDisplay(true);
    }
    skyidEventCallback(message) {
        switch (message) {
            case 'login_fail':
                console.log('Login failed')
                this.props.setLoaderDisplay(false);
                break;
            case 'login_success':
                console.log('Login succeed!')
                this.onSkyIdSuccess(message);
                break;
            case 'destroy':
                console.log('Logout succeed!')
                this.props.setLoaderDisplay(false);
                break;
            default:
                console.log(message)
                this.props.setLoaderDisplay(false);
                break;
        }
    }
    async onSkyIdSuccess(message) {
        try
        {
        // create userSession Object
        let userSession = { idp: ID_PROVIDER_SKYID, skyid: this.state.skyid };
        const personObj = await bsGetSkyIDProfile(userSession);// dont proceed without pulling profile
        userSession = { ...userSession, person: personObj };
        this.props.setUserSession(userSession);
        // For first time user only 
        let isFirstTime = await firstTimeUserSetup(userSession);
        if (!isFirstTime)//if not firsttime call data sync 
        {
            // call dataSync
            await syncData(userSession);
        }
        this.props.setPersonGetOtherData(personObj);
        this.props.setImportedSpace(await bsGetImportedSpacesObj(userSession));
        this.props.setLoaderDisplay(false);
        this.props.history.push("/upload" + this.props.location.search);
        }
        catch(error){
            console.log("Error during login process. login failed");
            this.props.setLoaderDisplay(false);
        }
    }
    login = async () => {
        if (this.state.seed && this.state.seed.trim().length > 0) {

            const personObj = {
                username: this.state.seed,
                profile: {
                    decentralizedID: this.state.seed
                }
            }
            this.props.setLoaderDisplay(true);
            const userSession = { skydbseed: this.state.seed };
            this.props.setUserSession(userSession);
            this.props.setPersonGetOtherData(personObj);
            this.props.setImportedSpace(await bsGetImportedSpacesObj(userSession));
            this.props.setLoaderDisplay(false);
            this.props.history.push("/upload" + this.props.location.search);
        } else {
            console.log("no seed");
        }
    }
    handleChange = (event, newValue) => {
        this.setState({ value: newValue });
    };

    render() {
        const { classes } = this.props;
        const { value } = this.state;
        return (
            <div style={{ paddingTop: 150 }}>
                <Grid
                    container
                    spacing={3}
                    className={`most_main_grid_auth ${classes.most_main_grid_auth}`}
                >
                    <Grid
                        item
                        lg={4}
                        md={5}
                        sm={7}
                        xs={12}
                        className={classes.main_grid_auth}
                    >
                        <Paper className={`${classes.paper} ${classes.MaintabsPaper}`}>
                            {/* <Paper className={classes.tabsPaper}>
                                <Tabs
                                    value={value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                    aria-label="disabled tabs example"
                                >
                                    <Tab
                                        label="Sign up"
                                        className={classes.butn_tab1, "d-none"}
                                        active={true}
                                        style={{
                                            background: `${value == 0 ? "white" : "#F3F3F3"}`,
                                        }}
                                    />
                                    <Tab
                                        label="Login"
                                        className={classes.butn_tab1}
                                        style={{
                                            background: `${value == 1 ? "white" : "#F3F3F3"}`,
                                        }}
                                    />
                                </Tabs>
                            </Paper> */}
                            {/* container for input username or email */}
                            <Grid container spacing={3} className="inpt-mail-pass-main-grid">
                                {value === 0 ? (
                                    <Grid item lg={12} className={classes.mail_inpt_grid}>
                                        <div>
                                            <TextField
                                                className={`${classes.margin} ${classes.mail_textfield}`}
                                                id="input-with-icon-textfield"
                                                placeholder="Username or Email"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PermIdentity
                                                                style={{ content: "none", color: "lightGray" }}
                                                            />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            {/* password */}

                                            <TextField
                                                className={`${classes.margin} ${classes.password_textfield}`}
                                                id="input-with-icon-textfield"
                                                placeholder="Password"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment
                                                            position="start"
                                                            style={{ content: "none", color: "lightGray" }}
                                                        >
                                                            <LockIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </div>

                                        <Typography
                                            variant="span"
                                            className={classes.txt_span_frgt_pass}
                                        >
                                            Forgot Your Password?
                                        </Typography>

                                        <Grid container spacing={3}>
                                            <Grid item xs={8} style={{ margin: "auto" }}>
                                                <Button
                                                    variant="contained"
                                                    className={classes.butn_login}
                                                    onClick={() => console.log("history.push dashboard")}
                                                >
                                                    Sign up
                                            </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ) : (
                                        <Grid item lg={12} className={classes.mail_inpt_grid}>
                                            <div>
                                                {/* <TextField
                                                    className={`${classes.margin} ${classes.mail_textfield}`}
                                                    id="input-with-icon-textfield"
                                                    placeholder="Seed"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PermIdentity style={{ color: "lightGray" }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    onChange={this.handleSeedChange}
                                                    required
                                                /> */}
                                                <Typography style={{ color: "#1DD65F", fontWeight: "600", fontSize: 30 }}>
                                                    Own Your Space
                                                </Typography>
                                                <TextField
                                                    className={`${classes.margin} ${classes.password_textfield} d-none`}
                                                    id="input-with-icon-textfield"
                                                    placeholder="Password"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment
                                                                position="start"
                                                                style={{ content: "none", color: "lightGray" }}
                                                            >
                                                                <PermIdentity />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </div>

                                            <Typography
                                                variant="span"
                                                className={classes.txt_span_frgt_pass, "d-none"}
                                            >
                                                Forgot Your Password?
                                            </Typography>
                                            <Grid container spacing={3}>
                                                <Grid item xs={8} style={{ margin: "auto" }}>
                                                    <Button
                                                        variant="contained"
                                                        className={classes.butn_login}
                                                        onClick={this.loginSkyID}
                                                    >
                                                        Login using SkyID
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    )}
                            </Grid>
                        </Paper>
                        <Grid container spacing={3}>
                            <Grid item xs={12} className={classes.description_auth}>
                            <span style={{ fontWeight: "400" }}>
                            Note: This update of SkySpaces introduces breaking changes,<br/>  
                            Old version of app is available at - <a src="https://skyspaces.io"  class="cursor-pointer">https://skyspaces.io</a> <br/> 
                            We will provide in-app data migration option soon...<br/> 
                            </span> 
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} className={classes.description_auth}>
                                Registring to SkySpaces,you accept our{" "}
                                <span style={{ color: "#1DD65F", fontWeight: "600" }}>
                                    Terms of use
                                </span>{" "}and <br /> our{" "}
                                <span style={{ color: "#1DD65F", fontWeight: "600" }}>
                                    Privacy policy
                                </span>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default withStyles(styles, { withTheme: true })
    (
        connect(mapStateToProps, matchDispatcherToProps)(snLogin)
    );