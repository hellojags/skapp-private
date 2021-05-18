import React, { createRef, useState } from 'react';
import { Box, Button, makeStyles, Grid, ListItemIcon, List, ListItem, Typography, FormGroup, FormControlLabel } from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DescriptionIcon from "@material-ui/icons/Description";
import styles from '../../assets/jss/app-details/SubmitAppStyles';
import "./DeploySiteStyles.css";
import moment from "moment";
import Switch from './Switch'
// img icon
import { BsFileEarmarkArrowUp } from "react-icons/bs";
import SnUpload from "../../uploadUtil/SnUpload";
import DoneIcon from '@material-ui/icons/Done'
import { ReactComponent as UploadIcon } from '../../assets/img/icons/cloud-upload-outline.svg'
import { ReactComponent as SettingIcon } from '../../assets/img/icons/settingIconGreen.svg';
import { ReactComponent as IcIcon } from '../../assets/img/icons/ic_increase.svg';
import { DropzoneArea } from 'material-ui-dropzone';
import { UPLOAD_SOURCE_DEPLOY } from '../../utils/SnConstants';
import { IOSSwitch } from "./Switch";
import { setMyHostedApp } from '../../service/SnSkappService';
import { setLoaderDisplay } from '../../redux/action-reducers-epic/SnLoaderAction';
import { genHostedAppSkappUrl, getBase32Skylink } from "../../utils/SnUtility";
import useShowHostingLinks from '../../hooks/useShowHostingLinks';
import { useLoadHostedAppFromUrl } from '../../hooks/useLoadHostedAppFromUrl';
const useStyles = makeStyles(styles)

