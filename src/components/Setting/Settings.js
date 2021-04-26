import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import { Button, Snackbar } from '@material-ui/core';
import Alert from "@material-ui/lab/Alert";
// import { Add } from '@material-ui/icons'
import Profile from './Profile';
import { useDispatch, useSelector } from 'react-redux';
import { setLoaderDisplay } from '../../redux/action-reducers-epic/SnLoaderAction';
import { getProfile, setProfile } from '../../service/SnSkappService';
import * as Yup from 'yup';

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

const useStyles = makeStyles((theme) => ({
    root: {

        backgroundColor: 'transparent',
        '& .MuiTabs-indicator': {
            backgroundColor: 'transparent',
        },
        '& .MuiTab-root': {
            fontWeight: 600,
            minWidth: 85,
            color: '#869EA6',
            "&.Mui-selected": {
                color: '#000'
            }
        }
    },
    h1: {
        fontSize: '28px',
        '@media only screen and (max-width: 575px)': {
            fontSize: 18
        }
    },
    submitBtn: {
        background: '#1DBF73!important',
        color: '#fff',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        display: 'inlin-flex',
        alignItems: 'center',
        minWidth: 130,
        '& svg': {
            fontSize: '19px',
            marginRight: '5px'
        },
        '@media only screen and (max-width: 575px)': {
            fontSize: '12px',

            paddingLeft: '.5rem',
            paddingRight: '.5rem',
            minWidth: 70,
        }
    },
    tabNavigation: {
        boxShadow: 'none'
    }
}))



const formikObj = {
    username: ['', Yup.string().required('This field is required')],
    emailID: [''],
    firstName: [''],
    lastName: [''],
    contact: [''],
    aboutMe: [''],
    location: [''],
    topicsHidden: [[]],
    topicsDiscoverable: [[]],
    avatar: [{}],  
    facebook: [''],
    twitter: [''],
    github: [''],
    reddit: [''],
    telegram: [''],
    
};

const Settings = () => {
    const classes = useStyles()
    const [value, setValue] = React.useState(0);
        
    const [profileObj, setProfileObj] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const dispatch = useDispatch();

    const handleChange = (event, newValue) => {
        if (newValue == 0) {
            loadProfile();
        }
        setValue(newValue)
    }

    
    useEffect(() => {
        return () => {
            loadProfile();
        };
    }, []);

    const loadProfile = async () => {
        dispatch(setLoaderDisplay(true));
        setIsLoading(true);
        const profile = await getProfile();
        await setProfileObj(profile);
        setFormicObj(profile);
        dispatch(setLoaderDisplay(false));
        setIsLoading(false);
    };
    
    const submitForm = async (values) => {
        let profileJSON = {
            username: values.username,
            emailID: values.emailID,
            firstName: values.firstName,
            lastName: values.lastName,
            contact: values.contact,
            location: values.location,
            aboutMe: values.aboutMe,
            connections: [{ twitter: values.twitter}, {facebook: values.facebook}, {github: values.github}, {reddit: values.reddit}, {telegram: values.telegram}],
            topicsHidden: values.topicsHidden,
            topicsDiscoverable: values.topicsDiscoverable,
            avatar: [values.avatar],
        }
        dispatch(setLoaderDisplay(true));
        await setProfile(profileJSON);
        setIsSuccess(true);
        dispatch(setLoaderDisplay(false));
    };

    
    const setFormicObj = (profile) => {
        if (profile) {
            formikObj.username[0] = `${profile?.username}`;
            formikObj.emailID[0] = `${profile?.emailID}`;
            formikObj.firstName[0] = `${profile?.firstName}`;
            formikObj.lastName[0] = `${profile?.lastName}`;
            formikObj.contact[0] = `${profile?.contact}`;
            formikObj.location[0] = `${profile?.location}`;
            formikObj.aboutMe[0] = `${profile?.aboutMe}`;
            formikObj.facebook[0] = `${profile?.connections?.find(({facebook}) => facebook).facebook}`;
            formikObj.twitter[0] = `${profile?.connections?.find(({twitter}) => twitter).twitter}`;
            formikObj.github[0] = `${profile?.connections?.find(({github}) => github).github}`;
            formikObj.reddit[0] = `${profile?.connections?.find(({reddit}) => reddit).reddit}`;
            formikObj.telegram[0] = `${profile?.connections?.find(({telegram}) => telegram).telegram}`;
            formikObj.topicsHidden[0] = profile?.topicsHidden;
            formikObj.topicsDiscoverable[0] = profile?.topicsDiscoverable;
            if (profile?.avatar && profile?.avatar?.length > 0) {
                formikObj.avatar[0] = profile?.avatar[0];
            }
        }
        
    }

    return (
        <Fragment>
            {/* <Box display="flex" alignItems="center" justifyContent='space-between' marginTop='7px'>
                <h1 className={classes.h1}>Settings</h1>
                <Box className={classes.btnBox}>
                    <Button className={classes.submitBtn}>Save Changes</Button>
                </Box>
            </Box> */}
            
            <div className={classes.root}>
                <AppBar className={classes.tabNavigation} position="static" color="default" >
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" >
                        <Tab label="Profile" {...a11yProps(0)} />
                        <Tab label="Global Preferences" {...a11yProps(1)} />
                        {/* <Tab label="Billing" {...a11yProps(2)} /> */}
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <Profile formikObj={formikObj} submitForm={submitForm} isSuccess={isSuccess} setIsSuccess={setIsSuccess} isError={isError} setIsError={setIsError} isLoading={isLoading}/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <h4>Global Preferences</h4>
                </TabPanel>
                {/* <TabPanel value={value} index={2}>
                    <h4>Billing</h4>
                </TabPanel> */}
            </div>
        </Fragment>
    )
}
export default Settings