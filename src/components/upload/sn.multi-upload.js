import React, { useState, useEffect, createRef } from "react"
import FormControl from "@material-ui/core/FormControl"
import { useLocation } from "react-router-dom"
import FileCopyIcon from "@material-ui/icons/FileCopy"
import DescriptionIcon from "@material-ui/icons/Description"
import { BsFileEarmarkArrowUp } from "react-icons/bs"
import FormHelperText from "@material-ui/core/FormHelperText"
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert from "@material-ui/lab/Alert"
import { parseSkylink } from "skynet-js"
import ChipInput from "material-ui-chip-input"
import Grid from "@material-ui/core/Grid"
import { useSelector, useDispatch } from "react-redux"
import {
  FormControlLabel,
  Paper,
  Switch,
  Typography,
  useMediaQuery,
  withStyles,
} from "@material-ui/core"
import { DropzoneArea } from "material-ui-dropzone"
import { launchSkyLink, setTypeFromFile } from "../../sn.util"
import { getPublicApps } from "../../skynet/sn.api.skynet"
import SnUpload from "../new/sn.upload"
import {
  getEmptyHistoryObject,
  createEmptyErrObj,
  getEmptySkylinkObject,
} from "../new/sn.new.constants"
import {
  bsAddSkylink,
  bsAddToHistory,
  bsAddSkylinkFromSkyspaceList,
  bsAddSkylinkOnly,
  bsAddSkhubListToSkylinkIdx,
  bsAddBulkSkyspace,
} from "../../blockstack/blockstack-api"

import { UPLOAD, PUBLIC_IMPORT, PUBLIC_TO_ACC_QUERY_PARAM } from "../../sn.constants"
import { fetchSkyspaceAppCount } from "../../reducers/actions/sn.skyspace-app-count.action"
import SnAddToSkyspaceModal from "../modals/sn.add-to-skyspace.modal"
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action"
import { fetchSkyspaceList } from "../../reducers/actions/sn.skyspace-list.action"
import AutoComp from "./autofield/autofield"
import useStyles from "./sn.multi-upload.styles"
import SnFooter from "../footer/sn.footer"
import SnLandingUploadDisclaimer from "./sn.landing-upload-disclaimer"

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const PurpleSwitch = withStyles({
  switchBase: {
    "&$checked": {
      color: "#28a745",
    },
    "&$checked + $track": {
      backgroundColor: "#28a745",
    },
  },
  checked: {},
  track: {},
})(Switch)