const DeploySite = ({toggle}) => {

    const classes = useStyles();

    const uploadEleRef = createRef();
    const dropZoneRef = createRef();

    const [isFileUpload, setIsFileUpload] = useState(false);
    const [appDetail, setAppDetail] = useLoadHostedAppFromUrl();
    const dispatch = useDispatch();
    const snUploadListStore = useSelector((state) => state.snUploadListStore);

    useShowHostingLinks();

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
    };

    const handleDropZoneClick = (evt)=> {
        evt.preventDefault();
        evt.stopPropagation();
        uploadEleRef.current.gridRef.current.click();
    };

    const updateHostedApp = async (obj) => {
        dispatch(setLoaderDisplay(true));
        let currAppDetail = appDetail;
        currAppDetail.content.skylink = obj.skylink;
        const newAppDetail = await setMyHostedApp(currAppDetail.content, currAppDetail.id);
        dispatch(setLoaderDisplay(false));
        setAppDetail(newAppDetail);
    };

    {toggle ? document.body.className = "darkBodyColor" : document.body.className = "lightBodyColor"}

    return (
        <Box >
            <Box display="flex" alignItems="center" justifyContent='space-between' marginTop='7px'>
                <h1 className={toggle ? classes.darkh1 : classes.lighth1}>
                    {appDetail?.content?.appName && `${appDetail.content.appName} / Deploy`}
                </h1>
                <Box className={classes.btnBox + " d-none temp"}>
                    <Button className={classes.settingBtn}>
                        <SettingIcon />
                        Setting
                    </Button>
                </Box>
            </Box>

            <Box component="form">
                {/* < */}
                <Grid container spacing={2} className={classes.GridContainer}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <h4 className={classes.h4}>DNS</h4>
                        <div className={toggle ? classes.darkDNSContainer : classes.lightDNSContainer}>
                            <p className={classes.ContentItemTitle}>Skapp URL</p>
                            <p className={toggle ? classes.darkSiteLink : classes.lightSiteLink}>
                                {genHostedAppSkappUrl(appDetail)}
                            </p>
                            <Box display="flex" justifyContent="space-between" marginTop='15px'>
                                <div>
                                    <p className={classes.ContentItemTitle}>Skapp Base 32 URL</p>
                                    <p className={toggle ? classes.darkSiteLink : classes.lightSiteLink}>
                                        { appDetail?.content?.skylink && appDetail.content.storageGateway &&
                                        `https://${getBase32Skylink(appDetail.content.skylink)}.${appDetail?.content?.storageGateway}`}
                                    </p>
                                </div>
                                <span className={classes.changeBtnLink + " d-none temp"}>Change</span>
                            </Box>

                        </div>
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <h4 className={classes.h4}>Deployments</h4>
                        <div className={toggle ? classes.darkDevelopmentsContainer : classes.lightDevelopmentsContainer}>

                            <List

                                component="div"
                                aria-labelledby="list"

                                className={classes.ListRoot}
                            >
                                {   appDetail?.content?.history && 
                                    Object.keys(appDetail.content.history)
                                    .sort((ts1, ts2)=>parseInt(ts2)-parseInt(ts1))
                                    .map((ts, idx, arr) => 
                                    <ListItem button key={idx}>
                                        <Box display="flex" marginRight="auto" alignItems="center">
                                            <ListItemIcon>
                                                <DoneIcon />
                                            </ListItemIcon>
                                            <p>#{(arr.length - idx)}</p>
                                        </Box>
                                        <span>{moment(parseInt(ts)).fromNow()}</span>
                                    </ListItem>
                                )
                            }
                            </List>
                        </div>
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <h4 className={classes.h4}>Statistics</h4>
                        <div className={toggle ? classes.darkStatsContainer : classes.lightStatsContainer}>
                            <Grid container>
                                <Grid className={classes.statCol} item xs={12} sm={6} md={6} >
                                    <div className={classes.StatTitle}>
                                        Number Of Files
                                    </div>
                                    <div className={toggle ? classes.darkStatValue : classes.lightStatValue}>
                                        400
                                    </div>
                                    <div className={toggle ? classes.darkGraphText : classes.lightGraphText}>
                                        <span>+10.01%</span> <IcIcon />
                                    </div>
                                </Grid>
                                <Grid flex={1} alignSelf="center" item xs={12} sm={6} md={6}>
                                    <Box className={`${classes.statCol} ${classes.paddingLeft}`} >

                                        <div className={classes.StatTitle}>
                                            Number Of Files
                                    </div>
                                        <div className={toggle ? classes.darkStatValue : classes.lightStatValue}>
                                            400
                                    </div>
                                        <div className={toggle ? classes.darkGraphText : classes.lightGraphText}>
                                            <span>+10.01%</span> <IcIcon />
                                        </div>
                                    </Box>
                                    <p style={{ textAlign: 'center', fontSize: 16, color: '#97A0C3', marginTop: 10 }}>Skapp Version Number: 1.0</p>
                                </Grid>
                            </Grid>

                        </div>
                    </Grid>
                </Grid>

                <div className={classes.OneRowInput}>
                    <div className="d-none temp">
                        <FormGroup>
                            <FormControlLabel style={{ color: '#5A607F', marginBottom: 5 }}
                                label="Upload File"
                                control={<IOSSwitch 
                                        onChange={(evt) => setIsFileUpload(evt.target.checked)} 
                                        name="toggleFileUpload" />}

                            />
                        </FormGroup>
                    </div>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box>
                                <div className="d-none">
                                    <SnUpload
                                        name="files"
                                        source={UPLOAD_SOURCE_DEPLOY}
                                        ref={uploadEleRef}
                                        directoryMode={!isFileUpload}
                                        onUpload={updateHostedApp}
                                    />

                                </div>
                                <div className={toggle ? classes.darkPreviewImg : classes.lightPreviewImg} style={{ flexDirection: 'column', width: '100%', minHeight: '230px' }}>
                                    <DropzoneArea
                                        showPreviewsInDropzone={false}
                                        onDrop={(files) => {
                                            uploadEleRef.current.handleDrop(files)
                                        }}
                                        //  className={classes.dropZonArea}
                                        Icon={"none"}
                                        inputProps={{ webkitdirectory: true, mozdirectory: true }}
                                        ref={dropZoneRef}
                                        webkitdirectory={true}
                                        mozdirectory={true}
                                        maxFileSize={210000000}
                                        // onDelete={delImg}
                                        filesLimit={1}
                                        showAlerts={false}
                                        dropzoneText={
                                            <div id="dropzone-text" onClick={handleDropZoneClick}>
                                                <div><UploadIcon /></div>

                                                <div style={{ color: '#5C757D' }}>
                                                    Drag and drop files or folder here
                                                </div>
                                                <Button className={toggle ? classes.darkUploadBtn : classes.lightUploadBtn}>
                                                    Select {isFileUpload ? "Files" : "Folder"}
                                                </Button>
                                            </div>
                                        }
                                    />
                                </div>
                            </Box>
                            <Box>
                                {snUploadListStore && snUploadListStore[UPLOAD_SOURCE_DEPLOY] && snUploadListStore[UPLOAD_SOURCE_DEPLOY].length > 0 && snUploadListStore[UPLOAD_SOURCE_DEPLOY]
                                    .map((fileObj) => (
                                        <Grid
                                            item
                                            xs={12}
                                            className={classes.show_img_title_grid}
                                            style={{ paddingTop: "20px", paddingBottom: "20px" }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    width: "100%",
                                                }}
                                            >
                                                <div >

                                                    <Typography className={classes.linkName}>
                                                        <span>
                                                            <DescriptionIcon className={classes.descIcon} />
                                                        </span>
                                                        {fileObj?.file?.path || fileObj?.file?.name}
                                                    </Typography>
                                                    {fileObj?.status && fileObj?.status === 'complete' && (<Typography className={classes.linkName}>
                                                        Skylink: {fileObj?.url}
                                                    </Typography>)}
                                                    {fileObj?.status && fileObj?.status !== 'complete' && (<Typography className={classes.linkName}>
                                                        {fileObj?.status.toUpperCase()} {fileObj?.status === 'uploading' && !isNaN(fileObj.progress) && `${(Math.trunc(fileObj.progress * 100))} %`}
                                                    </Typography>)}
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    {/* <TiAttachment
                      style={{
                        fontSize: "18px",
                        color: "#1ed660",
                        marginRight: 10,
                      }}
                    /> */}
                                                    {fileObj?.status === 'complete' && <FileCopyIcon
                                                        className={classes.descIcon}
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => copyToClipboard(fileObj?.url)}
                                                    />}
                                                </div>
                                            </div>
                                        </Grid>))}
                            </Box>
                        </Grid>

                    </Grid>
                </div>
            </Box>

        </Box >
    )
}

export default DeploySite
