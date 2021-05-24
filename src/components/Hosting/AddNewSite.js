import React, { createRef, useEffect, useState } from 'react';
import { Box, Button, makeStyles, Grid, FormGroup, FormControlLabel, Typography, Tooltip } from '@material-ui/core';

import Select from 'react-select';
import { Field, Formik, useFormik } from 'formik';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DescriptionIcon from "@material-ui/icons/Description";
import * as Yup from 'yup';
import { Add, HelpOutline } from '@material-ui/icons';
import Switch, { IOSSwitch } from './Switch';
import styles from './AddNewSiteStyles';
// img icon
import { ReactComponent as ImgIcon } from '../../assets/img/icons/image.svg';
import { ReactComponent as LinkIcon } from '../../assets/img/icons/attachment-link.9.svg';
import { ReactComponent as UploadIcon } from '../../assets/img/icons/cloud-upload-outline.svg';
import { SnTextInput, SnSelect } from '../Utils/SnFormikControlls';
import { skylinkToUrl } from "../../service/skynet-api";
import { getInitValAndValidationSchemaFromSnFormikObj } from '../../service/SnFormikUtilService';
import { getHNSSkyDBURL, setMyHostedApp } from '../../service/SnSkappService';
import { useHistory } from 'react-router-dom';
import SnUpload from '../../uploadUtil/SnUpload';
import { UPLOAD_SOURCE_DEPLOY, UPLOAD_SOURCE_NEW_HOSTING, UPLOAD_SOURCE_NEW_HOSTING_IMG } from '../../utils/SnConstants';
import { DropzoneArea } from 'material-ui-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { setUploadList } from '../../redux/action-reducers-epic/SnUploadListAction';
import SnInfoModal from '../Modals/SnInfoModal';
import { getPortalList } from '../../utils/SnNewObject';
import { setLoaderDisplay } from '../../redux/action-reducers-epic/SnLoaderAction';
import Loader from "react-loader-spinner";
import {getPortalUrl} from '../../service/skynet-api'

const useStyles = makeStyles(styles)
const versionOptions = [
    { value: '1.0', label: '1.0' },
    { value: '1.01', label: '1.01' },
    { value: '1.02', label: '1.02' },
]
const optionsAge = [
    { value: '17', label: '17' },
    { value: '18', label: '18' },
    { value: '19', label: '19' },
]
const socialOption = [
    { value: 'facebook', label: 'facebook' },
    { value: 'Reddit', label: 'Reddit' },
    { value: 'Twitter', label: 'Twitter' },
]

const storageGatewayOption = getPortalList().map(portal => ({ "value": portal, "label": portal }));

const reactSelectStyles = {
    control: styles => ({
        ...styles,
        backgroundColor: 'white',
        height: 55,
        boxShadow: 0,
        borderColor: '#D9E1EC',
        color: '#000',
        borderRadius: 8,
        '@media only screen and (max-width: 1440px)': {
            height: 50,
            // width: '100%',
            fontSize: 16,
        },
        '@media only screen and (max-width: 575px)': {
            height: 43,
            // width: '100%',
            fontSize: 14,
        },
        '&:hover': {
            borderColor: '#1DBF73'
        }
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
        ...styles, backgroundColor: isSelected ? '#1DBF73' : '#fff',
        '&:foucs': {
            backgroundColor: '#1DBF73'
        }
    }),
};

