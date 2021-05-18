import { Box, InputBase } from '@material-ui/core'
import React, { Fragment, useState, useEffect } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import UtilitiesItem from '../AppsComp/UtilitiesItem'
import ListFilter from '../AppsComp/ListFilter'
import SubmitBtn from '../AppsComp/SubmitBtn'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import StorageTable from './StorageTable'
import AddEditStorage from './AddEditStorage'
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setLoaderDisplay } from "../../redux/action-reducers-epic/SnLoaderAction";
import { getStorageAction, setStorageEpic, setEditStorageEpic, setDeleteStorageEpic } from "../../redux/action-reducers-epic/SnStorageAction";


const useStyles = makeStyles(theme => (
    {
        lightSearch: {
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
        darkSearch: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade('#2A2C34', 1),
            '&:hover': {
                backgroundColor: fade("#2A2C34", 0.9),
            },
            marginRight: theme.spacing(2),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
            },
            color: '#8B9DA5',
            boxShadow: '0px 1px 2px #15223214',
            border: '1px solid rgba(0, 0, 0, 0.8);',

            marginLeft: '16px!important',
            '@media (max-width: 1650px)': {
                width: 'auto'
            },

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
            color: '#fff!important',
            border: '1px solid rgba(255, 255, 255, 0.1)'
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
        lighth3: {
            color: '#2A2C34'
        },
        darkh3: {
            color: '#fff'
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

const validationSchema = Yup.object().shape({
    portalName: Yup.string().required("This field is required"),
    portalUrl: Yup.string().required("This field is required"),
    portalType: Yup.string().required("This field is required"),
    version: Yup.string().required("This field is required"),
});

let initailValueFormikObj = {
    portalName: "",
    portalUrl: "",
    version: "1",
};

function StorageGateway({ toggle }) {

    const { width } = useWindowDimensions()
    const classes = useStyles();
    const dispatch = useDispatch();
    const userStorages = useSelector((state) => state.SnStorages.storages);

    const [newDomain, setNewDomain] = useState(false);
    const [editDomain, setEditDomain] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSetDomain = (val) => {
        setError(null);
        setNewDomain(val)
        setEditDomain(null);
        initailValueFormikObj = {
            portalName: "",
            portalUrl: "",
            version: "1"
        };
    }

    useEffect(async () => {
        // console.log("came here");
        setIsLoading(true);
        await dispatch(getStorageAction());
        setIsLoading(false);
    }, []);

    const submitProfileForm = async (e) => {
        setError(null);
        if (editDomain !== null) {
            handleEdit({ index: editDomain, storage: e });
            handleSetDomain(false);
            setEditDomain(null);
        } else {
            if (userStorages.some(x => x.portalName.toLowerCase() === e.portalName.toLowerCase())) {
                setError('Portal Name already exists');
                return;
            }
            dispatch(setStorageEpic(e));
            handleSetDomain(false);
        }
    };

    const handleDelete = async (e) => {
        dispatch(setDeleteStorageEpic(e));
    }

    const handleEdit = async (e) => {
        dispatch(setEditStorageEpic(e));
    }

    const handleEditSet = async (e, domain) => {
        setEditDomain(e);
        initailValueFormikObj = {
            portalName: domain.portalName,
            portalUrl: domain.portalUrl,
            portalType: domain.portalType,
            version: domain.version
        };
        setNewDomain(true)
    }

    { toggle ? document.body.className = "darkBodyColor" : document.body.className = "lightBodyColor" }

    return (
        <Fragment>
            {newDomain && <AddEditStorage error={error} editDomain={editDomain} newDomain={newDomain} setNewDomain={(e) => handleSetDomain(e)} submitProfileForm={(e) => submitProfileForm(e)} initailValueFormikObj={initailValueFormikObj} validationSchema={validationSchema} toggle={toggle} />}
            <Box display="flex" className='second-nav' alignItems="center">
                <Box display="flex" alignItems="center" className={`${classes.margnBottomMediaQuery} ${classes.MobileFontStyle}`}>
                    <h1 className={toggle ? classes.darkPageHeading : classes.lightPageHeading}>Storage Gateway Manager</h1>
                </Box>
                {width < 1250 && <div className={`${toggle ? classes.darkSearch : classes.lightSearch} ${classes.Media1249} ${classes.margnBottomMediaQuery}`}>
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
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </div>}
                <Box className={classes.secondNavRow2} display="flex" alignItems="center" flex={1} justifyContent='flex-end'>
                    {width > 1249 && <div className={toggle ? classes.darkSearch : classes.lightSearch}>
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
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>}
                    <Box>
                        <SubmitBtn addSite={true} onClick={() => setNewDomain(true)} styles={{ justifyContent: "space-around" }}>
                            Add Storage Gateway
                        </SubmitBtn>
                    </Box>
                </Box>

            </Box>
            <p className={toggle ? classes.darkh3 : classes.lighth3}>(Under Active Development. Coming soon...)</p>
            {!isLoading ? <StorageTable handleDelete={(e) => handleDelete(e)} handleEdit={(e, val) => handleEditSet(e, val)} userStorages={userStorages} toggle={toggle} /> : null}
        </Fragment>
    )
}
export default StorageGateway
