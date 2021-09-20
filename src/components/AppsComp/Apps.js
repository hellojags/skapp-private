import { Box, InputBase } from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { useHistory } from "react-router-dom";
import UtilitiesItem from "./UtilitiesItem";
import ListFilter from "./ListFilter";
import SelectItem from "./SelectItem";
import SubmitBtn from "./SubmitBtn";
import AppsList from "./AppsList";
import useWindowDimensions from "../../hooks/useWindowDimensions";
// import PerfectScrollbar from 'react-perfect-scrollbar'
import CustomPagination from "./CustomPagination";
import SelectedAppsHeader from "./SelectedAppsHeader";
import { getMyPublishedAppsAction } from "../../redux/action-reducers-epic/SnPublishAppAction";
import { getMyInstalledAppsAction, installedAppAction, unInstalledAppAction } from "../../redux/action-reducers-epic/SnInstalledAppAction";
import { useDispatch, useSelector } from "react-redux";
import { installApp } from '../../service/SnSkappService'
import { setLoaderDisplay } from '../../redux/action-reducers-epic/SnLoaderAction'
import NoApps from '../OtherPages/NoApps';

const useStyles = makeStyles((theme) => ({
  lightSearch: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade("#fff", 1),
    "&:hover": {
      backgroundColor: fade("#fff", 0.9),
    },
    marginRight: theme.spacing(2),
    // marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
    color: "#8B9DA5",
    boxShadow: "0px 1px 2px #15223214",
    border: "1px solid #7070701A;",
    // hieght: '41px',
    marginLeft: "16px!important",
    "@media (max-width: 1650px)": {
      width: "auto",
    },
  },
  darkSearch: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade("#2A2C34", 1),
    "&:hover": {
      backgroundColor: fade("#2A2C34", 0.9),
    },
    marginRight: theme.spacing(2),
    // marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
    color: "#8B9DA5",
    boxShadow: "0px 1px 2px #15223214",
    border: '1px solid rgba(0, 0, 0, 0.8);',
    // hieght: '41px',
    marginLeft: "16px!important",
    "@media (max-width: 1650px)": {
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#B4C6CC",
  },
  lightInputRoot: {
    // color: "inherit",
    color: '#2A2C34!important',
  },
  darkInputRoot: {
    collightIr: '#fff!important',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  inputInput: {
    // padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "50ch",
    },
    paddingTop: "10px",
    paddingBottom: "10px",
    "@media (max-width: 1660px)": {
      width: "34ch",
    },
    "@media (max-width: 1460px)": {
      width: "100%",
    },
  },

  lightPageHeading: {
    color: "#131523",
    fontSize: "28px",
  },
  darkPageHeading: {
    color: "#fff",
    fontSize: "28px",
  },
  smallText: {
    alignSelf: "flex-end",
    color: "#5A607F",
    paddingLeft: "1rem",
    fontWeight: "400",
  },
  Media1249: {
    width: "calc(100% - 230px)",
    marginLeft: "auto!important",
    marginRight: 0,
    "@media only screen and (max-width: 890px)": {
      width: "100%",
    },
  },
  margnBottomMediaQuery: {
    "@media only screen and (max-width: 1249px)": {
      marginBottom: ".75rem",
    },
  },
  // PerfectScrollbarContainer: {
  //     padding: '1rem 1.4rem',
  //     paddingBottom: '0',
  //     height: 'calc(100vh - 64px)',
  //     '@media only screen and (max-width: 575px)': {
  //         padding: '.5rem',
  //     },
  // },
  // mobileSave: {
  //     padding: '1rem 1.4rem',
  //     paddingBottom: '0',
  //     height: 'calc(100vh - 64px)',
  //     overflow: "auto",
  //     '@media only screen and (max-width: 575px)': {
  //         padding: '.5rem',
  //     },
  // },
  secondNavRow2: {
    "@media only screen and (max-width: 890px)": {
      justifyContent: "space-between",
    },
    "@media only screen and (max-width: 575px) and (min-width: 509px)": {
      marginBottom: ".6rem",
    },
    "@media only screen and (max-width: 510px)": {
      flexWrap: "wrap",
      "& > div": {
        width: "50%",
        minWidth: "50%",
        maxWidth: "50%",
        marginBottom: ".75rem",
      },
      "& > div:nth-child(odd)": {
        paddingRight: "1rem",
      },
    },
  },
  MobileFontStyle: {
    "@media only screen and (max-width: 575px) ": {
      marginBottom: ".7rem",
      marginTop: ".4rem",
      "& h1": {
        fontSize: "18px",
      },
    },
  },
}))

