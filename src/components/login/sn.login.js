import React from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons';
import {
    mapStateToProps,
    matchDispatcherToProps,
} from "./sn.login.container";
import { connect } from "react-redux";
import { bsGetImportedSpacesObj, bsGetSkyIDProfile } from '../../blockstack/blockstack-api';
import SkyID from "skyid";
import {ID_PROVIDER_SKYID, PUBLIC_TO_ACC_QUERY_PARAM} from "../../sn.constants"

const styles = theme => ({
    margin: {
        margin: theme.spacing.unit * 2,
    },
    padding: {
        padding: theme.spacing.unit
    },
    paddingTop: {
        paddingTop: 200
    }
});

if (window.location.hostname == 'idtest.local' || window.location.hostname == 'localhost' || window.location.protocol == 'file:') {
    var devMode = true
} else {
    var devMode = false
}
const opts = { 'devMode': devMode }


class snLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seed: null,
            skyid: null,
        }
        //this.initializeSkyId = this.initializeSkyId.bind(this);
        this.onSkyIdSuccess = this.onSkyIdSuccess.bind(this);
        this.skyidEventCallback = this.skyidEventCallback.bind(this)
    }
    getPublicToAccHash = () => (new URLSearchParams(this.props.location.search)).get(PUBLIC_TO_ACC_QUERY_PARAM);

    async componentDidMount() {

        this.initializeSkyId();
        if (this.props.showDesktopMenu === false) {
            this.props.setDesktopMenuState(true);
        }
        // if we have active per or session object we shall directly login ?
        // if (this.props.person) {
        //     this.props.history.push("/upload");
        // }

    }

    componentDidUpdate() {
        // if (this.props.person) {
        //     this.props.history.push("/upload");
        // }
    }
    // Sample Object skyId and Profile
    // skyId -->
    // {
    //     callback: function () { [native code] },
    //     appId: "SkySpaces",
    //     opts: {
    //         devMode: true,
    //     },
    //     seed: "e26283c753cf0fefb577ee1d3d999c401f897127123471343d93c0366f6aa1c3",
    //     userId: "c1a956eb2cc4fc9c2d34c9a48eae8dba7ad89c7a57d6f55f320c07f9c1eb8ea7",
    //     url: "http://localhost:3000/",
    //     appImg: null,
    // }
    // SkyID Profile Object - using Master PublicKey -->
    // {
    //     "username": "skyspaces",
    //     "aboutMe": "",
    //     "dapps": {
    //       "Example skapp": {
    //         "url": "https://sky-note.hns.siasky.net/",
    //         "publicKey": "fb1e595e70cd02845583a2e7b8a4c0278744cecebbf3aef8474ae9c8932c2b2e",
    //         "img": null
    //       },
    //       "SkySpaces": {
    //         "url": "http://localhost:3000/",
    //         "publicKey": "370a627bc1f86a58f9d4bce067e3f23540f9bc6281532532df0aae0d04d07f04",
    //         "img": null
    //       },
    //       "skyfeed": {
    //         "url": "https://sky-id.hns.siasky.net/?appId=skyfeed&redirect=backConnect",
    //         "publicKey": "b7fe28de361766b730ea169226352198fe3e4a2995454045f1787d5a528eb40f",
    //         "img": null
    //       }
    //     }
    //   }
    
    async onSkyIdSuccess(message) {
        // seed, userId
        let userSession = {idp: ID_PROVIDER_SKYID, skyid: this.state.skyid};
        const personObj = await bsGetSkyIDProfile(userSession);// dont proceed without pulling profile
        userSession = {...userSession, person: personObj};
        this.props.setUserSession(userSession);
        this.props.setPersonGetOtherData(personObj);
        this.props.setImportedSpace(await bsGetImportedSpacesObj(userSession));
        this.props.setLoaderDisplay(false);
        this.props.history.push("/upload" + this.props.location.search);
    }
    skyidEventCallback(message) {
        switch (message) {
            case 'login_fail':
                console.log('Login failed')
                break;
            case 'login_success':
                console.log('Login succeed!')
                this.onSkyIdSuccess(message);
                break;
            case 'destroy':
                console.log('Logout succeed!')
                break;
            default:
                console.log(message)
                break;
        }
    }
    initializeSkyId = () => {
        const skyid = new SkyID('SkySpaces', this.skyidEventCallback, opts);
        this.setState({ skyid: skyid });
    }

    handleSeedChange = (evt) => {
        this.setState({
            seed: evt.target.value
        });
    }

    login = async () => {
        this.state.skyid.sessionStart();
        this.props.setLoaderDisplay(true);
        // const personObj = {
        //     username: this.state.seed,
        //     profile: {
        //         did: this.state.seed
        //     }
        // }
        // this.state.skyid.sessionStart();
        // this.props.setUserSession(userSession);
        // this.props.setPersonGetOtherData(personObj);
        // this.props.setImportedSpace(await bsGetImportedSpacesObj(userSession));
        // this.props.setLoaderDisplay(false);
        //this.props.history.push("/upload" + this.props.location.search);
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.paddingTop} >
                <Paper className={classes.padding} style={{ borderBlockColor: 'lightGreen' }}>
                    {/* App Tabs
                Blockstakc Login Button
                SkyID Login Button 
                Ceramic Login Button */}
                    <div className={classes.margin}>
                        {/* <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <Face />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="username" label="Username" type="email" fullWidth autoFocus required />
                        </Grid>
                    </Grid> */}
                        {/* commented to enable SkyID */}
                        {/* <Grid container spacing={8} alignItems="flex-end">
                            <Grid item>
                                <Fingerprint />
                            </Grid>
                            <Grid item md={true} sm={true} xs={true}>
                                <TextField id="seed" label="Seed" type="text" onChange={this.handleSeedChange} fullWidth required />
                            </Grid>
                        </Grid> */}
                        {/* <Grid container alignItems="center" justify="space-between">
                        <Grid item>
                            <FormControlLabel control={
                                <Checkbox
                                    color="primary"
                                />
                            } label="Remember me" />
                        </Grid>
                    </Grid> */}
                        <Grid container justify="center" alignItems="center" style={{ marginTop: '10px' }}>
                            <Grid item md={true} sm={true} xs={true} justify="center">
                                <div className="blockquote" color="primary" >Skynet App Store - Explore power of Free Internet Apps!</div>
                            </Grid>
                        </Grid>
                        <Grid container justify="center" style={{ marginTop: '10px' }}>
                            <Button
                                onClick={this.login}
                                variant="contained"
                                style={{ textTransform: "none" }}
                                size="medium" className={ '${classes.margin} btn-login'}>
                                Login with SkyID
                            </Button>
                        </Grid>
                        <Grid container justify="center" alignItems="center" style={{ marginTop: '10px' }}>
                            <Grid item md={true} sm={true} xs={true} justify="center">
                                <div className="h3-responsive" style={{ color: 'grey' }}>SkyID is thirdpaty Skapp. you can review code here github link!</div>
                            </Grid>
                        </Grid>
                    </div>
                </Paper>
            </div >
        );
    }
}

export default withStyles(styles, { withTheme: true })
    (
        connect(mapStateToProps, matchDispatcherToProps)(snLogin)
    );