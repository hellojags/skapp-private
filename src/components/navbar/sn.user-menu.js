import React from "react"
import Popover from "@material-ui/core/Popover"
import Typography from "@material-ui/core/Typography"

import { makeStyles } from "@material-ui/core/styles"
import VisibilityIcon from "@material-ui/icons/Visibility"
import Box from "@material-ui/core/Box"
import CameraAltIcon from "@material-ui/icons/CameraAlt"
import SettingsIcon from "@material-ui/icons/Settings"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import { useHistory, Link } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import SkyID from "skyid"
import { logoutPerson } from "../../reducers/actions/sn.person.action"
import { STORAGE_DARK_MODE_KEY } from "../../sn.constants"
import { setDarkMode } from "../../reducers/actions/sn.dark-mode.action"
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action"
import { clearAllfromDB, IDB_STORE_SKAPP } from "../../db/indexedDB"

const useStyles = makeStyles((theme) => ({
  menuTop: {
    marginTop: 25,
  },
  profilePicStyling: {
    // boxShadow: "0px 0px 5px 8px rgba(50, 50, 50, 0.14)",
    boxShadow: "0 0 10px rgba(0,0,0,.4)",
    backgroundColor: theme.palette.whiteBgColor,
    borderRadius: "50%",
    width: 90,
    height: 90,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    color: theme.palette.primary.main,
    cursor: "pointer",
    fontSize: 45,
    marginTop: 30,
    marginLeft: 65,
    marginRight: 65,
  },
  camereIconContainer: {
    width: 25,
    height: 25,
    backgroundColor: theme.palette.primary.main,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    position: "relative",
    left: 123,
    top: -20,
  },
  userIdStyle: {
    fontSize: 14,
    color: theme.palette.linksColor,
    fontWeight: 500,
  },
  userNameStyle: {
    fontSize: 18,
    color: theme.palette.linksColor,
    fontWeight: 500,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    paddingBottom: 20,
  },
  menuListContainers: {
    display: "flex",
    fontSize: 16,
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 8,
    cursor: "pointer",
    color: theme.palette.linksColor,
  },
  menuBackGroundColor: {
    backgroundColor: theme.palette.headerBgColor,
  },
}))

function UserMenu(props) {
  const { userMenu, setUserMenu } = props
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  const stPerson = useSelector((state) => state.person)
  const stUserSession = useSelector((state) => state.userSession)
  const stDarkMode = useSelector((state) => state.snDarkMode)

  const userMenuClose = () => {
    setUserMenu(null)
  }
  const logout = () => {
    dispatch(setLoaderDisplay(true))
    const skyId = new SkyID("skapp", skyidEventCallback, {
      devMode: process.env.NODE_ENV !== "production",
    })
    skyId.sessionDestroy("/")
  }
  const skyidEventCallback = (message) => {
    switch (message) {
      case "login_fail":
        console.log("Login failed")
        break
      case "login_success":
        console.log("Login succeed!")
        break
      case "destroy":
        console.log("Logout succeed!")
        onSkyIdLogout(message)
        break
      default:
        console.log(message)
        break
    }
  }
  const onSkyIdLogout = async (message) => {
    try {
      dispatch(logoutPerson(stUserSession))
      clearAllfromDB({ store: IDB_STORE_SKAPP })
      dispatch(setLoaderDisplay(false))
      window.location.href = window.location.origin
    } catch (e) {
      console.log("Error during logout process.")
      dispatch(setLoaderDisplay(false))
    }
  }
  const showPublicKey = () => {
    userMenuClose()
    props.onShowSkyDbPublicKey()
  }

  const toggleDarkMode = (evt) => {
    const darkMode = evt.target.checked
    localStorage.setItem(STORAGE_DARK_MODE_KEY, darkMode)
    dispatch(setDarkMode(darkMode))
  }

  return (
    <>
      <Popover
        className={classes.menuTop}
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{
          paper: "py-8",
        }}
      >
        <Box p={2} className={classes.menuBackGroundColor}>
          <div
            className={classes.profilePicStyling}
            onClick={() => history.push("/profile")}
          >
            {stPerson?.profile?.username?.charAt(0).toUpperCase()}
          </div>
          <div className={classes.camereIconContainer}>
            <CameraAltIcon style={{ fontSize: 13, color: "white" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <Typography className={classes.userIdStyle}>Welcome</Typography>
            <div>
              <Typography className={classes.userNameStyle}>
                {stPerson?.profile?.username}
              </Typography>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <Link to="/settings">
              <div className={classes.menuListContainers} onClick={userMenuClose}>
                {" "}
                <SettingsIcon style={{ fontSize: 18 }} />
                <div style={{ paddingLeft: 20 }}>
                  <Typography variant="span">Setting</Typography>
                </div>
              </div>
            </Link>
            {/* <div className={classes.menuListContainers} onClick={userMenuClose}>
              <BackupIcon style={{ fontSize: 18 }} />
              <div style={{ paddingLeft: 20 }}>
                <Typography variant="span">Backup</Typography>
              </div>
            </div>
            <Link to="/history">
              <div className={classes.menuListContainers} onClick={userMenuClose}>
                <HistoryIcon style={{ fontSize: 18 }} />
                <div style={{ paddingLeft: 20 }}>
                  <Typography variant="span">History</Typography>
                </div>
              </div>
            </Link>
            <div
              className={classes.menuListContainers}
              style={{ paddingTop: 0, paddingBottom: 0 }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Brightness4Icon style={{ fontSize: 18 }} />
                <div style={{ paddingLeft: 20 }}>
                  <Typography variant="span">Dark mode</Typography>
                </div>
              </div>
              <div style={{ marginLeft: 40 }}>
                <Switch
                  name="checkedA"
                  checked={stDarkMode}
                  onChange={toggleDarkMode}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
              </div>
            </div> */}
            <div className={classes.menuListContainers} onClick={showPublicKey}>
              <VisibilityIcon style={{ fontSize: 18 }} />
              <div style={{ paddingLeft: 20 }}>
                <Typography variant="span">Show Public Key</Typography>
              </div>
            </div>
            <div className={classes.menuListContainers} onClick={logout}>
              <ExitToAppIcon style={{ fontSize: 18 }} />
              <div style={{ paddingLeft: 20 }}>
                <Typography variant="span">Sign out</Typography>
              </div>
            </div>
          </div>
        </Box>
      </Popover>
    </>
  )
}

export default UserMenu