function Apps({toggle}) {
  const dispatch = useDispatch();
  const { publishedAppsStore } = useSelector((state) => state.snPublishedAppsStore);
  const { installedAppsStore } = useSelector((state) => state.snInstalledAppsStore);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(async () => {
    // console.log("came here");
    setIsLoading(true);
    await dispatch(getMyPublishedAppsAction());
    await dispatch(getMyInstalledAppsAction());
    setIsLoading(false);
  }, []);
  // temp var for selected page
  const selectedPage = false
  // This page code

  const { width } = useWindowDimensions();
  const classes = useStyles();
    
  const handleInstall = async (item, key) => {
    if (key == "install") {
      dispatch(installedAppAction(item));
    } else {
      dispatch(unInstalledAppAction(item.id));
    }
  }

  {toggle ? document.body.className = "darkBodyColor" : document.body.className = "lightBodyColor"}

  const AppsComp = (
    <Fragment>
      <Box display="flex" className="second-nav" alignItems="center">
        <Box
          display="flex"

          alignItems="center"
          className={`${classes.margnBottomMediaQuery} ${classes.MobileFontStyle}`}
        >
          <h1 className={toggle ? classes.darkPageHeading : classes.lightPageHeading}>My Published Apps</h1>
          <small className={classes.smallText}>{publishedAppsStore.length} Results</small>
        </Box>
        {width < 1250 && (
          //remove the style property to show it again, in future
          <div
            className={`${toggle ? classes.darkSearch : classes.lightSearch} ${classes.Media1249} ${classes.margnBottomMediaQuery}`}
            style={{ display: 'none' }}
          >
            <Box>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
            </Box>
            <InputBase
              placeholder="Search Apps"
              classes={{
                root: toggle ? classes.darkInputRoot : classes.lightInputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
        )}
        <Box
          className={classes.secondNavRow2}
          display="flex"
          alignItems="center"
          flex={1}
          justifyContent="flex-end"
        >
          {/* <Box>
            <UtilitiesItem />
          </Box> */}

          {width > 1249 && (
            //remove the style property to show it again, in future
            <div className={toggle ? classes.darkSearch : classes.lightSearch} style={{ display: 'none' }}>
              <Box>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
              </Box>
              <InputBase
                placeholder="Search Apps"
                classes={{
                  root: toggle ? classes.darkInputRoot : classes.lightInputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </div>
          )}
          {/* <Box>
            <ListFilter />
          </Box> */}
          <Box>
            {selectedPage && <SelectItem />}
          </Box>
          <Box>
            <SubmitBtn onClick={(e) => history.push('/submitapp')}>Publish App</SubmitBtn>
          </Box>
        </Box>
      </Box>
      {/* When items are selectable */}
      {selectedPage && <SelectedAppsHeader />}
      { !isLoading && publishedAppsStore.length > 0 ?
        <div>
          <AppsList toggle={toggle} newData={publishedAppsStore} installedApps={installedAppsStore} updated={undefined} handleInstall={handleInstall}/>
        </div>
        : <NoApps toggle={toggle} showTitle={true} pageTitle="My Published Apps" heading="No Published Apps to display" pharase="Publish your App using 'Publish App' BUTTON" />
      }
      {/* <Box paddingTop="1.2rem" paddingBottom="1rem">
        <CustomPagination />
      </Box> */}
    </Fragment>
  )
  const finalComp = (publishedAppsStore.length ? AppsComp : (<NoApps 
    toggle={toggle}
    msg='No Published Apps to display in AppStore. Publish your App using "Publish App" BUTTON '
    btnText="Publish App"
    pageType="Published"
    link="/submitapp"
  />))
  return (
    // (width < 575)
    //     ? <div className={classes.mobileSave}>{AppsComp}</div>
    //     : < PerfectScrollbar className={classes.PerfectScrollbarContainer} >{AppsComp}</PerfectScrollbar>
    // <div>{AppsComp}
    <>

      { finalComp}

    </>
  )
}

export default Apps
