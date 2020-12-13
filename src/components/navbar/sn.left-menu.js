
import React, { useState, useEffect } from "react";
import leftMenuStyles from "./sn.left-menu.styles";
import { AiOutlineUpload } from "react-icons/ai";
import clsx from "clsx";
import editDocIcon from "./images/writing.png";
import { BiCoinStack } from "react-icons/bi";
import { ImTree } from "react-icons/im";
import { FaShareSquare } from "react-icons/fa";
import BackupIcon from "@material-ui/icons/Backup";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import VerticalSplitOutlinedIcon from "@material-ui/icons/VerticalSplitOutlined";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import WifiIcon from "@material-ui/icons/Wifi";
import Hidden from "@material-ui/core/Hidden";
import { withStyles, useTheme} from "@material-ui/core/styles";
import AppsOutlinedIcon from "@material-ui/icons/AppsOutlined";
import Drawer from "@material-ui/core/Drawer";
import { DEFAULT_PORTAL } from "../../sn.constants";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import AddToPhotosOutlinedIcon from '@material-ui/icons/AddToPhotosOutlined';
import ListItem from "@material-ui/core/ListItem";
import HistoryOutlinedIcon from "@material-ui/icons/HistoryOutlined";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import skyapplogo from "../../SkySpaces_logo.png";
import ListItemText from "@material-ui/core/ListItemText";
import BackupOutlinedIcon from "@material-ui/icons/BackupOutlined";
import SnSkySpaceMenu from "./sn.skyspace-menu";
import { NavLink } from "react-router-dom";
import { APP_BG_COLOR } from "../../sn.constants";
import { connect } from "react-redux";
import builtWithSiaLogo from '../../Sia.svg';
import {
  mapStateToProps,
  matchDispatcherToProps,
} from "./sn.left-menu.container";
import { Typography } from "@material-ui/core";
import InnerIcon from "./images/icon.jpeg";
import { setMobileMenuDisplay,
  toggleMobileMenuDisplay 
  } from "../../reducers/actions/sn.mobile-menu.action";
import { fetchSkyspaceList } from "../../reducers/actions/sn.skyspace-list.action";
import { toggleDesktopMenuDisplay } from "../../reducers/actions/sn.desktop-menu.action";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import "./sn.topbar.css";
import {setIsDataOutOfSync} from "../../reducers/actions/sn.isDataOutOfSync.action";
import {
  syncData, firstTimeUserSetup
} from "../../blockstack/blockstack-api";
import SnDataSync from '../datasync/sn.datasync';
import { SUCCESS } from '../../blockstack/constants';
import useInterval from 'react-useinterval';
import { getJSONfromDB } from "../../db/indexedDB";
import { IDB_IS_OUT_OF_SYNC} from '../../blockstack/constants';

const drawerWidth = 300;

const useStyles = makeStyles(leftMenuStyles);

