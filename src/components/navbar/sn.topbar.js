import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import skyapplogo from "../../SkySpaces_g.png";
import FormControl from '@material-ui/core/FormControl';
import skyapplogo_only from "../../SkySpaces_logo_transparent_small.png";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import InputLabel from '@material-ui/core/InputLabel';
import Link from '@material-ui/core/Link';
import MuiAlert from "@material-ui/lab/Alert";
import Select from '@material-ui/core/Select';
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import Tooltip from "@material-ui/core/Tooltip";
import AppBar from "@material-ui/core/AppBar";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Toolbar from "@material-ui/core/Toolbar";
import clsx from "clsx";
import AppsOutlinedIcon from "@material-ui/icons/AppsOutlined";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import Search from "@material-ui/icons/Search";
import MenuIcon from "@material-ui/icons/Menu";
import { APP_BG_COLOR, DEFAULT_PORTAL, PUBLIC_SHARE_APP_HASH, PUBLIC_SHARE_ROUTE } from "../../sn.constants";
import { NavLink } from "react-router-dom";
import CloudDownloadOutlinedIcon from "@material-ui/icons/CloudDownloadOutlined";
import { getAllPublicApps, launchSkyLink, subtractSkapps } from "../../sn.util";
import { parseSkylink, SkynetClient } from "skynet-js";
import {
  getSkylinkIdxObject,
  getSkylink,
} from "../../blockstack/blockstack-api";
import SnSignin from "./sn.signin";
import { connect } from "react-redux";
import { getPublicApps, getSkylinkPublicShareFile } from "../../skynet/sn.api.skynet";
import SnInfoModal from "../modals/sn.info.modal";
import {
  syncData, firstTimeUserSetup
} from "../../blockstack/blockstack-api";
import SnDataSync from '../datasync/sn.datasync';
import { SUCCESS } from '../../blockstack/constants';
import { useSelector, useDispatch } from "react-redux";
// Actions
import { setMobileMenuDisplay,
  toggleMobileMenuDisplay
  } from "../../reducers/actions/sn.mobile-menu.action";
