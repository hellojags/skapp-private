import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import "./sn.topbar.css";
import skyapplogo from "../../SkySpaces_g.png";
import FormControl from '@material-ui/core/FormControl';
import skyapplogo_only from "../../SkySpaces_logo_transparent_small.png";
import AppsIcon from "@material-ui/icons/Apps";
import SmallLogo from "./images/smLogo.png";
import SnLeftMenu from "./sn.left-menu";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import InputLabel from '@material-ui/core/InputLabel';
import Link from '@material-ui/core/Link';
import MuiAlert from "@material-ui/lab/Alert";
import Select from '@material-ui/core/Select';
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles, withTheme } from "@material-ui/core/styles";
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
import { Drawer } from "@material-ui/core";
import {
  syncData, firstTimeUserSetup
} from "../../blockstack/blockstack-api";
import SnDataSync from '../datasync/sn.datasync';
import { SUCCESS } from '../../blockstack/constants';
import { useSelector, useDispatch } from "react-redux";
// Actions
import {
  setMobileMenuDisplay,
  toggleMobileMenuDisplay
} from "../../reducers/actions/sn.mobile-menu.action";
//import {setIsDataOutOfSync} from "../../reducers/actions/sn.isDataOutOfSync.action";
import {
  fetchBlockstackPerson,
  logoutPerson, setPerson,
  setPersonGetOtherData
} from "../../reducers/actions/sn.person.action";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";
import { toggleDesktopMenuDisplay } from "../../reducers/actions/sn.desktop-menu.action";
import { fetchPublicApps, setApps } from "../../reducers/actions/sn.apps.action";
import { setUserSession } from "../../reducers/actions/sn.user-session.action"
import { fetchAppsSuccess } from "../../reducers/actions/sn.apps.action";
import { setImportedSpace } from "../../reducers/actions/sn.imported-space.action";
import { makeStyles } from "@material-ui/core/styles";
import useInterval from 'react-useinterval';
import { getJSONfromDB } from "../../db/indexedDB";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  headerBgColorSet: {
    backgroundColor: theme.palette.headerBgColor,
  },
  searchBarBg: {
    backgroundColor: theme.palette.centerBar,
    // border:"none"
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
  searchBarForm: {
    width: "100%",
    display: "flex"
  },
  appLogo: {
    color: theme.palette.mediumGray,
    fontSize: 35,
    marginRight: 20,
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
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  // local
  const [searchStr, setSearchStr] = useState("");
  const [invalidSkylink, setInvalidSkylink] = useState(false);
  const [publicPortal, setPublicPortal] = useState(DEFAULT_PORTAL);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState("");
  //const [uiSyncStatus, setUiSyncStatus] = useState(null);
  const [anchor, setAnchor] = useState("");
  const [isTrue, setIsTrue] = useState(false);
  const [activeDarkBck, setActiveDarkBck] = useState(false);

  //isMaxWidth950: window.matchMedia("(max-width:950px)").matches;

  const onInfoModalClose = () => {
    setShowInfoModal(false);
  }

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
  //const snIsDataOutOfSync = useSelector((state) => state.snIsDataOutOfSync);


  // useInterval(async () => {
  //   // Your custom logic here
  //   if (snIsDataOutOfSync) {
  //     setUiSyncStatus("syncing");
  //     let status = await syncData(userSession, null, null);// for now skydb datakey and idb StoreName is abstracted 
  //     //let status = await firstTimeUserSetup(userSession, null, null);
  //     //alert("Success " + status);
  //     if (status == SUCCESS) {
  //       setUiSyncStatus("synced"); // Data is in sync. Update State so that components show correct status on UI
  //       dispatch(setIsDataOutOfSync(false));// Data is in sync. set flag in store.
  //     }
  //     else {
  //       setUiSyncStatus(null);
  //       dispatch(setIsDataOutOfSync(true));
  //     }
  //   }
  // }, 30000);

  
  // const postSync = async () => {
  //   dispatch(setIsDataOutOfSync(true)); 
  // }
    // Data is out of sync. Update "State" so that components show correct status on UI
    // setSyncStatus("syncing");
    // let status = await syncData(userSession, null, null);// for now skydb datakey and idb StoreName is abstracted 
    // //let status = await firstTimeUserSetup(userSession, null, null);
    // //alert("Success " + status);
    // if (status == SUCCESS) {
    //   setSyncStatus("synced");
    // }
    // else {
    //   setSyncStatus(null);
    // }
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

  // useEffect(() => {
  //   if(snIsDataOutOfSync == true) // data is out of sync and update UI status to re-render
  //   {
  //     setUiSyncStatus(null);//UI STatus -> 'Sync Now'
  //   }
  // }, [snIsDataOutOfSync]);

  useEffect(() => {
    let getMode = localStorage.getItem("darkMode");
    if (getMode === "true") {
      setActiveDarkBck(true);
    } else {
      setActiveDarkBck(false);
    }
  }, []);

  const getSkylinkIdxObject = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    getSkylinkIdxObject(userSession).then((skyLinkIdxObject) => {
      getSkylink(userSession, skyLinkIdxObject.skhubIdList[1]);
    });
  };

  const triggerSearch = async (evt) => {
    console.log("on trigger search");

    evt.preventDefault();
    evt.stopPropagation();
    if (snPublicHash != null) {
      if (searchStr == null || searchStr.trim() === "") {
        const allPublicApps = await getPublicApps(snPublicHash);
        dispatch(setApps(getAllPublicApps(allPublicApps.data, snPublicInMemory.addedSkapps, snPublicInMemory.deletedSkapps)));

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
    console.log("ondownload");
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
      {snTopbarDisplay && <div>
        <div className="container-fluid main-container">
          <nav className={`navbar navbar-light hdr-nvbr-main ${classes.headerBgColorSet}`}>
            {person != null && (
              <Drawer anchor={"left"} open={showMobileMenu} onClose={() => dispatch(setMobileMenuDisplay(false))} >
                <SnLeftMenu />
              </Drawer>
            )}

            {/* {person!=null && <button
                className="navbar-toggler togl-btn-navbr"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>} */}
            {person != null && <IconButton
              id="toggle-menu-icon"
              className="menu-button-styling"
              onClick={() => dispatch(setMobileMenuDisplay(true))}>
              <MenuIcon />
            </IconButton>}
            {(person != null || snPublicHash) && (
              <div className="ribbon"><span>ALPHA</span></div>
            )}
            {(person == null) ? <div className="ribbonMiddle"><span>ALPHA</span></div> : ""}
            <a
              className={`${"navbar-brand"} ${person == null ? "auth-navi-brand" : "navi-brnd"
                } ${person == null && "logoAlignMent"}`}
            >
              {/* logo */}
              <img
                style={{ cursor: "pointer" }}
                onClick={handleLogoClick}
                src="https://skyspaces.io/static/media/SkySpaces_g.531bd028.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt=""
                loading="lazy"
                height="40"
                width="170"
              />

              {/* search input */}
              {(person != null || snPublicHash) && (
                <>
                  <form onSubmit={triggerSearch} className={classes.searchBarForm}>
                    <div className="search_main_div" style={{ marginLeft: "auto" }}>
                      <span>
                        <i className="fas fa-search srch-icon-inside-field-input"></i>
                      </span>

                      <input
                        className={`form-control mr-sm-2 srch_inpt ${classes.searchBarBg}`}
                        style={{
                          border: `${activeDarkBck === true
                            ? "none"
                            : "1px solid lightgray"
                            }`,
                        }}
                        type="search"
                        placeholder="Search in SkySpaces or download Skylink"
                        aria-label="Search"
                        onChange={(evt) =>
                          setSearchStr(evt.target.value)
                        }
                      />
                      {/* search inside nav-brand */}
                      <div className="srch_btn_main_div">
                        <button className="btn srch_btn_nvbar" type="button" onClick={onDownload}>
                          <label for="hidden-search-inpt">
                            <i className="fa fa-download icon_download_nvbar"></i>
                          </label>
                        </button>
                        <input type="file" id="hidden-search-inpt" />
                      </div>
                    </div>

                  </form>
                </>
              )}
            </a>

            <a className="small_logo_nvbrnd">
              {/* small logo */}
              <img
                style={{ cursor: "pointer" }}
                onClick={handleLogoClick}
                src={SmallLogo}
                width="30"
                height="30"
                className=" smallLogo_header"
                alt=""
                loading="lazy"
                height="35"
                width="35"
              />
            </a>

            {person != null && (
              <div className="srch_btn_out_main_div">
                <button className="btn srch_btn_nvbar">
                  <label for="hidden-search-inpt">
                    <i className="fa fa-download icon_download_nvbar"></i>
                  </label>
                </button>
                <input type="file" id="hidden-search-inpt" />
              </div>
            )}

            {/*(person != null || snPublicHash) && (
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
                            setState({ searchStr: evt.target.value })
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
                  <Grid item xs={snPublicHash ? 2 : 1} sm={snPublicHash ? 2 : 1}>
                    <Tooltip title="Download Skylink Content" arrow>
                      <CloudDownloadOutlinedIcon style={{ color: APP_BG_COLOR, fontSize: 35, cursor: 'pointer' }} onClick={onDownload} />
                    </Tooltip>
                  </Grid>
                </>
                        )*/}

            {/* <Grid
                item
                sm={person != null ? 2 : (snPublicHash != null ? 1 : 10)}
                className="hidden-xs-dn"
              > */}
            {/* {(person != null || snPublicHash) && (
              <div className="signUp-butn-main-out-div">
                <Grid item>
                  <SnDataSync syncStatus={uiSyncStatus}></SnDataSync>
                </Grid>
                <button
                  style={{ border: "1px solid #1ed660" }}
                  type="button"
                  class="btn  btn-sm butn-out-signup"
                  onClick={() => postSync()}
                >
                  Sync Now - {"" + snIsDataOutOfSync}
                </button>
              </div>)} */}
            <div
              className="btn-icons-nvbr-div"
              style={{ display: "flex", alignItems: "center" }}
            >
              {/* <Link justify="center" rel="noopener noreferrer" target="_blank" href="https://blog.sia.tech/own-your-space-eae33a2dbbbc" style={{ color: APP_BG_COLOR }}>Blog</Link> */}
              <div className="butn-th-main-div">
                {/* <button className="btn th_btn_nvbar"> */}
                <a href="https://skyapps.hns.siasky.net" target="_blank"
                        rel="noopener noreferrer">
                  <Tooltip title="Skynet AppStore" arrow>
                  <AppsIcon
                    className={classes.appLogo}
                  />
                  </Tooltip>
                  </a>
                {/* </button> */}
              </div>
              {snPublicHash && (
                renderChangePortal("Change Portal")
              )}
              {snShowDesktopMenu && snPublicHash == null && (
                // TODO: need to create a reducer for signin component display
                <SnSignin />
              )}
            </div>
            {/* </Grid> */}
            {/* <Grid
                item
                xs={(person != null || snPublicHash != null) ? 2 : 10}
                className="hidden-sm-up"
              >
                <div className="top-icon-container float-right">
                  {snShowDesktopMenu && snPublicHash==null && (
                    // TODO: need to create a reducer for signin component display
                    <SnSignin />
                  )}
                  {snPublicHash && renderChangePortal("")}
                </div>
              </Grid> */}
          </nav>
        </div>
      </div>
      }
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
};