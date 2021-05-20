import React, { useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { fade, makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import Badge from '@material-ui/core/Badge'
import Switch from "@material-ui/core/Switch";
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import PersonOutlineIcon from '@material-ui/icons/PersonOutline'
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
// import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
// import Icon from '@material-ui/core/Icon'
// import grey from '@material-ui/core/colors/grey'
// import MailIcon from '@material-ui/icons/Mail'
// import NotificationsIcon from '@material-ui/icons/Notifications'
import MoreIcon from '@material-ui/icons/MoreVert'
// logo
import { ReactComponent as Logo } from '../../assets/img/icons/logo.svg'
import { ReactComponent as Logo1 } from '../../assets/img/icons/logo1.svg'

// icons custom
import { ReactComponent as QuestionIcon } from '../../assets/img/icons/question.svg'
import { ReactComponent as SettingIcon } from '../../assets/img/icons/setting.svg'
import { ReactComponent as EditProfileIcon } from '../../assets/img/icons/edit-profile.svg'
import { ReactComponent as LogoutIcon } from '../../assets/img/icons/exit-log-out.2.svg'
import { ReactComponent as NotificationIcon } from '../../assets/img/icons/notification.svg'
import { ReactComponent as CustomMenuIcon } from '../../assets/img/icons/Icon ionic-ios-menu.svg'
import { Box, Button, Tooltip, Typography } from '@material-ui/core'
import Sidebar from '../Sidebar/Sidebar'
// import { Translate } from '@material-ui/icons'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { setLoaderDisplay } from '../../redux/action-reducers-epic/SnLoaderAction'
import { clearAllfromIDB, IDB_STORE_SKAPP } from "../../service/SnIndexedDB"
import { BROWSER_STORAGE } from "../../utils/SnConstants"
import { setUserSession } from "../../redux/action-reducers-epic/SnUserSessionAction"
import { useHistory } from "react-router-dom"
import { getProfile, getPreferences } from '../../service/SnSkappService';
import { setUserProfileAction } from '../../redux/action-reducers-epic/SnUserProfileAction';
import { setUserPreferencesAction } from '../../redux/action-reducers-epic/SnUserPreferencesAction';
import { skylinkToUrl } from "../../service/skynet-api";
import Announcement from './../Announcement'
import ToggleButton from './../ToggleButton'

const useStyles = makeStyles((theme) => ({
    rootDark: {
        // backgroundColor: '#fff',
        backgroundColor: '#2A2C34',
        background: "#ffff 0 % 0 % no-repeat padding-box",
        boxShadow: '0px 1px 4px #15223214',

    },
    rootLight: {
        backgroundColor: '#fff',
        background: "#ffff 0 % 0 % no-repeat padding-box",
        boxShadow: '0px 1px 4px #15223214',
    },
    toolBarRoot: {
        justifyContent: 'space-between',
        '@media only screen and (max-width: 890px)': {
            justifyContent: 'space-between'
        }
    },
    // grow: {
    //     flexGrow: 1,
    //     // background: 'red'
    //     '@media only screen and (max-width: 890px)': {
    //         flexGrow: 0,
    //     }
    // },
    menuButton: {
        display: 'none',
        marginRight: theme.spacing(2),
        '@media only screen and (max-width: 890px)': {
            display: 'block'
        }
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    lightSearch: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade('#F0F5F7', 1),
        '&:hover': {
            backgroundColor: fade("#F0F5F7", 0.7),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
        color: '#8B9DA5',
        '@media only screen and (max-width: 890px)': {
            display: 'none'
        }
    },
    darkSearch: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade('#1E2029', 1),
        '&:hover': {
            backgroundColor: fade("#1E2029", 0.7),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
        color: '#8B9DA5',
        '@media only screen and (max-width: 890px)': {
            display: 'none'
        }
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#B4C6CC'
    },
    lightInputRoot: {
        // color: 'inherit',
        color: '#2A2C34!important',
    },
    darkInputRoot: {
        color: '#ffffff!important',
        border: '1px solid D9E1EC'
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '30ch',
        },
        [theme.breakpoints.up('lg')]: {
            width: '50ch',
        },
    },
    // lightInputColor: {
    // },
    // darkInputColor: {
    //     background: '#1E2029',
    // },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    usrIcon: {

        width: '28px',
        height: '28px',
        minWidth: 'auto',
        backgroundColor: '#7e84a31c',
        borderRadius: "4px",
        padding: 0
    },
    lightUserName: {
        paddingLeft: "10px",
        paddingRight: "1rem",
        textTransform: 'capitalize',
        maxWidth: 110,
    },
    darkUserName: {
        paddingLeft: "10px",
        paddingRight: "1rem",
        textTransform: 'capitalize',
        maxWidth: 110,
        color: '#fff',
    },
    helpText: {
        paddingLeft: '.5rem'
    },
    pr_4: {
        paddingRight: '2rem'
    },
    pr_2: {
        paddingRight: '1rem!important'
    },
    AngleDown: {
        color: '#B4C6CC'
    },
    QuestionIcon: {
        marginRight: '7px'
    },
    avatarIcon: {
        color: '#7E84A3'
    },
    MenuRoot: {
        marginTop: '40px',

    },
    MenuItem: {
        borderBottom: ".3px solid #70707045",
        '@media(max-width: 991px)': {
            fontSize: '12px'
        }
    },
    /* darkMenuColor: {
        color: '#fff',
        background:'#2A2C34',
    },
    lightMenuColor: {
        color: '#000',
        background:'#fff',
    }, */
    menuIcon: {
        marginRight: ".90rem",
        '@media(max-width: 1440px)': {
            marginRight: ".70rem",
        }
    },
    logoutText: {
        color: '#FF6060'
    },
    notifiText: {
        paddingLeft: '10px'
    },
    mobileHelpItem: {
        paddingLeft: ".5rem"
    },
    lightText: {
        color: '#000'
    },
    darkText: {
        color: '#fff'
    },
    switchButton: {
        marginLeft: '5px',
        marginRight: '5px'
    },
}))

export default function Navbar({ toggle, setToggle }) {

    const dispatch = useDispatch()
    const history = useHistory()
    const { width } = useWindowDimensions()
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)

    const LightTheme = createMuiTheme({
        palette: {
            type: 'light',
        }
    })

    const DarkTheme = createMuiTheme({
        palette: {
            type: 'dark',
        }
    })
    const isMenuOpen = Boolean(anchorEl)
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
    const userSession = useSelector((state) => state.userSession)
    const [person, setPerson] = useState({ username: "Anonymous", url: "" });

    const userProfile = useSelector((state) => state.snUserProfile)
    const userPreferences = useSelector((state) => state.snUserPreferences)
    useEffect(() => {
        let avatarURl = userProfile?.avatar ? userProfile?.avatar[0]?.url : null;
        setPerson({ username: userProfile?.username, url: avatarURl });
    }, [userProfile]);

    useEffect(() => {
        const reloadReduxState = async () => {
            const loginStatus = await userSession?.mySky?.checkLogin() ?? false;
            if (loginStatus) {
                console.log("#### On Refresh : Reload Redux State #### [userProfile]");
                const userProfile = await getProfile(null);
                let avatarURl = userProfile?.avatar ? userProfile?.avatar[0]?.url : null;
                setPerson({ username: userProfile?.username, url: avatarURl });
                dispatch(setUserProfileAction(userProfile));
                console.log("#### On Refresh : Reload Redux State #### [userPrefrences]");
                const userPrefrences = await getPreferences();
                dispatch(setUserPreferencesAction(userPrefrences));
            }
        }
        reloadReduxState();
    }, []);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        handleMobileMenuClose()
    }
    const handleSettings = () => {
        setAnchorEl(null)
        handleMobileMenuClose()
        if (userSession != null) {
            history.push('/usersettings')
        }
    }

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget)
    }


    const handleMySkyLogout = async () => {
        try {
            dispatch(setLoaderDisplay(true));
            if (userSession?.mySky) {
                try {
                    await userSession.mySky.logout();
                }
                catch (e) {
                    console.log("Error during logout process." + e)
                }
            }
            await clearAllfromIDB({ store: IDB_STORE_SKAPP });
            BROWSER_STORAGE.clear();
            await dispatch(setUserSession(null));
            dispatch(setLoaderDisplay(false));
            window.location.href = window.location.origin

        } catch (e) {
            console.log("Error during logout process." + e)
            dispatch(setLoaderDisplay(false))
        }
    }
    const menuId = 'primary-search-account-menu'
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            className={toggle ? 'darkProfile-dropdown' : 'lightProfile-dropdown'}

        >
            {/* <MenuItem onClick={handleSettings} className={classes.MenuItem}>
                <SettingIcon className={classes.menuIcon} />
                <span>Settings</span>
            </MenuItem>*/}
            <MenuItem onClick={handleSettings} className={classes.MenuItem}>
                <EditProfileIcon className={classes.menuIcon} />
                <span>Edit Profile</span>
            </MenuItem>
            <MenuItem onClick={handleMySkyLogout} className={classes.MenuItem}>
                <LogoutIcon className={classes.menuIcon} />
                <span className={classes.logoutText}>Logout</span>
            </MenuItem>
        </Menu>
    )

    const mobileMenuId = 'primary-search-account-menu-mobile'
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {/* <MenuItem>
                <Box display='flex' alignItems="center" className={classes.mobileHelpItem} >
                    <QuestionIcon />
                    <p className={classes.helpText}>Help</p>
                </Box>
            </MenuItem> */}
            <ToggleButton toggle={toggle} setToggle={setToggle} className={classes.pr_2} />
            <MenuItem>
                <IconButton aria-label="show 17 new notifications" color="inherit" style={{ width: '30px', height: "28px" }}>
                    <Badge color="secondary" variant="dot">
                        <NotificationIcon />
                    </Badge>
                </IconButton>
                <p className={classes.notifiText}>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <Button className={classes.usrIcon}>
                    {person.url ? (
                        <img width="100%" src={skylinkToUrl(person.url)} alt="" />
                    ) : (
                        <PersonOutlineIcon className={classes.avatarIcon} />
                    )}
                </Button>
                <Tooltip title={person.username} placement="top" arrow >
                    <Typography className={toggle ? classes.darkUserName : classes.lightUserName} noWrap>{person.username}</Typography>
                </Tooltip>
                <KeyboardArrowDownIcon className={classes.AngleDown} />
            </MenuItem>
        </Menu>
    )
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    const menuButtonHandler = () => {
        menuIsOpen ? setMenuIsOpen(false) : setMenuIsOpen(true)
    }
    return (
        <Fragment>
            {width <= 890 &&
                <Sidebar style={{
                    display: width <= 890 ? 'block' : undefined,
                    zIndex: 99,
                    height: '100vh',
                    transition: '.5s ease',
                    transform: menuIsOpen ? 'translateX(0)' : 'translateX(-100%)'
                }} />}
            {(menuIsOpen && width <= 890) && <div onClick={menuButtonHandler}
                style={{
                    idth: '100%',
                    position: 'fixed',
                    zIndex: '98',
                    background: '#ebebeba6',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: width > 890 ? 'none' : undefined,
                }}></div>}
                <Announcement toggle={toggle} />
            <AppBar position="static" className={toggle ? classes.rootDark : classes.rootLight} color='default'>
                <Toolbar className={classes.toolBarRoot} >
                    <IconButton edge="start" onClick={menuButtonHandler} className={classes.menuButton} color="inherit" aria-label="menu">
                        <CustomMenuIcon />
                    </IconButton>
                    <div className="logo-top" >
                        {toggle ? <Logo1 /> : <Logo />}
                    </div>
                    {/* <div className={toggle ? classes.darkSearch : classes.lightSearch}>
                        <font color="red">Unit testing in-progress: Aggregated Test Data will be reset in couple of days</font>
                       <div className={classes.searchIcon}>
                            <SearchIcon />
                            {/* <Icon style={{color: grey[50]}}>article</Icon>
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: toggle ? classes.darkInputRoot : classes.lightInputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        /> 
                    </div>*/}
                    {/* <div className={toggle ? classes.darkText : classes.lightText}>
                        Light
                        <Switch color="primary" checked={toggle} onChange={() => setToggle(!toggle)} className={classes.switchButton} />
                        Dark
                    </div> */}

                    <div className={classes.sectionDesktop}>
                        {/* <Box display='flex' alignItems="center" className={classes.pr_4}>
                            <QuestionIcon className={classes.QuestionIcon} />
                            <p className={classes.helpText}>Help</p>
                        </Box> */}
                        <ToggleButton toggle={toggle} setToggle={setToggle} className={classes.pr_2} />
                        <Box display="flex" alignItems="center" className={classes.pr_4}>
                            <IconButton aria-label="show 17 new notifications" color="inherit" style={{ width: '30px', height: "28px" }}>
                                <Badge color="secondary" variant="dot">
                                    <NotificationIcon />
                                </Badge>
                            </IconButton>
                        </Box>

                        <Box display="flex" alignItems="center" onClick={handleProfileMenuOpen}>
                            <Button className={classes.usrIcon} >
                                {person.url ? (
                                    <img width="100%" src={skylinkToUrl(person.url)} alt="" />
                                ) : (
                                    <PersonOutlineIcon className={classes.avatarIcon} />
                                )}
                            </Button>
                            <Tooltip title={person.username} placement="top" arrow >
                                <Typography className={toggle ? classes.darkUserName : classes.lightUserName} noWrap>{person.username}</Typography>
                            </Tooltip>
                            <KeyboardArrowDownIcon className={classes.AngleDown} />
                        </Box>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Fragment>
    )
}