const formikObj = {
    appName: ['', Yup.string().required('This field is required')],
    storageGateway: ['', Yup.string().required('This field is required')],
    hns: ['', Yup.string().required('This field is required')],
    skylink: ['', Yup.string().required('This field is required')],
    defaultPath: ['index.html', Yup.string().required('This field is required')],
    portalMinVersion: ['', Yup.string().required('This field is required')],
    sourceCode: ['', Yup.string().required('This field is required')],
    imgSkylink: [''],
    imgThumbnailSkylink: ['']
};
export default function AddNewSite({ toggle }) {
    const [selectedOption, setSelectedOption] = useState(null);
    const classes = useStyles();
    let history = useHistory();
    const dispatch = useDispatch();
    const uploadEleRef = createRef();
    const imgUploadEleRef = createRef();
    const dropZoneRef = createRef();
    const snUploadListStore = useSelector((state) => state.snUploadListStore);

    const [isFileUpload, setIsFileUpload] = useState(false);
    const [isLogoUploaded, setIsLogoUploaded] = useState(false);

    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoModalTitle, setInfoModalTitle] = useState("");
    const [infoModalContent, setInfoModalContent] = useState("");
    const [infoModalShowCopyToClipboard, setInfoModalShowCopyToClipboard] = useState(false);
    const [infoModalClipboardTooltip, setInfoModalClipboardTooltip] = useState("");

    useEffect(() => {
        return () => {
            snUploadListStore[UPLOAD_SOURCE_NEW_HOSTING].length = 0;
            snUploadListStore[UPLOAD_SOURCE_NEW_HOSTING_IMG].length = 0;
            dispatch(setUploadList(snUploadListStore));
        };
    }, []);

    const cancelUpload = (e, formik) => {
        e.preventDefault();
        e.stopPropagation();
        snUploadListStore[UPLOAD_SOURCE_NEW_HOSTING].length = 0;
        dispatch(setUploadList(snUploadListStore));
        formik.setFieldValue("skylink", '', false)
        formik.setFieldValue("sourceCode", '', false)
    }

    const submitForm = async (values) => {
        dispatch(setLoaderDisplay(true));
        await setMyHostedApp(values);
        dispatch(setLoaderDisplay(false));
        const hnsSkyDBURL = await getHNSSkyDBURL(null,values.hns,values.skylink);
        setInfoModalParams({
            title: `HNS SkyDB URL`,
            content: hnsSkyDBURL,
            showClipboardCopy: true,
        });
    };

    const setInfoModalParams = ({ title, content, showClipboardCopy = false, clipboardCopyTooltip, open = true }) => {
        setInfoModalContent(content);
        setInfoModalTitle(title);
        setInfoModalShowCopyToClipboard(showClipboardCopy);
        setInfoModalClipboardTooltip(clipboardCopyTooltip);
        setShowInfoModal(open);
    };

    const onInfoModalClose = () => {
        setInfoModalParams({ open: false });
        history.push("/hosting");
    };

    const onCancel = async (evt, formik) => {
        evt.preventDefault();
        evt.stopPropagation();
        formik.resetForm();
        snUploadListStore[UPLOAD_SOURCE_NEW_HOSTING].length = 0;
        snUploadListStore[UPLOAD_SOURCE_NEW_HOSTING_IMG].length = 0;
        dispatch(setUploadList(snUploadListStore));
    };

    const handleDropZoneClick = (evt, dropZoneRef) => {
        evt.preventDefault();
        evt.stopPropagation();
        dropZoneRef.current.gridRef.current.click();
    };

    const handleImgUpload = (obj, formik) => {
        formik.setFieldValue("imgSkylink", obj.skylink, true);
        formik.setFieldValue("imgThumbnailSkylink", obj.thumbnail, true);
        setIsLogoUploaded(false);
    };

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
    };

    const setValueOfForm = (obj, formik) => {
        formik.setFieldValue("skylink", obj.skylink, true)
        formik.setFieldValue("sourceCode", getPortalUrl() + `${obj.skylink}`, true)
    }

    { toggle ? document.body.className = "darkBodyColor" : document.body.className = "lightBodyColor" }

    return (
        <>
            <Box >
                <Formik
                    initialValues={getInitValAndValidationSchemaFromSnFormikObj(formikObj).initialValues}
                    validationSchema={Yup.object(getInitValAndValidationSchemaFromSnFormikObj(formikObj).validationSchema)}
                    validateOnChange={true}
                    validateOnBlur={true}
                    onSubmit={submitForm}>
                    {formik => (<form onSubmit={formik.handleSubmit}>
                        <Box display="flex" alignItems="center" justifyContent='space-between' marginTop='7px'>
                            <h1 className={toggle ? classes.darkh1 : classes.lighth1}>New App Deployment</h1>
                            <Box className={classes.btnBox}>
                                <Button className={classes.cancelBtn} onClick={(e) => onCancel(e, formik)}><b>Reset Form</b></Button>
                                <Button className={classes.submitBtn} onClick={formik.handleSubmit}><Add /><b>Deploy App</b></Button>
                            </Box>
                        </Box>
                        <p className={classes.text}>( Note: Hosted App will NOT be Published to AppStore by default. If you wish to publish, you can do so after deployment from "App Hosting" or "Publish App" link)</p>
                        <Box component="form" autocomplete="off">
                            <Box>
                                {/* <label className={classes.label}>Site Logo</label> */}
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
                                <div className={toggle ? classes.darkSiteLogo : classes.lightSiteLogo} onClick={(evt) => handleDropZoneClick(evt, imgUploadEleRef)} >
                                    {!isLogoUploaded && formik.values.imgThumbnailSkylink.trim() === "" && <Box style={{ flexDirection: "column", justifyItems: 'center' }}>
                                        <Box style={{ position: "relative", textAlign: 'center' }}>
                                            <ImgIcon />
                                        </Box>
                                        <Box style={{ position: "relative", color: "grey", textAlign: 'center' }}>click to upload App Logo</Box>
                                    </Box>}
                                    {!isLogoUploaded && formik.values.imgThumbnailSkylink.trim() !== "" && <img
                                        alt="app"
                                        src={skylinkToUrl(formik.values.imgThumbnailSkylink)}
                                        style={{
                                            width: "250px",
                                            height: "150px",
                                            // border: props.arrSelectedAps.indexOf(app) > -1 ? "2px solid #1ed660" : null,
                                        }}
                                        onClick={(evt) => handleDropZoneClick(evt, imgUploadEleRef)}
                                        name="1"
                                    />}
                                    {isLogoUploaded ? <Loader type="Oval" color="#57C074" height={50} width={50} /> : null}
                                </div>
                                {/* <div className={classes.inputGuide}>
                                   Note: Image Upload May Take sometime
                                </div> */}
                                <input type="text" hidden />
                            </Box>
                            <Box display='flex' className={`${classes.formRow} formSiteRow`}>
                                <Box className={`${classes.inputContainer}`} flex={1} style={{ maxWidth: 700 }}>
                                    <SnTextInput
                                        label={<span>App Name <Tooltip className="iconLablel" title="site logo"><HelpOutline /></Tooltip></span>}
                                        name="appName"
                                        className={toggle ? classes.darkInput : classes.lightInput}
                                        type="text" />
                                </Box>
                                <Box className={classes.inputContainer} flex={1}>
                                    <SnTextInput
                                        label={<span>Default Path <Tooltip className="iconLablel" title="site logo"><HelpOutline /></Tooltip></span>}
                                        name="defaultPath"
                                        className={toggle ? classes.darkInput : classes.lightInput}
                                        type="text" />
                                </Box>
                            </Box>
                            <Box display='flex' className={`${classes.formRow} formSiteRow`}>
                                <Box className={`${classes.inputContainer}`} flex={1}>
                                    <SnTextInput
                                        label={<span>Domain <Tooltip className="iconLablel" title="site logo"><HelpOutline /></Tooltip></span>}
                                        name="hns"
                                        className={toggle ? classes.darkInput : classes.lightInput}
                                        type="text" />
                                </Box>
                                <Box className={`${classes.inputContainer}`} flex={1} >
                                    <label>Skynet Portal <Tooltip className="iconLablel" title="site logo"><HelpOutline /></Tooltip></label>
                                    <Box>
                                        <SnSelect
                                            toggle={toggle}
                                            label="Storage Gateway"
                                            name="storageGateway"
                                            options={storageGatewayOption}
                                            darkCustomSelectStyling={classes.darkCustomSelectStyling}
                                        />
                                    </Box>
                                </Box>
                                <Box className={`${classes.inputContainer}`} flex={1} >
                                    <SnTextInput
                                        label={<span>App Version <Tooltip className="iconLablel" title="site logo"><HelpOutline /></Tooltip></span>}
                                        name="portalMinVersion"
                                        className={toggle ? classes.darkInput : classes.lightInput}
                                        type="text" />
                                </Box>
                            </Box>


                            <Box display='flex' className={`${classes.formRow} formSiteRow`}>
                                <Box className={classes.inputContainer} flex={1} position="relative">
                                    <SnTextInput
                                        label={<span>Deployed Code Skylink <Tooltip className="iconLablel" title="site logo"><HelpOutline /></Tooltip></span>}
                                        name="sourceCode"
                                        className={toggle ? classes.darkInput : classes.lightInput}
                                        type="text" />
                                </Box>
                            </Box>
                            <div className={classes.OneRowInput}>
                                <div className="d-none temp">
                                    <FormGroup>
                                        <FormControlLabel style={{ color: '#5A607F', marginBottom: 5 }}
                                            label={`Upload ${isFileUpload ? "File" : "Folder"}`}
                                            control={<IOSSwitch
                                                onChange={(evt) => setIsFileUpload(evt.target.checked)}
                                                name="toggleFileUpload" />}

                                        />
                                    </FormGroup>
                                </div>
                                <Grid container spacing={2}>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Box>
                                            <div className="d-none">
                                                <SnUpload
                                                    toggle={toggle}
                                                    name="files"
                                                    source={UPLOAD_SOURCE_NEW_HOSTING}
                                                    ref={uploadEleRef}
                                                    directoryMode={!isFileUpload}
                                                    onUpload={(obj) => setValueOfForm(obj, formik)}
                                                />

                                            </div>
                                            <div className={toggle ? classes.darkPreviewImg : classes.lightPreviewImg} style={{ flexDirection: 'column', width: '100%', minHeight: '230px' }}>
                                                {/* <div><UploadIcon /></div>

                                            <div>
                                                Drop file here or <span style={{ color: '#1DBF73' }}>click here to upload</span>
                                            </div> */}
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
                                                    filesLimit={100}
                                                    showAlerts={false}
                                                    dropzoneText={
                                                        <div id="dropzone-text" onClick={(evt) => handleDropZoneClick(evt, uploadEleRef)}>
                                                            {snUploadListStore && snUploadListStore[UPLOAD_SOURCE_NEW_HOSTING] && snUploadListStore[UPLOAD_SOURCE_NEW_HOSTING].length <= 0 &&
                                                                <>
                                                                    <div><UploadIcon /></div>
                                                                    <div style={{ color: '#5C757D' }}>
                                                                        Drag and drop files or folder here
                                                                    </div>
                                                                    <Button className={classes.uploadBtn} style={{color: '#5C757D'}}>
                                                                        Select {isFileUpload ? "Files" : "Folder"}
                                                                    </Button>
                                                                </>
                                                            }
                                                            {snUploadListStore && snUploadListStore[UPLOAD_SOURCE_NEW_HOSTING] && snUploadListStore[UPLOAD_SOURCE_NEW_HOSTING].length > 0 && snUploadListStore[UPLOAD_SOURCE_NEW_HOSTING]
                                                                .filter((fileObj, idx) => idx === 0)
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
                                                                                justifyContent: "center",
                                                                                width: "100%",
                                                                                minHeight: 150,
                                                                                flexDirection: 'column'
                                                                            }}
                                                                        >
                                                                            <div >

                                                                                <Typography className={toggle ? classes.darkLinkName : classes.lightLinkName}>
                                                                                    <span>
                                                                                        <DescriptionIcon className={classes.descIcon} />
                                                                                    </span>
                                                                                    {fileObj?.file?.path || fileObj?.file?.name}
                                                                                </Typography>
                                                                                {fileObj?.status && fileObj?.status === 'complete' && (<Typography className={toggle ? classes.darkLinkName : classes.lightLinkName}>
                                                                                    Skylink: {fileObj?.url}
                                                                                </Typography>)}
                                                                                {fileObj?.status && fileObj?.status !== 'complete' && (<Typography className={toggle ? classes.darkLinkName : classes.lightLinkName}>
                                                                                    <><Loader type="Oval" color="#57C074" height={50} width={50} /></>
                                                                                    {fileObj?.status.toUpperCase()} {fileObj?.status === 'uploading' && !isNaN(fileObj.progress) && `${(Math.trunc(fileObj.progress * 100))} %`}
                                                                                </Typography>)}
                                                                                <Button className={classes.uploadBtn} style={{ zIndex: 100, color: '#5C757D' }} onClick={(e) => cancelUpload(e, formik)}>
                                                                                    Cancel
                                                                                </Button>
                                                                            </div>
                                                                            {/* <div style={{ display: "flex", alignItems: "center" }}>
                                                                            {fileObj?.status === 'complete' && <FileCopyIcon
                                                                                className={classes.descIcon}
                                                                                style={{
                                                                                    cursor: "pointer",
                                                                                }}
                                                                                onClick={() => copyToClipboard(fileObj?.url)}
                                                                            />}
                                                                        </div> */}
                                                                        </div>
                                                                    </Grid>))}

                                                        </div>
                                                    }
                                                />
                                            </div>
                                            <input type="text" hidden />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </div>
                        </Box>


                    </form>)}
                </Formik>
            </Box>
            <SnInfoModal
                toggle={toggle}
                open={showInfoModal}
                onClose={onInfoModalClose}
                title={infoModalTitle}
                content={infoModalContent}
                showClipboardCopy={infoModalShowCopyToClipboard}
            />

        </>
    )
};