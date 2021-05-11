import React, { Fragment, useEffect, useState } from 'react'
import { Box, InputBase, Typography, Button } from '@material-ui/core'
import { useHistory } from "react-router-dom";
import { fade, makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import UtilitiesItem from '../AppsComp/UtilitiesItem'
import ListFilter from '../AppsComp/ListFilter'
import SubmitBtn from '../AppsComp/SubmitBtn'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import HostingItem from './HostingItem'
import AddNewSite from './AddNewSiteBtn'
import { getMyHostedApps, deleteMyHostedApp } from '../../service/SnSkappService';
import SnInfoModal from '../Modals/SnInfoModal';
import { isStrInObj } from '../../utils/SnUtility';
import { useDispatch } from 'react-redux';
import { setLoaderDisplay } from '../../redux/action-reducers-epic/SnLoaderAction';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(theme => (
    {
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade('#fff', 1),
            '&:hover': {
                backgroundColor: fade("#fff", 0.9),
            },
            marginRight: theme.spacing(2),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
            },
            color: '#8B9DA5',
            boxShadow: '0px 1px 2px #15223214',
            border: '1px solid #7070701A;',

            marginLeft: '16px!important',
            '@media (max-width: 1650px)': {
                width: 'auto'
            },

        },
        text: {
            color: '#FF6060',
            fontSize: 20,
            fontWeight: 500,
            marginTop: '.5rem',
            '@media only screen and (max-width: 1440px)': {
                fontSize: 16,
            },
            '@media only screen and (max-width: 575px)': {
                fontSize: 12,
                marginTop: '1rem',
            }
    
        },
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        closeBtn: {
            border: '1px solid #1DBF73',
            borderRadius: '5px',
            boxShadow: '0px 2px 5px #15223221',
            height: 48,
            marginTop: '2rem',
            textTransform: 'none'
        },
        okBtn: {
            border: '1px solid #ea052f',
            marginRight: '10px',
            borderRadius: '5px',
            boxShadow: '0px 2px 5px #15223221',
            height: 48,
            marginTop: '2rem',
            textTransform: 'none'
        },
        modalTitle: {
            fontSize: 32,
            color: '#333333',
            fontWeight: 700,
            marginBottom: '1rem'
        },
        shareCardContainer: {
            background: '#fff',
            boxShadow: '0px 2px 5px #15223221',
            borderRadius: 15,
            padding: '48px 60px',
            '@media only screen and (max-width: 575px)': {
                padding: '40px 20px',
                paddingTop: '50px'
            },
            '&:focus': {
                outline: 0,
                border: 0
            },
            width: '90%',
            maxWidth: 500,
            '& p': {
                color: '#5A607F',
                marginBottom: '5px'
            },
            '& .s-links-title': {
                marginTop: '.4rem'
            },
            '& a': {
                marginRight: '1rem',
                '&:focus': {
                    textDecoration: 'none',
                    opacity: .8,
                    transition: '.25s ease'
                }
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
        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '100%',
            },
            [theme.breakpoints.up('lg')]: {
                width: '50ch',
            },
            paddingTop: '10px',
            paddingBottom: '10px',
            '@media (max-width: 1660px)': {
                width: '34ch'
            },
            '@media (max-width: 1460px)': {
                width: '100%'
            }

        },

        lightPageHeading: {
            color: '#131523',
            fontSize: '28px',
        },
        darkPageHeading: {
            color: '#fff',
            fontSize: '28px',
        },
        smallText: {
            alignSelf: "flex-end",
            color: '#5A607F',
            paddingLeft: '1rem',
            fontWeight: '400'
        },
        Media1249: {
            width: 'calc(100% - 230px)',
            marginLeft: 'auto!important',
            marginRight: 0,
            '@media only screen and (max-width: 890px)': {
                width: '100%',
            },

        },
        margnBottomMediaQuery: {
            '@media only screen and (max-width: 1249px)': {
                marginBottom: '.75rem'
            },


        },

        secondNavRow2: {
            '@media only screen and (max-width: 890px)': {
                justifyContent: 'space-between'
            },
            '@media only screen and (max-width: 575px) and (min-width: 509px)': {
                marginBottom: '.6rem'
            }
            , '@media only screen and (max-width: 510px)': {
                flexWrap: 'wrap',
                "& > div": {
                    width: '50%',
                    minWidth: '50%',
                    maxWidth: '50%',
                    marginBottom: '.75rem'
                },
                "& > div:nth-child(odd)": {
                    paddingRight: '1rem'

                }
            },
        },
        MobileFontStyle: {
            '@media only screen and (max-width: 575px) ': {
                marginBottom: '.7rem',
                marginTop: '.4rem',
                '& h1': {
                    fontSize: '18px'
                }
            }
        }

    }
))
function Hosting({toggle}) {

    const { width } = useWindowDimensions()
    const classes = useStyles()
    let history = useHistory();
    const dispatch = useDispatch();
    
    const [hostedAppListObj, setHostedAppListObj] = useState();
    const [searchStr, setSearchStr] = useState("");
    const [isDelete, setIsDelete] = useState(false);
    const [selectedApp, setAppForDelete] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoModalTitle, setInfoModalTitle] = useState("");
    const [infoModalContent, setInfoModalContent] = useState("");
    const [infoModalShowCopyToClipboard, setInfoModalShowCopyToClipboard] = useState(false);
    const [infoModalClipboardTooltip, setInfoModalClipboardTooltip] = useState("");

    useEffect(() => {
        loadHostedApps();
    }, []);

    const loadHostedApps = async () => {
        dispatch(setLoaderDisplay(true));
        const hostedAppListObj = await getMyHostedApps([]);
        setHostedAppListObj(hostedAppListObj);
        dispatch(setLoaderDisplay(false));
    };

    const filterApps = (searchStr, app) => isStrInObj(searchStr, app);

    const handleClose = () => {
        setIsDelete(false);
    }
    
    const handleOpen = (app, appId) => {
        app['appId'] = appId;
        setAppForDelete(app);
        setIsDelete(true);
    }
    
    const handleDelete = async () => {
        dispatch(setLoaderDisplay(true));
        setIsDelete(false);
        const check = await deleteMyHostedApp(selectedApp.appId);
        dispatch(setLoaderDisplay(false));
        setInfoModalParams({
            title: check ? `Success` : `Error`,
            content: check ? `Site Deleted Successfully!` : `Unexpected Error occured`,
            showClipboardCopy: false,
        });
    }

    const setInfoModalParams = ({ title, content, showClipboardCopy = false, clipboardCopyTooltip, open = true }) => {
        setInfoModalContent(content);
        setInfoModalTitle(title);
        setInfoModalShowCopyToClipboard(showClipboardCopy);
        setInfoModalClipboardTooltip(clipboardCopyTooltip);
        setShowInfoModal(open);
    };

    const onInfoModalClose = () => {
        setInfoModalParams({ open: false });
        loadHostedApps();
    };

    {toggle ? document.body.className = "darkBodyColor" : document.body.className = "lightBodyColor"}
    
    return (

        <Fragment >
            <Box display="flex" className='second-nav' alignItems="center">
                <Box display="flex" alignItems="center" className={`${classes.margnBottomMediaQuery} ${classes.MobileFontStyle}`}>
                    <h1 className={toggle ? classes.darkPageHeading : classes.lightPageHeading}>Hosted Apps(Websites)</h1>
                </Box>
                {width < 1250 && <div className={`${classes.search} ${classes.Media1249} ${classes.margnBottomMediaQuery}`}>
                    <Box>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                    </Box>
                    <InputBase
                        placeholder="Search Apps"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </div>}
                <Box className={classes.secondNavRow2} display="flex" alignItems="center" flex={1} justifyContent='flex-end'>
                    <Box className="d-none temp">
                        <UtilitiesItem />
                    </Box>

                    {width > 1249 && <div className={classes.search + " d-none temp"}>
                        <Box>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                        </Box>
                        <InputBase
                            placeholder="Search Apps"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={(evt)=>setSearchStr(evt.target.value)}
                        />
                    </div>}
                    <Box className="d-none temp">
                        <ListFilter />
                    </Box>

                    <Box>
                        <SubmitBtn addSite={true} styles={{ justifyContent: "space-around" }}
                            onClick={() => history.push("/submitsite")}>
                            <b>Deploy New App</b>
                    </SubmitBtn>
                    </Box>
                </Box>

            </Box>
            <p className={classes.text}>( Note: Hosted App will NOT be Published to AppStore by default. If you wish to publish deployed app/site to Apptore, you can do so after deploying your code from this page or "Publish App" link)</p>
            <Box marginTop="1rem">
                {hostedAppListObj?.appDetailsList &&
                    (Object.keys(hostedAppListObj.appDetailsList))
                    .filter((appId)=>filterApps(searchStr, hostedAppListObj.appDetailsList[appId]))
                    .sort((appId1, appId2)=>(hostedAppListObj.appDetailsList[appId2].ts-hostedAppListObj.appDetailsList[appId1].ts))
                    .map((appId, idx) =>
                        hostedAppListObj.appDetailsList[appId] && <HostingItem toggle={toggle} handleOpen={handleOpen} key={idx} ActiveSite={true} id={appId} app={hostedAppListObj.appDetailsList[appId]} />
                    )}
                <AddNewSite toggle={toggle} onClick={() => history.push("/submitsite")} />
            </Box>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={false || isDelete}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={isDelete}>
                    <Box className={classes.shareCardContainer}>
                        <Typography component='h2' className={classes.modalTitle}>
                            Confirm Delete
                        </Typography>
                        <Typography component="p">
                            Do you want to delete { selectedApp ? `${selectedApp.appName}`: ''}?
                        </Typography>
                        <Box style={{ textAlign: 'right' }}>
                            <Button onClick={handleDelete} className={classes.okBtn}>
                                Ok
                            </Button>
                            <Button onClick={handleClose} className={classes.closeBtn}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            
            <SnInfoModal
                open={showInfoModal}
                onClose={onInfoModalClose}
                title={infoModalTitle}
                content={infoModalContent}
                showClipboardCopy={infoModalShowCopyToClipboard}
            />
        </Fragment>
    )
}

export default Hosting
