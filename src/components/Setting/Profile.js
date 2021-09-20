import {
  Box,
  Button,
  Grid,
  IconButton,
  makeStyles,
  Snackbar,
  Tooltip
} from "@material-ui/core";
import {
  Add,
  Facebook,
  GitHub,
  Reddit,
  Remove,
  Telegram,
  Twitter,
} from "@material-ui/icons";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import { ReactComponent as UserProfileBackIcon } from '../../assets/img/icons/user-profile-back.svg'
import { ReactComponent as CopyIcon } from '../../assets/img/icons/copy.svg'

import Alert from "@material-ui/lab/Alert";
import { FieldArray, Formik } from "formik";
import React, { createRef, Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { setLoaderDisplay } from "../../redux/action-reducers-epic/SnLoaderAction";
import { setUserProfileAction } from "../../redux/action-reducers-epic/SnUserProfileAction";
import { setProfile } from "../../service/SnSkappService";
import { getUserID } from '../../service/skynet-api';
import SnUpload from "../../uploadUtil/SnUpload";
import { UPLOAD_SOURCE_NEW_HOSTING_IMG } from "../../utils/SnConstants";
import { skylinkToUrl } from "../../service/skynet-api";
import {
  SnInputWithIcon,
  SnTextArea,
  SnTextInput,
  SnTextInputTag,
} from "../Utils/SnFormikControlls";
import {
  getFollowingCountForUser
} from "../../service/SnSkappService"

const useStyles = makeStyles((theme) => ({
  lightProfileRoot: {
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
  darkProfileRoot: {
    backgroundColor: '#1E2029',
    boxShadow: '0px 2px 5px #12141D',
    borderRadius: 6,
    padding: '50px 30px',
    '@media only screen and (max-width: 575px)': {
        padding: '20px 10px',
    },
    '& h2': {
        color: '#fff',
        marginBottom: '1rem',
        '@media only screen and (max-width: 575px)': {
            fontSize: 22,
        },
    }
  },
  textInfo: {
    color: "#000",
    fontSize: 14,
    "@media only screen and (max-width: 575px)": {
      fontSize: 13,
    },
  },
  addBtn: {
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
  },
  removeBtn: {
    border: `1px solid ${theme.palette.error.main}`,
    color: theme.palette.error.main,
    marginTop: 63,
  },
  submitBtn: {
    backgroundColor: '#1DBF73',
    float: "right",
    "& svg": {
      fontSize: "19px",
      marginRight: "5px",
    },
    "@media only screen and (max-width: 575px)": {
      fontSize: "12px",
    },
  },
  copyBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    minWidth: 50,
    height: '100%'
  },
  lightSiteLogo: {
    background: "#fff",
    cursor: "pointer",
    height: 150,
    width: 150,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #D9E1EC",
    borderRadius: "50%",
    marginBottom: 10,
    marginTop: 10,
    "@media only screen and (max-width: 575px)": {
      width: 75,
      height: 75,
      // maxWidth: 340,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  darkSiteLogo: {
    background: "#2A2C34",
    cursor: "pointer",
    height: 150,
    width: 150,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #2A2C34",
    borderRadius: "50%",
    marginBottom: 10,
    marginTop: 10,
    "@media only screen and (max-width: 575px)": {
      width: 75,
      height: 75,
      // maxWidth: 340,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  label: {
    display: "block",
    color: "#5A607F",
    marginBottom: 8,
    fontSize: 18,
    "@media only screen and (max-width: 575px)": {
      fontSize: 16,
    },
  },
  lightProfilePlaceholder: {
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
  darkProfilePlaceholder: {
    width: 150,
    height: 150,
    background: '#2A2C34',
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
  lightBoxHalf: {
    boxShadow: '15px 15px 25px 0px rgba(29,191,115,0.31)',
    background: '#fff',
    padding: ' 10px 1.5rem',
    '& ._details': {
      marginLeft: '1rem'
    },
    borderRadius: 6,
    width: 230,
    maxWidth: '100%'
  },
  darkBoxHalf: {
    boxShadow: '15px 15px 25px 0px rgba(29,191,115,0.31)',
    background: '#2A2C34',
    padding: ' 10px 1.5rem',
    '& ._details': {
      marginLeft: '1rem'
    },
    borderRadius: 6,
    width: 230,
    maxWidth: '100%'
  },
  UserProfile: {
    width: 50,
    height: 50,
    background: 'rgb(29 191 115 / 20%)',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  getAvatarButton: {
    backgroundColor: '#1DBF73',
    color: '#fff'
  },
  WraperUserFollowing: {
    '@media (max-width: 400px)': {
      flexDirection: 'column',
      '& .MuiBox-root': {
        marginLeft: 0,
        marginBottom: 10
      }
    }
  },
  btnUpload: {
    backgroundColor: "#869EA6!important",
    color: "#fff",
    fontSize: 14,
    minWidth: 150,
    "@media only screen and (max-width: 575px)": {
      fontSize: 12,
      height: 40,
    },
    "& svg": {
      marginRight: 7,
    },
  },
  textHelper: {
    fontSize: 13,
    color: "#5C757D",
    marginTop: 5,
    "@media only screen and (max-width: 575px)": {
      fontSize: 12,
    },
  },
  form: {
    marginTop: 20,
  },
  inputGuide: {
    color: "#5C757D",
    "@media only screen and (max-width: 575px)": {
      fontSize: 12,
    },
  },
  lightInput: {
    background: '#fff',
    color: '#2A2C34!important',
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
  darkInput: {
    background: '#2A2C34',
    color: '#D9E1EC!important',
    border: '1px solid rgba(255, 255, 255, 0.1)',
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
    "& > label": {
      display: "block",
      color: "#5A607F",
      marginBottom: 7,
    },
    "& input:focus, & select:focus": {
      outline: "none!important",
      border: "1px solid #1DBF73",
    },
    marginTop: "25px",
    "&": {
      marginRight: "1rem",
    },
    "& input, & input": {
      fontSize: 18,
    },
    "@media only screen and (max-width: 575px)": {
      marginTop: "16px",
      marginRight: "10px",
    },
  },
  firstInput: {
    marginTop: 5,
    "@media only screen and (max-width: 575px)": {
      marginBottom: 10,
    },
  },
  small_avatar: {
    margin: 8,
    height: 64,
    width: 64,
    cursor: "pointer",
  },
  lightUserIDText: {
    color: '#2A2C34'
  },
  darkUserIDText: {
    color: '#fff'
  },
  lightAvatarIcon: {
    color: '#2A2C34'
  },
  darkAvatarIcon: {
    color: '#fff'
  },
  lighth3: {
    color: '#2A2C34'
  },
  darkh3: {
    color: '#fff'
  },
  lightP: {
    color: '#2A2C34'
  },
  darkP: {
    color: '#fff'
  },
}));

const validationSchema = Yup.object().shape({
  username: Yup.string().required("This field is required"),
  emailID: Yup.string().email("Invalid email"),
  contact: Yup.string()
    .matches(/[0-9+-]/, "Invalid contact")
    .max(20),
  otherConnections: Yup.array().of(
    Yup.object().shape({
      channel: Yup.string().required("This field is required"),
      url: Yup.string().required("This field is required"),
    })
  ),
});

const initailValueFormikObj = {
  username: "",
  emailID: "",
  firstName: "",
  lastName: "",
  contact: "",
  aboutMe: "",
  location: "",
  topicsHidden: [],
  topicsDiscoverable: [],
  topics: [],
  avatar: {},
  facebook: "",
  twitter: "",
  github: "",
  reddit: "",
  telegram: "",
  otherConnections: [],
};

const socialConnectionList = [
  { name: "Github", icon: <GitHub /> },
  { name: "Twitter", icon: <Twitter /> },
  { name: "Facebook", icon: <Facebook /> },
  { name: "Reddit", icon: <Reddit /> },
  { name: "Telegram", icon: <Telegram /> },
];

const Profile = ({toggle}) => {
  const [isInitialDataAvailable, setIsInitialDataAvailable] = useState(false);
  const [followingCount, setFollowingCount] = useState(0);
  const [MyUserID, setMyUserID] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // to show Model
  const [isError, setIsError] = useState(false); // to show Model
  const [formikObj, setFormikObj] = useState(initailValueFormikObj); // to store Formik Form data
  const [isLogoUploaded, setIsLogoUploaded] = useState(false);

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const imgUploadEleRef = createRef();

  const userProfile = useSelector((state) => state.snUserProfile);
  const userSession = useSelector((state) => state.userSession);

  useEffect(() => {
    setProfileFormicObj(userProfile);
    setIsInitialDataAvailable(true);
    (async () => {
      //console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ useEffect userProfile "+JSON.stringify(userProfile))
      //console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ useEffect userSession "+userSession)
      const userID = await getUserID();
      setMyUserID(userID);
    })();
  }, [userProfile]);

  useEffect(() => {
    if (userSession == null) {
      history.push("/login");
    }
  })

  useEffect(() => {
    (async () => {
      //console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ useEffect userSession "+userSession)
      if (userSession) {
        const count = await getFollowingCountForUser(null);
        setFollowingCount(count);
      }
    })();
  }, [userSession])

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSuccess(false);
  };
  const copyToClipboard = (e) => {
    const el = document.createElement('textarea');
    el.value = MyUserID;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
  const handleDropZoneClick = (evt, dropZoneRef) => {
    evt.preventDefault();
    evt.stopPropagation();
    dropZoneRef.current.gridRef.current.click();
  };

  const handleImgUpload = (obj, formik) => {
    formik.setFieldValue("avatar", {
      ext: "jpeg",
      w: 300,
      h: 300,
      url: `sia:${obj.thumbnail}`
    }, true);
    setIsLogoUploaded(false);
  };

  const setProfileFormicObj = (profile) => {
    //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ profile from DAC ="+ JSON.stringify(profile))
    if (profile && profile?.username) {
      let temp = { ...initailValueFormikObj, ...profile };
      temp.otherConnections = [];
      temp.avatar = (profile.avatar && profile.avatar[0]) || {};

      profile?.connections?.forEach((item) => {
        for (const key in item) {
          if (
            ["facebook", "twitter", "reddit", "github", "telegram"].includes(
              key
            )
          ) {
            temp[key] = item[key];
          } else {
            temp.otherConnections.push({
              channel: key,
              url: item[key],
            });
          }
        }
      });

      //console.log(temp.otherConnections);

      //temp.topicsHidden = profile?.topicsHidden || [];
      temp.topicsDiscoverable = profile?.topics || [];

      setFormikObj(temp);
    } else {
      setFormikObj(initailValueFormikObj);
    }
  };

  const submitProfileForm = async ({
    twitter,
    facebook,
    reddit,
    github,
    telegram,
    avatar,
    ...rest
  }) => {
    dispatch(setLoaderDisplay(true));
    let profileJSON = {
      version: 1,
      username: rest.username,
      firstName: rest.firstName,
      lastName: rest.lastName,
      emailID: rest.emailID,
      contact: rest.contact,
      aboutMe: rest.aboutMe,
      location: rest.location,
      topics: rest.topicsDiscoverable,
      connections: [
        { twitter },
        { facebook },
        { github },
        { reddit },
        { telegram },
        ...rest.otherConnections
          .filter((item) => !!item.channel)
          .map((item) => ({ [item.channel]: item.url })),
      ],
      avatar: [avatar],
    };
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ BEFORE SAVING PROFILE using DAC =" + JSON.stringify(profileJSON))
    await setProfile(profileJSON);
    dispatch(setUserProfileAction(profileJSON));
    setIsSuccess(true);
    dispatch(setLoaderDisplay(false));
  };

  const handleAddChannelRow = (arrayHelpers) => () => {
    arrayHelpers.push({
      channel: "",
      url: "",
    });
  };

  const handleRemoveChannelRow = (arrayHelpers, ind) => () => {
    arrayHelpers.remove(ind);
  };

  const generateRandomAvatarUrl = (setFieldValue) => () => {
    let rand = Math.floor(Math.random() * (0 - 99) + 99);

    const imgObj = {
      ext: "jpeg",
      w: 300,
      h: 300,
      url: `sia://RABycdgWznT8YeIk57CDE9w0CiwWeHi7JoYOyTwq_UaSXQ/${rand}/300`,
    };
    setFieldValue("avatar", imgObj);
  };
  

  return (
    <div className={toggle ? classes.darkProfileRoot : classes.lightProfileRoot}>
      <Box>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={isSuccess}
          autoHideDuration={5000}
        >
          <Alert onClose={handleClose} severity="success">
            User Profile Successfully Saved!
          </Alert>
        </Snackbar>
        <Snackbar
          aranchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={isError}
          autoHideDuration={5000}
        >
          <Alert onClose={handleClose} severity="error">
            Error Occurred while saving profile!
          </Alert>
        </Snackbar>
        {isInitialDataAvailable ? (
          <Formik
            initialValues={formikObj}
            validationSchema={validationSchema}
            validateOnChange={true}
            validateOnBlur={true}
            enableReinitialize={true}
            onSubmit={submitProfileForm}
          >
            {({ values, ...formik }) => (
             
              <form onSubmit={formik.handleSubmit}>
                <h2>
                  Global User Profile{" "}
                  <Button
                    variant="contained"
                    color="primary"
                    disableElevation
                    className={classes.submitBtn}
                    onClick={formik.handleSubmit}
                  >
                    <Add /> Save Changes{" "}
                  </Button>
                </h2>

                <Box display="flex" alignItems="center" >
                  <Box marginRight=".5rem"><h3 className={toggle ? classes.darkUserIDText : classes.lightUserIDText}>UserID : </h3></Box>
                  {MyUserID ? <>
                    <Tooltip title={MyUserID}>
                      <Box textOverflow="ellipsis" overflow="hidden" className={toggle ? classes.darkUserIDText : classes.lightUserIDText} style={{ width: 200, whiteSpace: 'nowrap' }} >
                      {/* <Box> */}
                        {MyUserID}
                      </Box>
                    </Tooltip>
                    <Button onClick={() => copyToClipboard()}>
                      <CopyIcon />
                    </Button></>
                    :
                    "Loading UserID..."}
                </Box>
                <Box component="form">
                  <Box className={classes.WraperUserFollowing} display="flex" justifyContent="flex-start" alignItems="center" marginTop="1rem">
                    <Box marginLeft="1rem" alignItems="center">
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
                      <div
                        className={toggle ? classes.darkSiteLogo : classes.lightSiteLogo}
                        onClick={(evt) =>
                          handleDropZoneClick(evt, imgUploadEleRef)
                        }
                      >
                        {!isLogoUploaded &&
                          Object.keys(values.avatar).length === 0 &&(
                            <div className={toggle ? classes.darkProfilePlaceholder : classes.lightProfilePlaceholder}>
                              <PersonOutlineIcon className={toggle ? classes.darkAvatarIcon : classes.lightAvatarIcon} />
                            </div>
                          )}
                          {!isLogoUploaded &&
                          Object.keys(values.avatar).length > 0 && 
                          values.avatar.url == ""   &&(
                            <div className={toggle ? classes.darkProfilePlaceholder : classes.lightProfilePlaceholder}>
                              <PersonOutlineIcon className={toggle ? classes.darkAvatarIcon : classes.lightAvatarIcon} />
                            </div>
                          )}
                        {!isLogoUploaded &&
                          Object.keys(values.avatar).length > 0 && 
                          values.avatar.url !== ""  && (
                            <img
                              alt="Image"
                              src={skylinkToUrl(values.avatar.url)}
                              className={toggle ? classes.darkSiteLogo : classes.lightSiteLogo}
                              onClick={(evt) =>
                                handleDropZoneClick(evt, imgUploadEleRef)
                              }
                              name="1"
                            />
                          )}
                        {isLogoUploaded ? (
                          <Loader
                            type="Oval"
                            color="#57C074"
                            height={50}
                            width={50}
                          />
                        ) : null}
                      </div>
                      <input type="text" hidden />
                      <Box justifyContent="center" alignContent="center">
                        <div className={classes.inputGuide}>Upload Image(JPG/PNG) <br /><b>OR</b></div>
                        <Button
                          variant="contained"
                          className={classes.getAvatarButton}
                          disableElevation
                          onClick={generateRandomAvatarUrl(formik.setFieldValue)}
                        >
                          Get Avatar
                        </Button>
                      </Box>
                    </Box>
                    <Box className={toggle ? classes.darkBoxHalf : classes.lightBoxHalf} display="flex" marginLeft="1rem" alignItems="center">
                      <div className={classes.UserProfile}>
                        <UserProfileBackIcon />
                      </div>
                      <div className='_details'>
                        <h3 className={toggle ? classes.darkh3 : classes.lighth3}>{followingCount}</h3>
                        <p className={toggle ? classes.darkP : classes.lightP}>Following</p>
                      </div>
                    </Box>
                  </Box>

                  <Box
                    display="flex"
                    className={`${classes.formRow} formSiteRow`}
                  >
                    <Box className={`${classes.inputContainer}`} flex={1}>
                      <SnTextInput
                        label={
                          <span>
                            {" "}
                            Username <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        name="username"
                        className={toggle ? classes.darkInput : classes.lightInput}
                        type="text"
                      />
                    </Box>
                    <Box className={`${classes.inputContainer}`} flex={1}>
                      <SnTextInput
                        label="First Name"
                        name="firstName"
                        className={toggle ? classes.darkInput : classes.lightInput}
                        type="text"
                      />
                    </Box>
                    <Box className={`${classes.inputContainer}`} flex={1}>
                      <SnTextInput
                        label="Last Name"
                        name="lastName"
                        className={toggle ? classes.darkInput : classes.lightInput}
                        type="text"
                      />
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    className={`${classes.formRow} formSiteRow`}
                  >
                    <Box className={`${classes.inputContainer}`} flex={1}>
                      <SnTextInput
                        label="Location"
                        name="location"
                        className={toggle ? classes.darkInput : classes.lightInput}
                        type="text"
                      />
                    </Box>
                    <Box className={`${classes.inputContainer}`} flex={1}>
                      <SnTextInput
                        label="Email"
                        name="emailID"
                        className={toggle ? classes.darkInput : classes.lightInput}
                        type="text"
                      />
                    </Box>
                    <Box className={`${classes.inputContainer}`} flex={1}>
                      <SnTextInput
                        label="Contact"
                        name="contact"
                        className={toggle ? classes.darkInput : classes.lightInput}
                        type="text"
                      />
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    className={`${classes.formRow} formSiteRow`}
                  >
                    <Box className={`${classes.inputContainer}`} flex={1}>
                      <SnTextArea
                        label="About me"
                        name="aboutMe"
                        className={toggle ? classes.darkInput : classes.lightInput}
                      />
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    className={`${classes.formRow} formSiteRow`}
                  >
                    <Box className={`${classes.inputContainer}`} flex={1}>
                      <SnTextInputTag disabled
                        label="Topics Hidden - Disabled (coming soon)"
                        name="topicsHidden"
                        className={toggle ? classes.darkInput : classes.lightInput}
                      />
                    </Box>
                    <Box className={`${classes.inputContainer}`} flex={1}>
                      <SnTextInputTag
                        label="Topics Discoverable"
                        name="topicsDiscoverable"
                        className={toggle ? classes.darkInput : classes.lightInput}
                      />
                    </Box>
                  </Box>

                  <Box
                    display="flex"
                    className={`${classes.formRow} formSiteRow`}
                  >
                    <Box className={`${classes.inputContainer}`} flex={1}>
                      <label>Social Connections</label>
                    </Box>
                  </Box>

                  <Grid container spacing={0}>
                    {socialConnectionList.map((item) => (
                      <Grid item sm={6} xs={12} key={item.name}>
                        <Box className={`${classes.inputContainer}`}>
                          <SnInputWithIcon
                            toggle={toggle}
                            icon={item.icon}
                            label={item.name}
                            name={item.name.toLocaleLowerCase()}
                            type="text"
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  <FieldArray name="otherConnections">
                    {(arrayHelpers) => (
                      <Fragment>
                        <Grid container spacing={0}>
                          {values.otherConnections?.map((item, ind) => (
                            <Fragment key={ind}>
                              <Grid item sm={5} xs={12}>
                                <Box className={`${classes.inputContainer}`}>
                                  <SnTextInput
                                    className={classes.input}
                                    label="Channel"
                                    name={`otherConnections[${ind}].channel`}
                                    type="text"
                                  />
                                </Box>
                              </Grid>
                              <Grid item sm={6} xs={12}>
                                <Box className={`${classes.inputContainer}`}>
                                  <SnTextInput
                                    className={classes.input}
                                    label="Channel Url"
                                    name={`otherConnections[${ind}].url`}
                                    type="text"
                                  />
                                </Box>
                              </Grid>
                              <Grid item sm={1} xs={12}>
                                <IconButton
                                  className={classes.removeBtn}
                                  size="small"
                                  type="button"
                                  onClick={handleRemoveChannelRow(
                                    arrayHelpers,
                                    ind
                                  )}
                                >
                                  <Remove />
                                </IconButton>
                              </Grid>
                            </Fragment>
                          ))}
                        </Grid>

                        <Box textAlign="center" mt="1.5rem">
                          <IconButton
                            className={classes.addBtn}
                            type="button"
                            onClick={handleAddChannelRow(arrayHelpers)}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </Fragment>
                    )}
                  </FieldArray>
                </Box>
              </form>
            )}
          </Formik>
        ) : null}
      </Box>
    </div>
  );
};

export default Profile;
