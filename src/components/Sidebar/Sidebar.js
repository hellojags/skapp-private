import React,{useEffect} from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import "react-perfect-scrollbar/dist/css/styles.css"
import { makeStyles } from "@material-ui/core/styles"
import ListSubheader from "@material-ui/core/ListSubheader"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Collapse from "@material-ui/core/Collapse"
import { useLocation } from 'react-router-dom'
// Custom Icons Imports
import { ReactComponent as DashboardIcon } from "../../assets/img/icons/dashboardIcon.svg"
import { ReactComponent as SubmitAppIcon } from "../../assets/img/icons/submitIcon.svg"
import { ReactComponent as MyAppIcon } from "../../assets/img/icons/grayMyApps.svg"
import { ReactComponent as MyAppPinIcon } from "../../assets/img/icons/Pin.svg"
import { ReactComponent as HostingIcon } from "../../assets/img/icons/Cloud, Sync, Synchronize.6.svg"
import { ReactComponent as DeployIcon } from "../../assets/img/icons/deployIcon.svg"
import { ReactComponent as FilesIcon } from "../../assets/img/icons/filesIcon.svg"
import { ReactComponent as DomainIcon } from "../../assets/img/icons/domainIcon.svg"
import { ReactComponent as StorageIcon } from "../../assets/img/icons/StorageIcon.svg"
import { ReactComponent as StatsIcon } from "../../assets/img/icons/statsIcon.svg"
import { ReactComponent as ActivityLogIcon } from "../../assets/img/icons/starOutlinedIcon.svg"
import { ReactComponent as KnowlBaseIcon } from "../../assets/img/icons/knowledgeBaseIcon.svg"
import { ReactComponent as ProductUpdateIcon } from "../../assets/img/icons/productUpdateIcon.svg"
import { ReactComponent as SettingNavLogIcon } from "../../assets/img/icons/settingNavIcon.svg"
import { ReactComponent as PersonIcon } from '../../assets/img/icons/interface-essential-311.svg'
import { ExpandLess, ExpandMore } from "@material-ui/icons"
// sidebar styles
import style from "../../assets/jss/sidebar/SidebarStyle"
import { NavLink } from "react-router-dom"
import { useSelector } from "react-redux"
import {getPublishedAppsCount} from "../../service/SnSkappService"
const useStyles = makeStyles(style)

