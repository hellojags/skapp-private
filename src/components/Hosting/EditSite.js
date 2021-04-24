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
import { skylinkToUrl } from "../../utils/SnUtility";
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
import { getMyHostedApps } from '../../service/SnSkappService';
import { useParams } from "react-router-dom";
import Loader from "react-loader-spinner";

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
        ...styles, backgroundColor: 'white', height: 55, boxShadow: 0, borderColor: '#D9E1EC', color: '#000', borderRadius: 8,
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
    defaultPath: ['', Yup.string().required('This field is required')],
    portalMinVersion: ['', Yup.string().required('This field is required')],
    sourceCode: ['', Yup.string().required('This field is required')],
    imgSkylink: [''],
    imgThumbnailSkylink: ['']
};

export default function EditSite() {
    const [selectedOption, setSelectedOption] = useState(null);
    const classes = useStyles();
    let history = useHistory();
    const dispatch = useDispatch();
    const uploadEleRef = createRef();
    const imgUploadEleRef = createRef();
    const dropZoneRef = createRef();
    const snUploadListStore = useSelector((state) => state.snUploadListStore);

    const [isFileUpload, setIsFileUpload] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoModalTitle, setInfoModalTitle] = useState("");
    const [infoModalContent, setInfoModalContent] = useState("");
    const [infoModalShowCopyToClipboard, setInfoModalShowCopyToClipboard] = useState(false);
    const [infoModalClipboardTooltip, setInfoModalClipboardTooltip] = useState("");

    const [isLogoUploaded, setIsLogoUploaded] = useState(false);
    const [hostedAppObj, setHostedAppObj] = useState();
    const { appId } = useParams();

    useEffect(() => {
        loadHostedApp();
        return () => {
            snUploadListStore[UPLOAD_SOURCE_NEW_HOSTING].length = 0;
            snUploadListStore[UPLOAD_SOURCE_NEW_HOSTING_IMG].length = 0;
            dispatch(setUploadList(snUploadListStore));
        };
    }, []);

    const loadHostedApp = async () => {
        dispatch(setLoaderDisplay(true));
        setIsLoading(true);
        const hostedAppObj = await getMyHostedApps([appId]);
        await setHostedAppObj(hostedAppObj);
        setFormicObj(hostedAppObj);
        setIsLoading(false);
        dispatch(setLoaderDisplay(false));
    };


    const setFormicObj = (hostedAppObj) => {
        formikObj.appName[0] = `${hostedAppObj.appDetailsList[appId].content.appName}`;
        formikObj.storageGateway[0] = `${hostedAppObj.appDetailsList[appId].content.storageGateway}`;
        formikObj.hns[0] = `${hostedAppObj.appDetailsList[appId].content.hns}`;
        formikObj.skylink[0] = `${hostedAppObj.appDetailsList[appId].content.skylink}`;
        formikObj.defaultPath[0] = `${hostedAppObj.appDetailsList[appId].content.defaultPath}`;
        formikObj.portalMinVersion[0] = `${hostedAppObj.appDetailsList[appId].content.portalMinVersion}`;
        formikObj.sourceCode[0] = `${hostedAppObj.appDetailsList[appId].content.sourceCode}`;
        formikObj.imgSkylink[0] = `${hostedAppObj.appDetailsList[appId].content.imgSkylink}`;
        formikObj.imgThumbnailSkylink[0] = `${hostedAppObj.appDetailsList[appId].content.imgThumbnailSkylink}`;
    }

    const submitForm = async (values) => {
        dispatch(setLoaderDisplay(true));
        await setMyHostedApp(values, appId);
        dispatch(setLoaderDisplay(false));
        const hnsSkyDBURL = getHNSSkyDBURL(values.hns);
        
        if(values.hns != `${hostedAppObj.appDetailsList[appId].content.hns}`) {
            setInfoModalParams({
                title: `HNS SkyDB URL`,
                content: hnsSkyDBURL,
                showClipboardCopy: true,
            });
        } else {
            setInfoModalParams({
                title: `Success`,
                content: `Site updated successfully!`,
                showClipboardCopy: false,
            });
        }
        
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


    const onCancel = async (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        history.push("/hosting");
    };

    const handleDropZoneClick = (evt, dropZoneRef) => {
        evt.preventDefault();
        evt.stopPropagation();
        dropZoneRef.current.gridRef.current.click();
    };

    const handleImgUpload = (obj, formik) => {
        formik.setFieldValue("imgSkylink", obj.skylink, true);
        formik.setFieldValue("imgThumbnailSkylink", obj.thumbnail, true)
        setIsLogoUploaded(false);
    };

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
    };

    return (
        <>
            <Box >
                {
                    !isLoading ?
                        <Formik
                            initialValues={getInitValAndValidationSchemaFromSnFormikObj(formikObj).initialValues}
                            validationSchema={Yup.object(getInitValAndValidationSchemaFromSnFormikObj(formikObj).validationSchema)}
                            validateOnChange={true}
                            validateOnBlur={true}
                            onSubmit={submitForm}>
                            {formik => (<form onSubmit={formik.handleSubmit}>
                                <Box display="flex" alignItems="center" justifyContent='space-between' marginTop='7px'>
                                    <h1 className={classes.h1}>Edit Site</h1>
                                    <Box className={classes.btnBox}>
                                        <Button className={classes.cancelBtn} onClick={onCancel}>Cancel </Button>
                                        <Button className={classes.submitBtn} onClick={formik.handleSubmit}><Add /> Save </Button>
                                    </Box>
                                </Box>
                                <Box component="form">
                                    <Box>
                                        <label className={classes.label}>Site Logo</label>
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
                                            {!isLogoUploaded && formik.values.imgThumbnailSkylink.trim() === "" &&<Box style={{ flexDirection: "column", justifyItems: 'center' }}> 
                                            <Box style={{ position: "relative", textAlign: 'center' }}>
                                                <ImgIcon />
                                            </Box> 
                                            <Box style={{ position: "relative", color: "grey", textAlign: 'center' }}>click to upload Image</Box> 
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
                                            {isLogoUploaded && <Loader type="Oval" color="#FFFFFF" height={15} width={15} />}
                                        </div>
                                        <div className={classes.inputGuide}>
                                            Max. size of 5 MB in: JPG or PNG. 300x500 or larger recommended
                                        </div>
                                        <input type="text" hidden />
                                    </Box>
                                    <Box display='flex' className={`${classes.formRow} formSiteRow`}>
                                        <Box className={`${classes.inputContainer}`} flex={1} style={{ maxWidth: 700 }}>
                                            <SnTextInput
                                                label={<span>App Name <Tooltip className="iconLablel" title="site logo"><HelpOutline /></Tooltip></span>}
                                                name="appName"
                                                disabled={true}
                                                className={classes.input}
                                                type="text" />
                                        </Box>
                                        <Box className={classes.inputContainer} flex={1}>
                                            <SnTextInput
                                                label={<span>Default Path <Tooltip className="iconLablel" title="site logo"><HelpOutline  /></Tooltip></span>}
                                                name="defaultPath"
                                                className={classes.input}
                                                type="text" />
                                        </Box>
                                    </Box>
                                    <Box display='flex' className={`${classes.formRow} formSiteRow`}>
                                        <Box className={`${classes.inputContainer}`} flex={1} style={{ maxWidth: 700 }}>
                                            <SnTextInput
                                                label={<span>HNS Domain <Tooltip className="iconLablel" title="site logo"><HelpOutline  /></Tooltip></span>}
                                                name="hns"
                                                className={classes.input}
                                                type="text" />
                                        </Box>
                                        <Box className={`${classes.inputContainer}`} flex={1}>
                                            <label>Skynet Portal <Tooltip className="iconLablel" title="site logo"><HelpOutline  /></Tooltip></label>
                                            <Box>
                                                <SnSelect
                                                    label="Storage Gateway"
                                                    name="storageGateway"
                                                    options={storageGatewayOption}
                                                />
                                            </Box>
                                        </Box>
                                        <Box className={`${classes.inputContainer}`} flex={1}>
                                            <label>App Version <Tooltip className="iconLablel" title="site logo"><HelpOutline  /></Tooltip></label>
                                            <SnSelect
                                                label={<span>App Version <Tooltip className="iconLablel" title="site logo"><HelpOutline  /></Tooltip></span>}
                                                name="portalMinVersion"
                                                options={versionOptions}
                                            />
                                        </Box>
                                    </Box>
                                    <Box display='flex' className={`${classes.formRow} formSiteRow`}>
                                        <Box className={classes.inputContainer} flex={1} position="relative">
                                            <SnTextInput
                                                label={<span>Source Code <Tooltip className="iconLablel" title="site logo"><HelpOutline  /></Tooltip></span>}
                                                name="sourceCode"
                                                className={classes.input}
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
                                                            name="files"
                                                            source={UPLOAD_SOURCE_NEW_HOSTING}
                                                            ref={uploadEleRef}
                                                            directoryMode={!isFileUpload}
                                                            onUpload={(obj) => formik.setFieldValue("skylink", obj.skylink, true)}
                                                        />

                                                    </div>
                                                    <div className={classes.previewImg} style={{ flexDirection: 'column', width: '100%', minHeight: '230px' }}>
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
                                                                    <div><UploadIcon /></div>

                                                                    <div style={{ color: '#5C757D' }}>
                                                                        Drag and drop files or folder here
                                                </div>
                                                                    <Button className={classes.uploadBtn}>
                                                                        Select {isFileUpload ? "Files" : "Folder"}
                                                                    </Button>
                                                                </div>
                                                            }
                                                        />
                                                    </div>

                                                    <input type="text" hidden />
                                                </Box>
                                            </Grid>
                                            <Grid item sm={12} xs={12}>
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
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Box>


                            </form>)}
                        </Formik>
                        : null
                }
            </Box >


            <SnInfoModal
                open={showInfoModal}
                onClose={onInfoModalClose}
                title={infoModalTitle}
                content={infoModalContent}
                showClipboardCopy={infoModalShowCopyToClipboard}
            />

        </>
    )
};