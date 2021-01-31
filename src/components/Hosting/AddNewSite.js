import React, { createRef, useEffect, useState } from 'react';
import { Box, Button, makeStyles, Grid, FormGroup, FormControlLabel, Typography } from '@material-ui/core';

import Select from 'react-select';
import { Field, Formik, useFormik } from 'formik';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DescriptionIcon from "@material-ui/icons/Description";
import * as Yup from 'yup';
import { Add } from '@material-ui/icons';
import Switch, { IOSSwitch } from './Switch';
import styles from './AddNewSiteStyles';
// img icon
import { ReactComponent as ImgIcon } from '../../assets/img/icons/image.svg';
import { ReactComponent as LinkIcon } from '../../assets/img/icons/attachment-link.9.svg';
import { ReactComponent as UploadIcon } from '../../assets/img/icons/cloud-upload-outline.svg';
import { SnTextInput, SnSelect } from '../Utils/SnFormikControlls';
import { skylinkToUrl } from "../../utils/SnUtility";
import { getInitValAndValidationSchemaFromSnFormikObj } from '../../service/SnFormikUtilService';
import { setMyHostedApp } from '../../service/SnSkappService';
import { useHistory } from 'react-router-dom';
import SnUpload from '../../uploadUtil/SnUpload';
import { UPLOAD_SOURCE_DEPLOY, UPLOAD_SOURCE_NEW_HOSTING, UPLOAD_SOURCE_NEW_HOSTING_IMG } from '../../utils/SnConstants';
import { DropzoneArea } from 'material-ui-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { setUploadList } from '../../redux/action-reducers-epic/SnUploadListAction';

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

const storageGatewayOption = [
    { value: 'Gateway1', label: 'Gateway1' },
    { value: 'Gateway2', label: 'Gateway2' },
    { value: 'Gateway3', label: 'Gateway3' },
];

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
    appName: ['', Yup.string().required('Required')],
    storageGateway: ['', Yup.string().required('Required')],
    hns: ['', Yup.string().required('Required')],
    skylink: ['', Yup.string().required('Required')],
    defaultPath: ['', Yup.string().required('Required')],
    portalMinVersion: ['', Yup.string().required('Required')],
    sourceCode: ['', Yup.string().required('Required')],
    skylink: ['', Yup.string().required('Required')],
    imgSkylink: [''],
    imgThumbnailSkylink: ['']
};

export default function AddNewSite() {
    const [selectedOption, setSelectedOption] = useState(null);
    const classes = useStyles();
    let history = useHistory();
    const dispatch = useDispatch();
    const uploadEleRef = createRef();
    const imgUploadEleRef = createRef();
    const dropZoneRef = createRef();

    const [isFileUpload, setIsFileUpload] = useState(false);
    const snUploadListStore = useSelector((state) => state.snUploadListStore);

    useEffect(() => {
        return () => {
            snUploadListStore[UPLOAD_SOURCE_NEW_HOSTING].length = 0;
            snUploadListStore[UPLOAD_SOURCE_NEW_HOSTING_IMG].length = 0;
            dispatch(setUploadList(snUploadListStore));
        };
    }, []);

    const submitForm = async (values) => {
        await setMyHostedApp(values);
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
    };

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
    };

    return (
        <Box >
            <Formik
                initialValues={getInitValAndValidationSchemaFromSnFormikObj(formikObj).initialValues}
                validationSchema={Yup.object(getInitValAndValidationSchemaFromSnFormikObj(formikObj).validationSchema)}
                onSubmit={submitForm}>
                {formik => (<form onSubmit={formik.handleSubmit}>
                    <Box display="flex" alignItems="center" justifyContent='space-between' marginTop='7px'>
                        <h1 className={classes.h1}>Submit New Site</h1>
                        <Box className={classes.btnBox}>
                            <Button className={classes.cancelBtn} onClick={onCancel}>Cancel </Button>
                            <Button className={classes.submitBtn} onClick={formik.handleSubmit}><Add /> Submit </Button>
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
                                />
                            </div>
                            <div className={classes.siteLogo} onClick={(evt) => handleDropZoneClick(evt, imgUploadEleRef)} >
                                {formik.values.imgThumbnailSkylink.trim()==="" && <ImgIcon />}
                                {formik.values.imgThumbnailSkylink.trim()!=="" && <img
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
                            </div>
                            <div className={classes.inputGuide}>
                                Max. size of 5 MB in: JPG or PNG. 300x500 or larger recommended
                </div>
                            <input type="text" hidden />
                        </Box>
                        <Box display='flex' className={`${classes.formRow} formSiteRow`}>
                            <Box className={`${classes.inputContainer}`} flex={1} style={{ maxWidth: 700 }}>
                                <SnTextInput
                                    label="App Name"
                                    name="appName"
                                    className={classes.input}
                                    type="text" />
                            </Box>

                        </Box>

                        <Box display='flex' className={`${classes.formRow} formSiteRow`} style={{ maxWidth: 1100 }}>
                            <Box className={`${classes.inputContainer}`} flex={1} >
                                <label>Storage Gateway</label>
                                <Box>
                                    <SnSelect
                                        label="Storage Gateway"
                                        name="storageGateway"
                                        options={storageGatewayOption}
                                    />
                                </Box>
                            </Box>
                            <Box className={classes.inputContainer} flex={1} position="relative">
                                <SnTextInput
                                    label="Source Code"
                                    name="sourceCode"
                                    className={classes.input}
                                    type="text" />
                            </Box>
                            <Box className={classes.inputContainer} flex={1}>
                                <SnTextInput
                                    label="Default Path"
                                    name="defaultPath"
                                    className={classes.input}
                                    type="text" />
                            </Box>

                        </Box>
                        <div className={classes.OneRowInput}>
                            <div >
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
                                <Grid item md={6} sm={12} xs={12}>
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

                        <Grid container spacing={2} style={{ maxWidth: 1000 }}>
                            <Grid item md={8} sm={12} xs={12}>
                                <Box className={`${classes.inputContainer}`} flex={1} style={{ maxWidth: 700 }}>
                                    <SnTextInput
                                        label="HNS Domain"
                                        name="hns"
                                        className={classes.input}
                                        type="text" />
                                </Box>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <Box className={`${classes.inputContainer}`}>
                                    <label>Portal Min Version</label>
                                    <SnSelect
                                        label="Portal Min Version"
                                        name="portalMinVersion"
                                        options={versionOptions}
                                    />
                                </Box>
                            </Grid>

                        </Grid>


                    </Box>


                </form>)}
            </Formik>
        </Box >
    )
};