import { fetchBlockstackPerson,
logoutPerson,setPerson,
setPersonGetOtherData } from "../../reducers/actions/sn.person.action";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";
import { toggleDesktopMenuDisplay } from "../../reducers/actions/sn.desktop-menu.action";
import { fetchPublicApps, setApps } from "../../reducers/actions/sn.apps.action";
import {setUserSession } from "../../reducers/actions/sn.user-session.action"
import { fetchAppsSuccess } from "../../reducers/actions/sn.apps.action";
import { setImportedSpace } from "../../reducers/actions/sn.imported-space.action";
import { makeStyles } from "@material-ui/core/styles";
import useInterval from 'react-useinterval';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  portalFormControl: {
    marginBottom: 10
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SnTopBar(props) {
  // static propTypes = {
  //   match: PropTypes.object.isRequired,
  //   location: PropTypes.object.isRequired,
  //   history: PropTypes.object.isRequired,
  // };

  // constructor(props) {
  //   super(props);
  //   = {
  //     searchStr: "",
  //     invalidSkylink: false,
  //     publicPortal: DEFAULT_PORTAL,
  //     showInfoModal: false,
  //     infoModalContent: "",
  //     syncStatus: null,
  //     onInfoModalClose: () => setState({ showInfoModal: false })
  //   };
  // }
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  // local
  const [searchStr, setSearchStr] = useState("");
  const [invalidSkylink, setInvalidSkylink] = useState(false);
  const [publicPortal, setPublicPortal] = useState(DEFAULT_PORTAL);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState("");
  const [syncStatus, setSyncStatus] = useState(null);

  // Store
  const showMobileMenu = useSelector((state) => state.snShowMobileMenu);
  const userSession = useSelector((state) => state.userSession);
  const snPortalsList = useSelector((state) => state.snPortalsList);
  const snApps = useSelector((state) => state.snApps);
  const person = useSelector((state) => state.person);
  const triggerSignIn = useSelector((state) => state.snTriggerSignin);
  const snUserSetting = useSelector((state) => state.snUserSetting);
  const snTopbarDisplay = useSelector((state) => state.snTopbarDisplay);
  const snShowDesktopMenu = useSelector((state) => state.snShowDesktopMenu);
  const snPublicHash = useSelector((state) => state.snPublicHash);
  const snPublicInMemory = useSelector((state) => state.snPublicInMemory);

  const onInfoModalClose = () => {
    setShowInfoModal(false);
  }

  // useInterval(() => {
  //   // Your custom logic here
  //   postSync()
  // }, 30000);

  const postSync = async () => {
    setSyncStatus('synced');
    let status = await syncData(userSession, null, null);// for now skydb datakey and idb StoreName is abstracted 
    //let status = await firstTimeUserSetup(userSession, null, null);
    alert("Success " + status);
    if (status == SUCCESS) {
      setSyncStatus('synced');
    }
    // alert("postSync clicked !!");
    // navigator.serviceWorker.ready.then((swRegistration) => swRegistration.sync.register('post-data')).catch(console.log);

    // const status = await navigator.permissions.query({
    //   name: 'periodic-background-sync',
    // });
    // if (status.state === 'granted') {
    //   // Periodic background sync can be used.
    //   alert("periodic sync can be used !!");
    // } else {
    //   // Periodic background sync cannot be used.
    //   alert("periodic sync can NOT be used !!");
    //   navigator.serviceWorker.ready.then(function(registration) {
    //     registration.periodicSync.permissionState().then(function(state) {
    //       if (state == 'prompt') 
    //       alert("showSyncRegisterUI here for permission");
    //     });
    //   });
    // }

    // Periodic Sync Check
    // https://web.dev/periodic-background-sync/
    // https://github.com/WICG/background-sync/tree/master/explainers
    // const registration = await navigator.serviceWorker.ready;
    // if ('periodicSync' in registration) {
    //   try {
    //     await registration.periodicSync.register('content-sync', {
    //       // An interval of one day.
    //       // minInterval: 24 * 60 * 60 * 1000,
    //       minInterval: 30000,
    //     });
    //     alert("content Synched");
    //   } catch (error) {
    //     // Periodic background sync cannot be used.
    //     alert("Error Synching content" + error);
    //   }
    // }

    // Periodic Sync Registration
    // navigator.serviceWorker.ready.then(function (registration) {
    //   registration.periodicSync.register({
    //     tag: 'post-data-periodic',         // default: ''
    //     minPeriod: 12 * 60 * 60 * 1000, // default: 0
    //     powerState: 'avoid-draining',   // default: 'auto'
    //     networkState: 'avoid-cellular'  // default: 'online'
    //   }).then(function (periodicSyncReg) {
    //     alert("periodicSync success");
    //   }, function () {
    //     // failure
    //     alert("periodicSync failure");
    //   })
    // });

    // // Example: unregister all periodic syncs, except "get-latest-news":
    // navigator.serviceWorker.ready.then(function (registration) {
    //   registration.periodicSync.getRegistrations().then(function (syncRegs) {
    //     syncRegs.filter(function (reg) {
    //       return reg.tag != 'post-data-periodic';
    //     }).forEach(function (reg) {
    //       reg.unregister();
    //     });
    //   });
    // });

    // getting pending sync details
    // navigator.serviceWorker.ready.then(function(registration) {
    //   registration.periodicSync.getRegistrations().then(function(syncRegs) {
    //     syncRegs.filter(function(reg) {
    //       return reg.tag != 'get-latest-news';
    //     }).forEach(function(reg) {
    //       reg.unregister();
    //     });
    //   });
    // });
  }
  useEffect(() => {
    console.log("Effect in action");
  }, []);
  const getSkylinkIdxObject = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    getSkylinkIdxObject(userSession).then((skyLinkIdxObject) => {
      getSkylink(userSession, skyLinkIdxObject.skhubIdList[1]);
    });
  };

  const triggerSearch = async (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (snPublicHash != null) {
      if (searchStr == null || searchStr.trim() === "") {
        const allPublicApps = await getPublicApps(snPublicHash);
        dispatch(setApps(getAllPublicApps(allPublicApps.data, snPublicInMemory.addedSkapps,snPublicInMemory.deletedSkapps)));

      } else {
        dispatch(setLoaderDisplay(true));
        const allPublicApps = await getPublicApps(snPublicHash);
        const filteredApps = getAllPublicApps(allPublicApps.data, snPublicInMemory.addedSkapps, snPublicInMemory.deletedSkapps)
          .filter((app) => {
            if (searchStr && searchStr.trim() !== "") {
              for (const skyAppKey in app) {
                if (
                  app.hasOwnProperty(skyAppKey) &&
                  skyAppKey !== "category" &&
                  app[skyAppKey] != null &&
                  app[skyAppKey]
                    .toString()
                    .toLowerCase()
                    .indexOf(searchStr.toLowerCase()) > -1
                ) {
                  return app;
                }
              }
            } else {
              return app;
            }
            return "";
          });
        dispatch(fetchAppsSuccess(filteredApps));
      }
    } else {
      history.push(
        "/skylinks?query=" + encodeURIComponent(searchStr)
      );
    }
  };
  const onDownload = () => {
    try {
      let skylink = parseSkylink(searchStr)
      //alert("skylink" + skylink)
      launchSkyLink(skylink, snUserSetting);
    }
    catch (e) {
      setInvalidSkylink(true);
    }
  };

  const changePublicPortal = (portal) => {
    document.location.href = document.location.href.replace(
      document.location.origin,
      (new URL(portal)).origin
    );
  }

  const handleLogoClick = (evt) => {
    snPublicHash && evt.preventDefault();
  }

  const renderChangePortal = (value) => <FormControl className={classes.portalFormControl}>
    <Select
      labelId="demo-simple-select-label"
      id="pulic-share-portal"
      value={value}
      onChange={(evt) => changePublicPortal(evt.target.value)}
    >
      <MenuItem className="d-none" value={value}>
        Change Portal
                        </MenuItem>
      {document.location.origin.indexOf("localhost") > -1 && (
        <MenuItem value={document.location.origin}>
          {document.location.origin}
        </MenuItem>
      )}
      {snPortalsList &&
        snPortalsList.portals.map((obj, index) => (
          <MenuItem key={index} value={obj.url}>
            {obj.name}
          </MenuItem>
        ))}
    </Select>
  </FormControl>

  return (
    <>
      <AppBar
        position="fixed"
        className={classes.appBar + " topbar-container"}
        color="inherit"
      >
        <Toolbar className={clsx({
          "d-none": !snTopbarDisplay,
        })}>
          <Grid container spacing={1} alignItems="center">
            {snShowDesktopMenu && (

              <Grid item xs={1} sm={2} className="hidden-sm-up center-flex-div-content"
              >
                <MenuIcon onClick={() => dispatch(toggleMobileMenuDisplay)} />
              </Grid>
            )}
            <Grid item xs={1} sm={2} className="p-top10">
              <div className="ribbon hidden-xs-dn"><span>BETA</span></div>
              <NavLink className="sm-up-logo" to="/" onClick={handleLogoClick}>
                <img
                  src={skyapplogo}
                  alt="SkySpaces"
                  className="cursor-pointer hidden-xs-dn"
                  height="40"
                  width="170"
                ></img>
                <img
                  src={skyapplogo_only}
                  alt="SkySpaces"
                  className="cursor-pointer hidden-sm-up"
                  height="30"
                  width="30"
                ></img>
              </NavLink>
            </Grid>
            {(person != null || snPublicHash) && (
              <>
                <Grid item xs={7} sm={7} className="topbar-srch-grid">
                  <div className="float-center">
                    <form onSubmit={triggerSearch}>
                      <TextField
                        id="filled-secondary"
                        name="searchKey"
                        autoComplete="off"
                        variant="outlined"
                        className="topbar-search-field"
                        placeholder="Search in Spaces or Download Skylink"
                        onChange={(evt) =>
                          setSearchStr(evt.target.value)
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </form>
                  </div>
                </Grid>
                {/* <Grid item xs={props.snPublicHash ? 2 : 1} sm={props.snPublicHash ? 2 : 1}>
                    <Tooltip title="Download Skylink Content" arrow>
                      <CloudDownloadOutlinedIcon style={{ color: APP_BG_COLOR, fontSize: 35, cursor: 'pointer' }} onClick={onDownload} />
                    </Tooltip>
                  </Grid> */}
              </>
            )}
            <Grid item>
              <SnDataSync syncStatus={syncStatus}></SnDataSync>
            </Grid>
            <Grid item >
              <Button
                onClick={postSync}
                variant="contained"
                style={{ textTransform: "none" }}
                className={'${classes.margin} btn-login'}>
                Manual Sync
                  </Button>
            </Grid>
            <div className="top-icon-container float-right">
              {/* <Grid
                  item
                  sm={props.person != null ? 2 : (props.snPublicHash != null ? 1 : 10)}
                  className="hidden-xs-dn"
                >
                  <Link justify="center" rel="noopener noreferrer" target="_blank" href="https://blog.sia.tech/own-your-space-eae33a2dbbbc" style={{ color: APP_BG_COLOR }}>Blog</Link>
                  <Tooltip title="Launch SkyApps" arrow>
                    <IconButton
                      onClick={() => window.open("https://skyapps.hns.siasky.net")}
                    >
                      <AppsOutlinedIcon style={{ color: APP_BG_COLOR }} />
                    </IconButton>
                  </Tooltip>
                </Grid> */}
              {!snShowDesktopMenu && (
                renderChangePortal("Change Portal")
              )}
              {snShowDesktopMenu && (
                // TODO: need to create a reducer for signin component display
                <SnSignin />
              )}
            </div>
            <Grid
              item
              xs={(person != null || snPublicHash != null) ? 2 : 10}
              className="hidden-sm-up"
            >
              <div className="top-icon-container float-right">
                {snShowDesktopMenu && (
                  // TODO: need to create a reducer for signin component display
                  <SnSignin />
                )}
                {renderChangePortal("")}
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={invalidSkylink}
        autoHideDuration={3000}
        onClose={() => setInvalidSkylink(false)}
        TransitionComponent={"Fade"}
      >
        <Alert onClose={() => setInvalidSkylink(false)} severity="error">
          Invalid Skylink ! Please enter valid 46 character skylink to Download.
      </Alert>
      </Snackbar>
      <SnInfoModal
        open={showInfoModal}
        onClose={() => onInfoModalClose()}
        title="Public Share Link"
        type="public-share"
        content={infoModalContent}
      />
    </>
  );
  // }
}

// export default withRouter(
//   withStyles(useStyles)(
//     connect(mapStateToProps, matchDispatcherToProps)(SnTopBar)
//   )
// );