const Sidebar = ({ style, toggle }) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(true)
  const [noOfpublishApps, setNoOfpublishApps] = React.useState(0)

  const snShowHostingLinks = useSelector(state => state.snShowHostingLinks)
  let userSession = useSelector((state) => state.userSession)
  const handleClick = () => {
    setOpen(!open)
  }
  useEffect(async () => {
    const noOfpublishApps = await getPublishedAppsCount();
    setNoOfpublishApps(noOfpublishApps);
  }, [userSession]);

  let location = useLocation()

  let sidebar = (
    <>
      {toggle ? <div className={`${toggle ? classes.darkSidebar : classes.lightSidebar} darkSidebar`} style={style}>
        <PerfectScrollbar>
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
          >
            <NavLink exact to="/appstore">
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Apps Discovery" />
              </ListItem>
            </NavLink>
            <NavLink exact to='/descoverdev'>
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Developers Discovery" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/hosting">
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <HostingIcon />
                </ListItemIcon>
                <ListItemText primary="App Hosting" />
                {snShowHostingLinks ? (
                  <ExpandLess className={classes.dropArrow} />
                ) : (
                  <ExpandMore className={classes.dropArrow} />
                )}
              </ListItem>
            </NavLink>
            <Collapse in={snShowHostingLinks} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <NavLink to="/deploysite">
                  <ListItem button className={classes.nested}>
                    <ListItemIcon className={classes.listIcon}>
                      <DeployIcon />
                    </ListItemIcon>
                    <ListItemText primary="Deploy" />
                  </ListItem>
                </NavLink>
                <ListItem button className={classes.nested}>
                  <ListItemIcon className={classes.listIcon}>
                    <FilesIcon />
                  </ListItemIcon>
                  <ListItemText primary="Files" />
                </ListItem>
              </List>
            </Collapse>
            <NavLink to="/submitapp">
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <SubmitAppIcon />
                </ListItemIcon>
                <ListItemText primary="Publish App" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/apps">
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <MyAppIcon />
                </ListItemIcon>
                <ListItemText primary={"My Apps (Published) " + noOfpublishApps} />
              </ListItem>
            </NavLink>
            <NavLink exact to="/installedapps">
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <MyAppPinIcon />
                </ListItemIcon>
                <ListItemText primary="My Apps (Pinned)" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/nodomain">
              <ListItem button >
                <ListItemIcon className={classes.listIcon}>
                  <DomainIcon />
                </ListItemIcon>
                <ListItemText primary="Domain Manager" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/storagegateway">
              <ListItem button >
                <ListItemIcon className={classes.listIcon}>
                  <StorageIcon />
                </ListItemIcon>
                <ListItemText primary="Storage Manager" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/stats">
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <StatsIcon />
                </ListItemIcon>
                <ListItemText primary="Usage Stats" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/activitylog">
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <ActivityLogIcon />
                </ListItemIcon>
                <ListItemText primary="Activity Log" />
              </ListItem>
            </NavLink>
          </List>
          {/* Other Information section */}
          <List
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Other Information
              </ListSubheader>
            }
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
          >
            <ListItem button>
              <ListItemIcon className={classes.listIcon}>
                <KnowlBaseIcon />
              </ListItemIcon>
              <ListItemText primary="Knowledge Base" />
            </ListItem>

            <ListItem button>
              <ListItemIcon className={classes.listIcon}>
                <ProductUpdateIcon />
              </ListItemIcon>
              <ListItemText primary="Product Updates" />
            </ListItem>
          </List>
          {/* Settings section */}
          <List
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Settings
              </ListSubheader>
            }
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
          >
            <NavLink exact to="/usersettings">
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <SettingNavLogIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
            </NavLink>
          </List>
          <div className={classes.promoCard}>
            <h3 className={classes.promoTitle}>Promo Title</h3>
            <p className={classes.promoText}>Explore our marketing solutions</p>
          </div>
        </PerfectScrollbar>
      </div> : <div className={`${toggle ? classes.darkSidebar : classes.lightSidebar} lightSidebar`} style={style}>
        <PerfectScrollbar>
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
          >
            <NavLink exact to="/appstore">
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Apps Discovery" />
              </ListItem>
            </NavLink>
            <NavLink exact to='/descoverdev'>
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Developers Discovery" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/hosting">
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <HostingIcon />
                </ListItemIcon>
                <ListItemText primary="App Hosting" />
                {snShowHostingLinks ? (
                  <ExpandLess className={classes.dropArrow} />
                ) : (
                  <ExpandMore className={classes.dropArrow} />
                )}
              </ListItem>
            </NavLink>
            <Collapse in={snShowHostingLinks} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <NavLink to="/deploysite">
                  <ListItem button className={classes.nested}>
                    <ListItemIcon className={classes.listIcon}>
                      <DeployIcon />
                    </ListItemIcon>
                    <ListItemText primary="Deploy" />
                  </ListItem>
                </NavLink>
                <ListItem button className={classes.nested}>
                  <ListItemIcon className={classes.listIcon}>
                    <FilesIcon />
                  </ListItemIcon>
                  <ListItemText primary="Files" />
                </ListItem>
              </List>
            </Collapse>
            <NavLink to="/submitapp">
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <SubmitAppIcon />
                </ListItemIcon>
                <ListItemText primary="Publish App" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/apps">
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <MyAppIcon />
                </ListItemIcon>
                <ListItemText primary={"My Apps (Published) " + noOfpublishApps} />
              </ListItem>
            </NavLink>
            <NavLink exact to="/installedapps">
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <MyAppPinIcon />
                </ListItemIcon>
                <ListItemText primary="My Apps (Pinned)" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/nodomain">
              <ListItem button >
                <ListItemIcon className={classes.listIcon}>
                  <DomainIcon />
                </ListItemIcon>
                <ListItemText primary="Domain Manager" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/storagegateway">
              <ListItem button >
                <ListItemIcon className={classes.listIcon}>
                  <StorageIcon />
                </ListItemIcon>
                <ListItemText primary="Storage Manager" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/stats">
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <StatsIcon />
                </ListItemIcon>
                <ListItemText primary="Usage Stats" />
              </ListItem>
            </NavLink>
            <NavLink exact to="/activitylog">
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <ActivityLogIcon />
                </ListItemIcon>
                <ListItemText primary="Activity Log" />
              </ListItem>
            </NavLink>
          </List>
          {/* Other Information section */}
          <List
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Other Information
              </ListSubheader>
            }
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
          >
            <ListItem button>
              <ListItemIcon className={classes.listIcon}>
                <KnowlBaseIcon />
              </ListItemIcon>
              <ListItemText primary="Knowledge Base" />
            </ListItem>

            <ListItem button>
              <ListItemIcon className={classes.listIcon}>
                <ProductUpdateIcon />
              </ListItemIcon>
              <ListItemText primary="Product Updates" />
            </ListItem>
          </List>
          {/* Settings section */}
          <List
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Settings
              </ListSubheader>
            }
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
          >
            <NavLink exact to="/usersettings">
              <ListItem button>
                <ListItemIcon className={classes.listIcon}>
                  <SettingNavLogIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
            </NavLink>
          </List>
          <div className={classes.promoCard}>
            <h3 className={classes.promoTitle}>Promo Title</h3>
            <p className={classes.promoText}>Explore our marketing solutions</p>
          </div>
        </PerfectScrollbar>
      </div>
      }
    </>
  )
  if (!userSession || location.pathname === '/login') {
    sidebar = null
  }
  return (

    sidebar
  )
}

export default Sidebar
