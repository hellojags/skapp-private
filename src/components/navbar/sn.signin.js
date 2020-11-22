import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from '@material-ui/core';
import { connect } from "react-redux";
import { mapStateToProps, matchDispatcherToProps } from "./sn.topbar.container";
import { withRouter } from "react-router";
import { showBlockstackConnect, authenticate } from "@blockstack/connect";
import { APP_BG_COLOR, PUBLIC_TO_ACC_QUERY_PARAM, BROWSER_STORAGE, ID_PROVIDER_SKYID, ID_PROVIDER_SKYDB, ID_PROVIDER_BLOCKSTACK } from "../../sn.constants";
import { Tooltip } from "@material-ui/core";
import { authOrigin, appDetails, userSession } from "../../blockstack/constants";
import { bsClearStorage, bsGetImportedSpacesObj, bsSavePublicKey } from "../../blockstack/blockstack-api";
import SnInfoModal from "../modals/sn.info.modal";
import { getUserSessionType } from "../../sn.util";
import { snKeyPairFromSeed, snSerializeSkydbPublicKey } from "../../skynet/sn.api.skynet";



class SnSignin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      showInfoModal: false,
      onInfoModalClose: () => this.setState({ showInfoModal: false }),
      infoModalContent: "public"
    };
  }
  

  gotoSkydbLogin = () => {
    const publicHash = this.getPublicToAccHash();
    let queryParam = "";
    if (publicHash) {
      queryParam = "?" + PUBLIC_TO_ACC_QUERY_PARAM + "=" + publicHash;
    }
    this.props.history.push("/login" + queryParam);
  }

  doSignIn = () => {
    const publicHash = this.getPublicToAccHash();
    if (publicHash) {
      const queryParam = "?" + PUBLIC_TO_ACC_QUERY_PARAM + "=" + publicHash;
      this.props.history.push("/upload" + queryParam);
    }
    const authOptions = {
      redirectTo: "/",
      manifestPath: '/manifest.json',
      authOrigin,
      userSession,
      sendToSignIn: true,
      finished: async ({ userSession }) => {
        this.props.setUserSession(userSession);
        bsSavePublicKey(userSession);
        const importedSpace = await bsGetImportedSpacesObj(userSession, { isImport: true });
        // set shared spaces object to list all imported spaces {senderToSpacesMap={}, sharedByUserList=[]}
        this.props.setImportedSpace(importedSpace);
        this.props.setPersonGetOtherData(userSession.loadUserData());
      },
      appDetails: appDetails,
    };
    //this.props.userSession.redirectToSignIn();
    authenticate(authOptions);
  };
  doSignUp = () => {
    const publicHash = this.getPublicToAccHash();
    if (publicHash) {
      const queryParam = "?" + PUBLIC_TO_ACC_QUERY_PARAM + "=" + publicHash;
      this.props.history.push("/upload" + queryParam);
    }
    const authOptions = {
      redirectTo: "/",
      manifestPath: '/manifest.json',
      authOrigin,
      userSession,
      finished: ({ userSession }) => {
        this.props.setUserSession(userSession);
        this.props.setPersonGetOtherData(userSession.loadUserData());
      },
      appDetails: appDetails,
    };
    showBlockstackConnect(authOptions);
  };
  async componentDidMount() {
    // if (this.props.person == null) {
    //   if (this.props.userSession.isSignInPending && this.props.userSession.isSignInPending()) {
    //     this.props.fetchBlockstackPerson(this.props.userSession);
    //   } else if (this.getPublicToAccHash() != null) {
    //     // this.doSignUp();
    //     this.gotoSkydbLogin();
    //   }
    // } else {
    //   this.props.setImportedSpace(await bsGetImportedSpacesObj(this.props.userSession || userSession));
    // }
  }

  getPublicToAccHash = () => (new URLSearchParams(this.props.location.search)).get(PUBLIC_TO_ACC_QUERY_PARAM);

  handleClick = (event) => {
    this.setState({ anchorEl: event == null ? null : event.currentTarget });
  };

  logout = () => {
    this.props.logoutPerson(this.props.userSession);
    this.handleClick();
  };

  handleSettings = () => {
    this.handleClick();
    this.props.history.push("/settings");
  };

  onDownload = () => {
    console.log("topbar download button clicked");
  };

  clearAllStorage = async () => {
    this.props.setLoaderDisplay(true);
    await bsClearStorage(this.props.userSession);
    localStorage.clear();
    this.props.setLoaderDisplay(true);
    this.logout();
  };

  showSkydbPublicKey = () => {
    this.handleClick();
    this.setState({
      showInfoModal: true,
      infoModalContent: this.props.person.appPublicKey
    });
  };

  render() {
    return (
      <>
        {this.props.person == null && (
          <>
            {/* <Button
              onClick={this.gotoSkyIDLogin}
              variant="outlined"
              className="btn-login"
            >
              SkyID Login
            </Button>
            <Button
              onClick={this.gotoSkydbLogin}
              variant="outlined"
              className="btn-login"
            >
              Sky-DB Login
            </Button>
            <Button
              onClick={this.doSignIn}
              variant="outlined"
              className="btn-login"
            >
              BS Login
            </Button>
            <Button
              onClick={this.doSignUp}
              variant="contained"
              className="btn-signup"
            >
              Sign Up
            </Button> */}
            {/* <Grid container spacing={1} >
            <Grid item>
              <Button onClick={this.doSignIn} variant="outlined" style={{borderColor:APP_BG_COLOR, color: APP_BG_COLOR, fontWeight: "bold" }}>
                Login
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={this.doSignUp} variant="contained" style={{ background: APP_BG_COLOR, color: "white", fontWeight: "bold" }}>
                Sign Up
              </Button>
            </Grid>
          </Grid> */}
          </>
        )}
        {/* {this.props.person && (
          <>
            <Tooltip title="Download Skylink" arrow className="topbar-dwnld">
              <IconButton onClick={this.onDownload}>
                <CloudDownloadOutlinedIcon style={{ color: APP_BG_COLOR }} />
              </IconButton>
            </Tooltip>
            </>
            )} */}
        {this.props.person && (
          <>
            <Tooltip title={"Welcome " + this.props.person?.profile?.username?.replace(".id.blockstack", "") + " !"}>
              <Avatar
                alt="Remy Sharp"
                src=""
                className="app-bg-color cursor-pointer"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={(evt) => this.handleClick(evt)}
              >
                {this.props.person?.profile?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={() => this.handleClick()}
              className="avatar-menu"
            >
              <div style={{ color: APP_BG_COLOR, fontWeight: "bold" }}>
                {/* UserName: {this.props.person.profile.name} <br/> */}
                {/* UserID: {this.props.person?.profile?.username} */}
              </div>

              <MenuItem onClick={() => this.handleSettings()}>
                Settings
              </MenuItem>
              {(getUserSessionType(this.props.userSession) === ID_PROVIDER_SKYDB || getUserSessionType(this.props.userSession) === ID_PROVIDER_SKYID) && (<MenuItem onClick={() => this.showSkydbPublicKey()}>
                Show Public Key
              </MenuItem>)}
              {process.env.NODE_ENV !== 'production' && getUserSessionType(this.props.userSession) === ID_PROVIDER_BLOCKSTACK && <MenuItem onClick={this.clearAllStorage}>
                Clear BS Storage
              </MenuItem>}
              <MenuItem onClick={this.logout}>Logout</MenuItem>
            </Menu>
          </>
        )}
        <SnInfoModal
          open={this.state.showInfoModal}
          onClose={this.state.onInfoModalClose}
          title="Skydb Public Key"
          showClipboardCopy={true}
          clipboardCopyTooltip="Copy Public Key To Clipboard"
          content={this.state.infoModalContent}
        />
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  matchDispatcherToProps
)(withRouter(SnSignin));