export default function SnMultiUpload(props) {
  const dispatch = useDispatch()
  const query = useQuery()

  const matches = useMediaQuery("(min-width:950px)")

  const classes = useStyles()

  const [errorObj] = useState(createEmptyErrObj())
  const [tags, setTags] = useState([])
  const [isDirUpload, setIsDirUpload] = useState(false)
  const [skyspaceList, setSkyspaceList] = useState([])
  const [dnldSkylink, setDnldSkylink] = useState([])
  const [showPublicToAccModal, setShowPublicToAccModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertSeverity, setAlertSeverity] = useState("success")
  const [state, setState] = React.useState({
    checkedA: false,
    checkedB: true,
  })
  const [thumbnail, setThumb] = React.useState("")
  const uploadEleRef = createRef()
  const dropZoneRef = createRef()

  const stUserSession = useSelector((state) => state.userSession)
  const stSnSkyspaceList = useSelector((state) => state.snSkyspaceList)
  const stPerson = useSelector((state) => state.person)
  const stUploadList = useSelector((state) => state.snUploadList)
  const stUserSetting = useSelector((state) => state.snUserSetting)
  const skyapp = getEmptySkylinkObject()

  useEffect(() => {
    handlePublicToAcc()
  }, [stPerson])

  useEffect(() => {
    handlePublicToAcc()
  }, [query.get(PUBLIC_TO_ACC_QUERY_PARAM)])

  useEffect(() => {
    handlePublicToAcc()
  }, [])

  const handleSwitchChnge = (event) => {
    setIsDirUpload(event.target.checked)
  }
  const handleImage = (files) => {
    if (files.length) {
      setThumb(files[0])
    }
  }
  const delImg = () => {
    setThumb("")
  }

  const handlePublicToAcc = () => {
    if (stPerson != null) {
      const publicToAccHash = query.get(PUBLIC_TO_ACC_QUERY_PARAM)
      if (publicToAccHash != null) {
        setShowPublicToAccModal(true)
      }
    }
  }

  const onUpload = async (uploadObj) => {
    if (stPerson) {
      const app = { ...getEmptySkylinkObject(), ...uploadObj }
      app.tags = tags
      app.skyspaceList = skyspaceList
      setTypeFromFile(app.contentType, app)
      const skhubId = await bsAddSkylink(stUserSession, app, stPerson)
      skyspaceList &&
        skyspaceList.length > 0 &&
        (await bsAddSkylinkFromSkyspaceList(stUserSession, skhubId, skyspaceList))
      dispatch(fetchSkyspaceAppCount())
      const historyObj = { ...getEmptyHistoryObject(), ...app }
      historyObj.fileName = app.name
      historyObj.action = UPLOAD
      historyObj.skyspaces = app.skyspaceList
      historyObj.savedToSkySpaces = skyspaceList && skyspaceList.length > 0
      historyObj.skhubId = skhubId
      await bsAddToHistory(stUserSession, historyObj)
    }
  }

  const onDownload = () => {
    try {
      const skylink = parseSkylink(dnldSkylink)
      launchSkyLink(skylink, stUserSetting)
    } catch (e) {
      setShowAlert(true)
      setAlertSeverity("error")
      setAlertMessage("Invalid skylink!")
    }
  }

  const importPublicAppsToSpaces = async (skyspaceList) => {
    setShowPublicToAccModal(false)
    dispatch(setLoaderDisplay(true))
    const spacesToCreate = skyspaceList.filter((x) => !stSnSkyspaceList.includes(x))
    const publicObj = await getPublicApps(query.get(PUBLIC_TO_ACC_QUERY_PARAM))
    const promises = []
    const skhubIdList = []
    const val = publicObj?.data?.map((app) => {
      app.skhubId = null
      promises.push(
        bsAddSkylinkOnly(stUserSession, app, stPerson).then((skhubid) =>
          skhubIdList.push(skhubid)
        )
      )
    })
    spacesToCreate &&
      spacesToCreate.length > 0 &&
      promises.push(bsAddBulkSkyspace(stUserSession, spacesToCreate))
    await Promise.all(promises)
    promises.length = 0

    const historyObj = getEmptyHistoryObject()
    historyObj.fileName = "NA"
    historyObj.action = PUBLIC_IMPORT
    historyObj.skyspaces = skyspaceList.join(", ")
    historyObj.savedToSkySpaces = skyspaceList && skyspaceList.length > 0
    historyObj.skylink = query.get(PUBLIC_TO_ACC_QUERY_PARAM)
    promises.push(bsAddToHistory(stUserSession, historyObj))
    promises.push(bsAddSkhubListToSkylinkIdx(stUserSession, skhubIdList))
    promises.push(
      bsAddSkylinkFromSkyspaceList(stUserSession, skhubIdList, skyspaceList)
    )
    await Promise.all(promises)

    dispatch(setLoaderDisplay(false))

    dispatch(fetchSkyspaceList())
    dispatch(fetchSkyspaceAppCount())
  }

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
  }

  return (
    <main className={matches ? classes.content : classes.contentBgColor}>
      <div
        style={{
          paddingTop: 40,
          minHeight: "calc(100vh - 70px)",
        }}
      >
        <Grid container spacing={3} className={classes.most_main_grid_uc}>
          <SnLandingUploadDisclaimer />
          <Grid item xs={12} className={classes.main_grid_uc}>
            <Paper className={`${classes.paper} ${classes.MaintabsPaper_uc}`}>
              <Paper className={classes.tabsPaper_uc}>
                <Typography className={classes.uc_title}>
                  Upload Files/Folders to your Space
                </Typography>
                <Grid container spacing={3} className={classes.tags_inpt_main_grid}>
                  <Grid
                    item
                    lg={5}
                    md={5}
                    sm={5}
                    xs={12}
                    style={{ padding: "none" }}
                  >
                    {stSnSkyspaceList && (
                      <AutoComp list={stSnSkyspaceList} onChange={setSkyspaceList} />
                    )}
                  </Grid>
                  {stPerson && (
                    <Grid item lg={5} md={5} sm={5} xs={12} className="select-grid">
                      <FormControl
                        className={classes.formControl}
                        error={errorObj.tags}
                      >
                        <ChipInput defaultValue={skyapp.tags} onChange={setTags} />
                        <FormHelperText>Add Tags</FormHelperText>
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item xs={2}>
                    <FormControlLabel
                      control={
                        <PurpleSwitch
                          onChange={handleSwitchChnge}
                          name="checkedA"
                          color="default"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      }
                      label="Dir Upload"
                    />
                  </Grid>
                </Grid>
                {/* dropzone */}
                <Grid container spacing={3} className="drpZone_main_grid">
                  <Grid item xs={12}>
                    {/* <div className="d-none"> */}
                    <div>
                      <SnUpload
                        name="files"
                        ref={uploadEleRef}
                        directoryMode={isDirUpload}
                        onUpload={onUpload}
                      />
                    </div>
                    <div className="d-none">
                      <DropzoneArea
                        showPreviewsInDropzone={false}
                        onDrop={(files) => {
                          uploadEleRef.current.handleDrop(files)
                        }}
                        //  className={classes.dropZonArea}
                        Icon="none"
                        inputProps={{ webkitdirectory: true, mozdirectory: true }}
                        ref={dropZoneRef}
                        webkitdirectory
                        mozdirectory
                        maxFileSize={210000000}
                        onDelete={delImg}
                        filesLimit={100}
                        showAlerts={false}
                        dropzoneText={
                          <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                            <div>
                              <BsFileEarmarkArrowUp
                                style={{
                                  fontSize: "55px",
                                  color: "#c5c5c5",
                                  marginBottom: "10px",
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: "bold",
                                color: "#c5c5c5",
                              }}
                            >
                              Drop a {isDirUpload ? "directory" : "file"} here or
                              <span style={{ color: "#1ed660", marginLeft: "3px" }}>
                                click here to upload
                              </span>
                            </span>
                          </div>
                        }
                      />
                    </div>
                  </Grid>
                </Grid>

                {stUploadList &&
                  stUploadList.length > 0 &&
                  stUploadList.map((fileObj) => (
                    <Grid container spacing={3}>
                      <Grid item xs={12} className={classes.show_img_title_grid}>
                        <span>
                          <DescriptionIcon className={classes.descIcon} />
                        </span>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <div>
                            <Typography className={classes.linkName}>
                              {fileObj?.file?.path}
                            </Typography>
                            {fileObj?.status && fileObj?.status === "complete" && (
                              <Typography className={classes.linkName}>
                                Skylink: {fileObj?.url}
                              </Typography>
                            )}
                            {fileObj?.status && fileObj?.status !== "complete" && (
                              <Typography className={classes.linkName}>
                                {fileObj?.status.toUpperCase()}{" "}
                                {fileObj?.status === "uploading" &&
                                  !isNaN(fileObj.progress) &&
                                  `${Math.trunc(fileObj.progress * 100)} %`}
                              </Typography>
                            )}
                          </div>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            {/* <TiAttachment
                      style={{
                        fontSize: "18px",
                        color: "#1ed660",
                        marginRight: 10,
                      }}
                    /> */}
                            {fileObj?.status === "complete" && (
                              <FileCopyIcon
                                className={classes.descIcon}
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => copyToClipboard(fileObj?.url)}
                              />
                            )}
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  ))}
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      </div>
      <Snackbar
        open={showAlert}
        autoHideDuration={4000}
        onClose={() => setShowAlert(false)}
      >
        <Alert
          onClose={() => setShowAlert(false)}
          severity={alertSeverity || "success"}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      {/* <UploadProgress /> */}
      <SnAddToSkyspaceModal
        userSession={stUserSession}
        title="Import Into Existing Space Or Add To New Space"
        open={showPublicToAccModal}
        disableBackdropClick
        disableEscapeKeyDown
        availableSkyspaces={stSnSkyspaceList}
        showAddSkyspace
        onClose={() => setShowPublicToAccModal(false)}
        onSave={importPublicAppsToSpaces}
      />
      <div>
        <SnFooter />
      </div>
    </main>
  )
}
