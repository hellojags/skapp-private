import { Box, InputBase } from '@material-ui/core'
import React, { Fragment, useState, useEffect } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import UtilitiesItem from '../AppsComp/UtilitiesItem'
import ListFilter from '../AppsComp/ListFilter'
import SubmitBtn from '../AppsComp/SubmitBtn'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import DomainTable from './DomainTable'
import AddNewDomain from './AddNewDomain'
import AddNewDomainTXT from './AddNewDomainTXT'
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setLoaderDisplay } from "../../redux/action-reducers-epic/SnLoaderAction";
import { getDomainsAction, setDomainEpic, setEditDomainEpic, setDeleteDomainEpic } from "../../redux/action-reducers-epic/SnDomainAction";
import { getHNSSkyDBURL } from '../../service/SnSkappService';
// import HostingItem from './HostingItem'
// import AddNewSite from './AddNewSiteBtn'
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
            color: '#B4C6CC',
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
    domainName: Yup.string().required("This field is required"),
    dataLink: Yup.string().required("This field is required"),
    domainType: Yup.string().required("This field is required"),
    version: Yup.string().required("This field is required"),
    status: Yup.string().required("This field is required"),
});

let initailValueFormikObj = {
    domainName: "",
    dataLink: "",
    domainType: "HNS",
    txtRecord: "",
    version: "1",
    status: "Active"
};


const Domains = ({ toggle }) => {

    const { width } = useWindowDimensions()
    const classes = useStyles()
    const [addNew, setAddNew] = useState(false)
    const dispatch = useDispatch();
    const userDomains = useSelector((state) => state.SnDomains.domains);

    const [newDomain, setNewDomain] = useState(false);
    const [editDomain, setEditDomain] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const openModalHandler = () => {
        addNew ? setAddNew(false) : setAddNew(true)
    }

    const handleSetDomain = (val) => {
        setError(null);
        setNewDomain(val)
        setEditDomain(null);
        initailValueFormikObj = {
            domainName: "",
            dataLink: "",
            domainType: "HNS",
            txtRecord: "",
            version: "1",
            status: "Active"
        };
    } 

    useEffect(async () => {
        // console.log("came here");
        setIsLoading(true);
        await dispatch(getDomainsAction());
        setIsLoading(false);
      }, []);

    const submitProfileForm = async (e) => {
        // add validation on dataLink. 
        // let filteredDataLink = parseSkylink(dataLink);
        setError(null);
        if (editDomain !== null) {
            const txtUrl = await getHNSSkyDBURL(e.domainName, e.dataLink);
            e.txtRecord = txtUrl;
            handleEdit({ index: editDomain, domain: e });
            handleSetDomain(false);
            setEditDomain(null);
        } else {
            if (userDomains.some(x => x.domainName.toLowerCase() === e.domainName.toLowerCase())) {
                setError('Domain Name Already exist');
                return;
            }
            const txtUrl = await getHNSSkyDBURL(e.domainName, e.dataLink);
            e.txtRecord = txtUrl;
            dispatch(setDomainEpic(e));
            handleSetDomain(false);
        }
    };

    const handleDelete = async (e) => {
        dispatch(setDeleteDomainEpic(e));
    }
  
    const handleEdit = async (e) => {
        dispatch(setEditDomainEpic(e));
    }

    const handleEditSet = async (e, domain) => {
        setEditDomain(e);
        initailValueFormikObj = {
            domainName: domain.domainName,
            dataLink: domain.dataLink,
            domainType: domain.domainType,
            txtRecord: domain.txtRecord,
            version: domain.version,
            status: domain.status
        };
        setNewDomain(true)
    }

    { toggle ? document.body.className = "darkBodyColor" : document.body.className = "lightBodyColor" }
      
    return (
        <Fragment>
            {newDomain && <AddNewDomainTXT error={error} editDomain={editDomain} newDomain={newDomain} setNewDomain={(e) => handleSetDomain(e)} submitProfileForm={(e)=>submitProfileForm(e)} initailValueFormikObj={initailValueFormikObj} validationSchema={validationSchema} toggle={toggle} />}
            {/* <AddNewDomain toggle={toggle} openModal={addNew} openModalHandler={openModalHandler} /> */}
            <Box display="flex" className='second-nav' alignItems="center">
                <Box display="flex" alignItems="center" className={`${classes.margnBottomMediaQuery} ${classes.MobileFontStyle}`}>
                    <h1 className={toggle ? classes.darkPageHeading : classes.lightPageHeading}>Domain Manager</h1>
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
                    {/* <Box>
                        <UtilitiesItem toggle={toggle}/>
                    </Box> */}
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
                    {/* <Box>
                        <ListFilter toggle={toggle}/>
                    </Box> */}
                    <Box>
                        <SubmitBtn addSite={true} styles={{ justifyContent: "space-around" }} onClick={() => setNewDomain(true)}>
                            Add Domain
                        </SubmitBtn>
                    </Box>
                </Box>

            </Box>
            <p className={classes.h3}>(Under Active Development. Coming soon...)</p>
            { !isLoading ? <DomainTable handleDelete={(e)=> handleDelete(e)} handleEdit={(e, val) => handleEditSet(e, val)} userDomains={userDomains} toggle={toggle} /> : null }
        </Fragment>
    )
}
export default Domains
