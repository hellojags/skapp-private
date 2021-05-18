import {
  Grid,
  TextField,
  Paper,
  Typography,
  Button,
  Avatar,
  Snackbar,
} from "@material-ui/core"
import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import MuiAlert from "@material-ui/lab/Alert"
import classNames from "classnames/bind"
import SaveIcon from "@material-ui/icons/Save"
import { useForm, Controller } from "react-hook-form"
import useStyles from "./sn.profile.style"
import SnFooter from "../footer/sn.footer"

import { setUserProfileAction } from "../../reducers/actions/sn.userprofile.action"

import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action"
import { bsSetUserAppProfile } from "../../blockstack/blockstack-api"
import { createEmptyErrObj } from "../new/sn.new.constants"
import { addUserPubKeyInCache } from "../../api/sn.api"
import {getPortalUrl} from '../../service/skynet-api'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}
export default function SnProfile(props) {
  // Hooks
  const { handleSubmit, register, control, errors } = useForm()
  const classes = useStyles()
  const dispatch = useDispatch()
  // const history = useHistory();

  // States
  // const [userProfile, setUserProfile] = useState(null);
  const [errorObj, setErrorObj] = useState(createEmptyErrObj())
  // const [data, setData] = useState();
  // const [masterProfile, setPreferences] = useState({});
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  })

  const { vertical, horizontal, open } = state

  // Store
  const userProfile = useSelector((state) => state.snUserProfile)
  const userPreferences = useSelector((state) => state.snUserPreferences)
  const userSession = useSelector((state) => state.userSession)

  // Effects
  // useEffect(() => {
  //   //   //setData(defaultValues);
  //   //   // fetchProfile JSON
  //   //   // If not found Initialize it and show on UI
  //   //   //dispatch(getUserPreferencesAction(userSession));
  //   //   //dispatch(getUserProfileAction(userSession));
  // }, [userProfile, userPreferences])

  const handleClick = (newState) => () => {
    setState({ open: true, ...newState })
  }

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  const onSubmit = async (data) => {
    dispatch(setLoaderDisplay(true))
    const updatedData = { ...userProfile, ...data, lastUpdateTS: new Date() }
    dispatch(setUserProfileAction(updatedData))
    await bsSetUserAppProfile(userSession, updatedData)
    await addUserPubKeyInCache({ publickey: userSession?.person?.masterPublicKey })
    dispatch(setLoaderDisplay(false))
    setState({ ...state, open: true })
    // call action to Update data
  }

  return (
    <main className={classes.content}>
      <div style={{ paddingTop: 70, minHeight: "calc(100vh - 100px)" }}>
        <Grid
          container
          spacing={3}
          className={`most_main_grid_ef ${classes.most_main_grid_ef}`}
        >
          <Grid item xs={12} className={classes.main_grid_ef}>
            <Paper className={`${classes.paper} ${classes.MaintabsPaper_ef}`}>
              <Paper className={classes.tabsPaper_ef}>
                <Typography className={classes.title1_ef}>
                  {" "}
                  Main Profile (Sky-ID){" "}
                </Typography>
                <Grid
                  container
                  spacing={2}
                  justify="flex-start"
                  alignItems="center"
                  style={{ paddingTop: "15px" }}
                >
                  <Grid item xs={2} sm={2} md={1} lg={1}>
                    <Avatar
                      alt={userPreferences?.username}
                      src={`${DEFAULT_PORTAL}/${userPreferences.avatar}`}
                      className={classes.large}
                    />
                  </Grid>
                  <Grid item xs={10} sm={5} md={3} lg={2}>
                    <TextField
                      disabled
                      id="standard-basic"
                      label="username"
                      defaultValue={userPreferences?.username}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={5} md={3} lg={2}>
                    <TextField
                      disabled
                      id="standard-basic"
                      label="location"
                      defaultValue={userPreferences?.location}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={5} lg={7}>
                    <TextField
                      disabled
                      id="standard-basic"
                      label="Aboutme"
                      defaultValue={userPreferences?.aboutMe}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <br />
                {/* <Divider variant="middle"/> */}
                <Typography className={classes.title1_ef}>
                  {" "}
                  Developer Profile
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} style={{ paddingTop: "15px" }}>
                      <Controller
                        as={TextField}
                        required
                        name="devName"
                        label="Developer Name"
                        fullWidth
                        defaultValue={userProfile.devName}
                        control={control}
                        inputRef={register({ required: true })}
                      />
                      {errors.devName && <span>This field is required</span>}
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        as={TextField}
                        required
                        name="devGitId"
                        label="GitHub/GitLab ID"
                        fullWidth
                        defaultValue={userProfile.devGitId}
                        control={control}
                        inputRef={register({ required: true })}
                      />
                      {errors.aboutme && <span>This field is required</span>}
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        as={TextField}
                        required
                        name="devGitRepo"
                        label="Git Repository URL"
                        fullWidth
                        defaultValue={userProfile.devGitRepo}
                        control={control}
                        inputRef={register({ required: true })}
                      />
                      {errors.git && <span>This field is required</span>}
                    </Grid>
                    <Grid item xs={12} style={{ paddingTop: "15px" }}>
                      <Controller
                        as={TextField}
                        required
                        name="devInfo"
                        label="Developer AboutMe"
                        multiline
                        rows={2}
                        fullWidth
                        defaultValue={userProfile.devInfo}
                        control={control}
                        variant="outlined"
                        inputRef={register({ required: true })}
                      />
                      {errors.git && <span>This field is required</span>}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      className={classNames({
                        "button-grid": true,
                      })}
                    >
                      <Grid container spacing={3}>
                        <Grid
                          item
                          xs={12}
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            paddingTop: "30PX",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            type="submit"
                            className={`${classes.button}  ${classes.ef_saveBtn}`}
                            startIcon={<SaveIcon />}
                          >
                            Save
                          </Button>
                          {/* <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className={`${classes.button}  ${classes.ef_doneBtn}`}
                            startIcon={<CheckCircleIcon />}
                            // onClick={(evt) => handleDoneBtn(evt)}
                            type="button"
                          >
                            Cancel
                          </Button> */}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
                {/* </ValidatorForm> */}
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          Profile saved Successfully.
        </Alert>
      </Snackbar>
      {/* <Alert severity="error">Some Error occured while saving your profile.</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert> */}

      <div>
        <SnFooter />
      </div>
    </main>
  )
}
