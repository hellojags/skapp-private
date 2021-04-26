
import React, { createRef, useEffect, useState } from 'react'
import PersonOutlineIcon from '@material-ui/icons/PersonOutline'
import { Box, Button, makeStyles, Typography, Snackbar } from '@material-ui/core';
import Alert from "@material-ui/lab/Alert";
import { Formik } from 'formik';
import { SnTextInput, SnTextInputTag, SnTextArea, SnInputWithIcon } from '../Utils/SnFormikControlls';
import SnUpload from '../../uploadUtil/SnUpload';
import { UPLOAD_SOURCE_NEW_HOSTING_IMG } from '../../utils/SnConstants';
import { useDispatch, useSelector } from 'react-redux';
import { setLoaderDisplay } from '../../redux/action-reducers-epic/SnLoaderAction';

import * as Yup from 'yup';
import { Add, Search, GitHub, Facebook, Reddit, Twitter, Telegram } from '@material-ui/icons';
import { skylinkToUrl } from "../../utils/SnUtility";
import { getInitValAndValidationSchemaFromSnFormikObj } from '../../service/SnFormikUtilService';
import { useHistory } from 'react-router-dom';
import { getProfile, setProfile } from '../../service/SnSkappService';
import Loader from "react-loader-spinner";

const useStyles = makeStyles((theme) => ({
    ProfileRoot: {
        backgroundColor: '#fff',
        boxShadow: '0px 2px 5px #15223214',
        borderRadius: 6,
        padding: '50px 30px',
        '@media only screen and (max-width: 575px)': {
            padding: '20px 10px',
        },
        '& h2': {
            color: '#242F57',
            marginBottom: '1rem',
            '@media only screen and (max-width: 575px)': {
                fontSize: 22,
            },
        }
    },
    textInfo: {
        color: '#000',
        fontSize: 14,
        '@media only screen and (max-width: 575px)': {
            fontSize: 13,
        },
    },
    submitBtn: {
        background: '#1DBF73!important',
        color: '#fff',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        display: 'inlin-flex',
        alignItems: 'center',
        float: 'right',
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
    siteLogo: {
        background: '#fff',
        cursor: 'pointer',
        height: 150,
        width: 150,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #D9E1EC',
        borderRadius: '50%',
        marginBottom: 10,
        marginTop: 10,
        '@media only screen and (max-width: 575px)': {
            width: 75,
            height: 75,
            // maxWidth: 340,
            marginLeft: 'auto',
            marginRight: 'auto',
        }
    },
    label: {
        display: 'block',
        color: '#5A607F',
        marginBottom: 8,
        fontSize: 18,
        '@media only screen and (max-width: 575px)': {
            fontSize: 16,
        }
    },
    profilePlaceholder: {
        width: 150,
        height: 150,
        background: '#EFF5F7',
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        '& svg': {
            fontSize: 89,
            // marginTop: '2.9rem',
            color: '#B4C6CC'
        },
        '@media only screen and (max-width: 575px)': {
            width: 75,
            height: 75,
            '& svg': {
                fontSize: 45,
                // marginTop: '2.9rem',
                color: '#B4C6CC'
            },
        }
    },
    btnUpload: {
        backgroundColor: '#869EA6!important',
        color: '#fff',
        fontSize: 14,
        minWidth: 150,
        '@media only screen and (max-width: 575px)': {
            fontSize: 12,
            height: 40
        },
        '& svg': {
            marginRight: 7
        }
    },
    textHelper: {
        fontSize: 13,
        color: '#5C757D',
        marginTop: 5,
        '@media only screen and (max-width: 575px)': {
            fontSize: 12,
        },
    },
    form: {
        marginTop: 20
    },
    label: {
        display: 'block',
        marginTop: 10,
        marginBottom: 8,
        fontWeight: 600,
        fontSize: 14,
        '@media only screen and (max-width: 575px)': {
            marginTop: 0,
            marginBottom: 5,
        },
    },
    inputGuide: {
        color: '#5C757D',
        '@media only screen and (max-width: 575px)': {
            fontSize: 12,
        }
    },
    input: {
        background: '#fff',
        border: '1px solid #D9E1EC',
        borderRadius: 8,
        height: 55,
        width: '100%',
        fontSize: 18,
        padding: 20,
        '@media only screen and (max-width: 1440px)': {
            height: 50,
            // width: '100%',
            fontSize: 16,
            padding: 15,
        },
        '@media only screen and (max-width: 575px)': {
            height: 43,
            // width: '100%',
            fontSize: '14px !important',
            padding: 10,
        }

    },
    inputContainer: {
        '& > label': {
            display: 'block',
            color: '#5A607F',
            marginBottom: 7
        },
        '& input:focus, & select:focus': {
            outline: 'none!important',
            border: '1px solid #1DBF73'
        },
        marginTop: '25px',
        '&': {
            marginRight: '1rem'
        },
        '& input, & input': {
            fontSize: 18
        },
        '@media only screen and (max-width: 575px)': {
            marginTop: '16px',
            marginRight: '10px'


        },

    },
    firstInput: {
        marginTop: 5,
        '@media only screen and (max-width: 575px)': {
            marginBottom: 10
        },
    }
}))

const Profile = ({ isLoading, submitForm, formikObj, isSuccess, setIsSuccess, isError, setIsError,  }) => {
    const classes = useStyles()
    let history = useHistory();
    const dispatch = useDispatch();
    const imgUploadEleRef = createRef();
    const [isLogoUploaded, setIsLogoUploaded] = useState(false);
    
    const handleDropZoneClick = (evt, dropZoneRef) => {
        evt.preventDefault();
        evt.stopPropagation();
        dropZoneRef.current.gridRef.current.click();
    };

    const handleImgUpload = (obj, formik) => {
        formik.setFieldValue("avatar", { url: `sia:${obj.thumbnail}` }, true);
        setIsLogoUploaded(false);
    };


    return (
        
        <div className={classes.ProfileRoot}>
            <Box>
                
            {isSuccess && <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={isSuccess} autoHideDuration={6000} onClose={setIsSuccess(false)}>
                <Alert onClose={setIsSuccess(false)} severity="success">
                    Profile Successfully Saved!
                </Alert>
            </Snackbar>
            }
            {isError && <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={isError} autoHideDuration={6000} onClose={setIsError(false)}>
                <Alert onClose={setIsError(false)} severity="error">
                    Error Occurred while saving profile!
                </Alert>
            </Snackbar>
            }
                {
                    !isLoading ?
                        <Formik
                            initialValues={getInitValAndValidationSchemaFromSnFormikObj(formikObj).initialValues}
                            validationSchema={Yup.object(getInitValAndValidationSchemaFromSnFormikObj(formikObj).validationSchema)}
                            validateOnChange={true}
                            validateOnBlur={true}
                            onSubmit={submitForm}>
                            {formik => (<form onSubmit={formik.handleSubmit}>
                                <h2>Account  <Button className={classes.submitBtn} onClick={formik.handleSubmit}><Add /> Save Changes </Button>
                                </h2>
                                <Typography className={classes.textInfo}>
                                    This information can be edited from your profile page.
                                </Typography>
                                <Box component="form">
                                    <Box>
                                        <div className="d-none">
                                            <SnUpload
                                                name="files"
                                                source={UPLOAD_SOURCE_NEW_HOSTING_IMG}
                                                ref={imgUploadEleRef}
                                                directoryMode={false}
                                                onUpload={(obj) => handleImgUpload(obj, formik)}
                                                uploadStarted={(e) => setIsLogoUploaded(e)}
                                            />
                                        </div>
                                        <div className={classes.siteLogo} onClick={(evt) => handleDropZoneClick(evt, imgUploadEleRef)} >
                                            {!isLogoUploaded && Object.keys(formik.values.avatar).length == 0 && <div className={classes.profilePlaceholder}>
                                                <PersonOutlineIcon className={classes.avatarIcon} />
                                            </div>}
                                            { !isLogoUploaded && Object.keys(formik.values.avatar).length > 0 && <img
                                                alt="app"
                                                src={skylinkToUrl(formik.values.avatar.url)}
                                                className={classes.siteLogo}
                                                onClick={(evt) => handleDropZoneClick(evt, imgUploadEleRef)}
                                                name="1"
                                            />}
                                            {isLogoUploaded ? <Loader type="Oval" color="#57C074" height={50}  width={50} /> : null}
                                        </div>
                                        <div className={classes.inputGuide}>
                                            Max. size of 5 MB in: JPG or PNG.
                                        </div>
                                        <input type="text" hidden />
                                    </Box>
                                    
                                    <Box display='flex' className={`${classes.formRow} formSiteRow`}>
                                        <Box className={`${classes.inputContainer}`} flex={1}>
                                            <SnTextInput
                                                label={<span> Username <span style={{color: 'red' }}>*</span></span>}
                                                name="username"
                                                className={classes.input}
                                                type="text" 
                                            />
                                        </Box>
                                        <Box className={`${classes.inputContainer}`} flex={1}>
                                            <SnTextInput
                                                label="First Name"
                                                name="firstName"
                                                className={classes.input}
                                                type="text" 
                                            />
                                        </Box>
                                        <Box className={`${classes.inputContainer}`} flex={1}>
                                            <SnTextInput
                                                label="Last Name"
                                                name="lastName"
                                                className={classes.input}
                                                type="text" 
                                            />
                                        </Box>
                                    </Box>
                                    <Box display='flex' className={`${classes.formRow} formSiteRow`}>
                                        <Box className={`${classes.inputContainer}`} flex={1}>
                                            <SnTextInput
                                                label="Location"
                                                name="location"
                                                className={classes.input}
                                                type="text" 
                                            />
                                        </Box>
                                        <Box className={`${classes.inputContainer}`} flex={1}>
                                            <SnTextInput
                                                label="Email"
                                                name="emailID"
                                                className={classes.input}
                                                type="text" 
                                            />
                                        </Box>
                                        <Box className={`${classes.inputContainer}`} flex={1}>
                                            <SnTextInput
                                                label="Contact"
                                                name="contact"
                                                className={classes.input}
                                                type="text" 
                                            />
                                        </Box>
                                    </Box>
                                    <Box display='flex' className={`${classes.formRow} formSiteRow`}>
                                        <Box className={`${classes.inputContainer}`} flex={1}>
                                            <SnTextArea
                                                label="About me"
                                                name="aboutMe"
                                                className={classes.input}
                                            />
                                        </Box>
                                    </Box>
                                    <Box display='flex' className={`${classes.formRow} formSiteRow`}>
                                        <Box className={`${classes.inputContainer}`} flex={1}>
                                            <SnTextInputTag
                                                label="Topics Hidden"
                                                name="topicsHidden"
                                                className={classes.input}
                                            />
                                        </Box>
                                        <Box className={`${classes.inputContainer}`} flex={1}>
                                            <SnTextInputTag
                                                label="Topics Discoverable"
                                                name="topicsDiscoverable"
                                                className={classes.input}
                                            />
                                        </Box>
                                    </Box>
                                    <Box display='flex' className={`${classes.formRow} formSiteRow`}>
                                        <Box className={`${classes.inputContainer}`} flex={1}>
                                            <label>Social Connections</label>
                                        </Box>
                                    </Box>
                                    <Box display='flex' className={`${classes.formRow} formSiteRow`}>
                                        <Box className={`${classes.inputContainer}`} flex={1}>
                                            <SnInputWithIcon
                                                icon={<GitHub />}
                                                label="Github"
                                                name="github"
                                                type="text" 
                                            />
                                        </Box>
                                        <Box className={`${classes.inputContainer}`} flex={1}>
                                            <SnInputWithIcon
                                                icon={<Twitter />}
                                                label="Twitter"
                                                name="twitter"
                                                type="text" 
                                            />
                                        </Box>
                                    </Box>
                                    <Box display='flex' className={`${classes.formRow} formSiteRow`}>
                                        <Box className={`${classes.inputContainer}`} flex={1}>
                                            <SnInputWithIcon
                                                icon={<Facebook />}
                                                label="Facebook"
                                                name="facebook"
                                                type="text" 
                                            />
                                        </Box>
                                        <Box className={`${classes.inputContainer}`} flex={1}>
                                            <SnInputWithIcon
                                                icon={<Reddit />}
                                                label="Reddit"
                                                name="reddit"
                                                type="text" 
                                            />
                                        </Box>
                                    </Box>
                                    <Box display='flex' className={`${classes.formRow} formSiteRow`}>
                                        <Box className={`${classes.inputContainer}`} flex={0.5}>
                                            <SnInputWithIcon
                                                icon={<Telegram />}
                                                label="Telegram"
                                                name="telegram"
                                                type="text" 
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </form>)}
                        </Formik>
                    : null
                }
            </Box >
        </div>
    )
}

export default Profile