export default function SnLeftMenu(props) {

  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();

  // local state
  const [uiSyncStatus, setUiSyncStatus] = useState(null);

  // redux store state
  const showMobileMenu = useSelector((state) => state.snShowMobileMenu);
  const showDesktopMenu = useSelector((state) => state.snShowDesktopMenu);
  const userSession = useSelector((state) => state.userSession);
  const skyspaceList = useSelector((state) => state.snSkyspaceList);
  const person = useSelector((state) => state.person);
  const snIsDataOutOfSync = useSelector((state) => state.snIsDataOutOfSync);
  
  useEffect(() => {
    //alert("snIsDataOutOfSync "+snIsDataOutOfSync);
    if(snIsDataOutOfSync == true) // data is out of sync and update UI status to re-render
    {
      setUiSyncStatus(null);//UI STatus -> 'Sync Now'
    }
    else
    {
      setUiSyncStatus('synced');//UI STatus -> 'Sync Now'
    }
  }, [snIsDataOutOfSync]);
  
  useInterval(async () => {
    //console.log("Inside useInterval");
    let isOutofSync = await getJSONfromDB(IDB_IS_OUT_OF_SYNC); 
    //console.log("isOutofSync "+isOutofSync);
    // Your custom logic here
    //if (false) {
    if (snIsDataOutOfSync || isOutofSync === undefined || isOutofSync === null) {
      setUiSyncStatus("syncing");
      let status = await syncData(userSession, null, null);// for now skydb datakey and idb StoreName is abstracted 
      //let status = await firstTimeUserSetup(userSession, null, null);
      //alert("Success " + status);
      //alert("wait")
      if (status == SUCCESS) {
        setUiSyncStatus("synced"); // Data is in sync. Update State so that components show correct status on UI
        dispatch(setIsDataOutOfSync(false));// Data is in sync. set flag in store.
      }
      else {
        setUiSyncStatus(null);
        dispatch(setIsDataOutOfSync(true));
      }
    }
  }, 90000);

  const postSync = async () => {
    dispatch(setIsDataOutOfSync(true)); // Data is out of sync. Update "State" so that components show correct status on UI
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
  }
  
  const menuBar = (isMobile) => {
    return (
      <React.Fragment>
        <div className={classes.toolbar}>
          <div className="banner-text hidden-sm-up">
            <div className="ribbon  hidden-xs-dn"><span>ALPHA</span></div>
            <img
              src={skyapplogo}
              alt="SkySpaces"
              className="cursor-pointer hidden-sm-up center"
              height="40"
              width="170"
            ></img>
          </div>
        </div>
        <List className="left-menu-list-root">
          <ListItem className="appstore-mobile-link hidden-sm-up">
            <ListItemText>
              <Link rel="noopener noreferrer" target="_blank" href="https://blog.sia.tech/own-your-space-eae33a2dbbbc" style={{ color: APP_BG_COLOR }}>Blog</Link>
            </ListItemText>
          </ListItem>
          <ListItem
            button
            className="appstore-mobile-link hidden-sm-up"
            onClick={() => {
              dispatch(toggleMobileMenuDisplay());
              window.open("https://skyapps.hns.siasky.net");
            }}
          >
            <ListItemIcon>
              <AppsOutlinedIcon style={{ color: APP_BG_COLOR }} />
            </ListItemIcon>
            <ListItemText
              style={{ color: APP_BG_COLOR }}
              primary="SkyApps"
            />
          </ListItem>
          
          {person != null && (
            // Mobile Left Menu
            <>
           
              <NavLink
                activeClassName="active"
                className="nav-link"
                onClick={() => isMobile && dispatch(toggleMobileMenuDisplay())}
                to="/upload"
              >
                <ListItem button>
                  <ListItemIcon>
                    <BackupOutlinedIcon style={{ color: APP_BG_COLOR }} />
                  </ListItemIcon>
                  <ListItemText
                    style={{ color: APP_BG_COLOR }}
                    primary="Upload"
                  />
                </ListItem>
              </NavLink>
              <NavLink
                activeClassName="active"
                className="nav-link"
                onClick={() => isMobile && dispatch(toggleMobileMenuDisplay())}
                to="/register"
              >
                <ListItem button>
                  <ListItemIcon>
                    <AddToPhotosOutlinedIcon style={{ color: APP_BG_COLOR }} />
                  </ListItemIcon>
                  <ListItemText
                    style={{ color: APP_BG_COLOR }}
                    primary="Add Skylink"
                  />
                </ListItem>
              </NavLink>
              <NavLink
                activeClassName="active"
                className="nav-link"
                onClick={() => isMobile && dispatch(toggleMobileMenuDisplay())}
                to="/history"
              >
                <ListItem button>
                  <ListItemIcon>
                    <HistoryOutlinedIcon style={{ color: APP_BG_COLOR }} />
                  </ListItemIcon>
                  <ListItemText
                    style={{ color: APP_BG_COLOR }}
                    primary="Activity History"
                  />
                </ListItem>
              </NavLink>
            </>
          )}
          <>
            {person != null && (
              <SnSkySpaceMenu
                isMobile={isMobile}
                toggleMobileMenuDisplay={() => dispatch(toggleMobileMenuDisplay())}
              />
            )}
          </>
        </List> 
        <div className="fixfooter">
          <div className={classes.FooterText}>
            &copy; 2020 SkySpaces
                            {/* <a 
                            href="https://github.com/skynethubio/SkySpaces" 
                            target="_blank"
                            rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faGithub} />
                            </a> */}
          </div>
          <a href="https://sia.tech/" target="_blank"
            rel="noopener noreferrer">
            <img src={builtWithSiaLogo} alt="Built With Sia" height="50" width="50" />
          </a>
        </div>
      </React.Fragment>
    );
  }

  const drawer = (isMobile) => {
    return (
      <>
      {/* <Header /> */}
      {/* <div className="main-example">
        <div className={classes.sideNavContainer}> */}
          {/* for section one */}
            {isMobile && showMobileMenu &&<div>
            <img
              src="https://skyspaces.io/static/media/SkySpaces_g.531bd028.png"
              style={{ width: 200, height: 50, marginBottom: 15 }}
            />
          </div>}
          <Typography variant="span">
                AutoSync Check Every 90 Seconds
          </Typography>
          <Grid container>
              <SnDataSync syncStatus={uiSyncStatus}></SnDataSync>
                {/* <button
                  style={{ border: "1px solid #1ed660" }}
                  type="button"
                  class="btn  btn-sm butn-out-signup"
                  onClick={() => postSync()}
                >
                  Sync Now - {"" + snIsDataOutOfSync}
                </button> */}
            </Grid>
          <div className={classes.linksStyles}>
            <AiOutlineUpload className={classes.iconStyling} />
            <NavLink to="/upload"
              activeClassName="active"
              onClick={()=>isMobile && setMobileMenuDisplay(false)}
              className={classes.linkName}>
              <Typography variant="span">
                Upload
            </Typography>
            </NavLink>
          </div>

          <div className={classes.linksStyles}>
            <AddBoxOutlinedIcon className={classes.iconStyling} />
            <NavLink to="/register"
              activeClassName="active"
              onClick={()=>isMobile && setMobileMenuDisplay(false)}
              className={classes.linkName}>
              <Typography variant="span">
                New
            </Typography>
            </NavLink>
          </div>

          {/*  <div className={classes.linksStyles}>
            <img
              src={editDocIcon}
              className={classes.iconStyling}
              style={{ height: "20px" }}
            />
            <Typography variant="span" className={classes.linkName}>
              Register
            </Typography>
          </div> */}

          <>
            {person != null && (
              <SnSkySpaceMenu
                isMobile={isMobile}
                toggleMobileMenuDisplay={() => dispatch(toggleMobileMenuDisplay())}
              />
            )}
          </>
          <div style={{ paddingTop: "40px" }}>
            <div className={classes.image_logo_sideBarfooter}>
              <img
                src="https://skyspaces.io/static/media/Sia.7dd07c88.svg"
                height="60"
                width="60"
              />
            </div>
          </div>
        {/* </div>
      </div> */}
    </>
  )};

    return (
      showDesktopMenu && person &&
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* matches */true ? (
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              <div className="main-example">
                <div className={classes.sideNavContainer}>
                  {drawer()}
                </div>
              </div>
            </Drawer>
          </Hidden>
        ) : null}
        <Hidden smUp implementation="css">
          {showMobileMenu && <div
            className={classes.list}
            role="presentation"
            // onClick={toggleDrawer(anchor, false)}
            // onKeyDown={toggleDrawer(anchor, false)}
          >
            <div id="mobile-menu" className={`main-example ${classes.mainExampleDrawer}`}>
              <div className={classes.sideNavContainerForDrawer}>
                {drawer(true)}
              </div>
            </div>
          </div>}
        </Hidden>
      </nav>
    );

    // return (
    //   <React.Fragment>
    //     <Hidden smUp={true} implementation="css">
    //       <Drawer
    //         variant="temporary"
    //         anchor={theme.direction === "rtl" ? "right" : "left"}
    //         open={showMobileMenu}
    //         onClose={() => toggleMobileMenuDisplay()}
    //         classes={{
    //           paper: classes.drawerPaper,
    //         }}
    //         ModalProps={{
    //           keepMounted: true, // Better open performance on mobile.
    //         }}
    //       >
    //         {menuBar(classes, true)}
    //       </Drawer>
    //     </Hidden>
    //     {showDesktopMenu && (

    //       <Hidden xsDown implementation="css">
    //         <Drawer
    //           className={classes.drawer}
    //           variant="persistent"
    //           anchor="left"
    //           open={showDesktopMenu}
    //           classes={{
    //             paper: classes.drawerPaper,
    //           }}
    //         >
    //           {menuBar(classes)}
    //         </Drawer>
    //       </Hidden>
    //     )}
    //   </React.Fragment>
    // );
};

// export default withStyles(leftMenuStyles, { withTheme: true })(
//   connect(mapStateToProps, matchDispatcherToProps)(SnLeftMenu)
// );
