import React, { useState } from 'react';
import { Box, Button, makeStyles, Grid } from '@material-ui/core';
import { Field, Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { Add } from '@material-ui/icons';
import styles from './AddNewSiteStyles';
// img icon
import { ReactComponent as ImgIcon } from '../../assets/img/icons/image.svg';
import { SnTextInput } from '../Utils/SnFormikControlls';
import { getInitValAndValidationSchemaFromSnFormikObj } from '../../service/SnFormikUtilService';

const useStyles = makeStyles(styles)
const optionsVersion = [
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
    storageGateway: ['', Yup.string().required('Required')],
    hns: ['', Yup.string().required('Required')],
    skylink: ['', Yup.string().required('Required')],
    defaultPath: ['', Yup.string().required('Required')],
    portalMinVersion: ['', Yup.string().required('Required')],
    sourceCode: ['', Yup.string().required('Required')],
};

export default function AddNewSite() {
    const [selectedOption, setSelectedOption] = useState(null);
    const classes = useStyles();

    return (
        <Box >
            <Formik
                initialValues={getInitValAndValidationSchemaFromSnFormikObj(formikObj).initialValues}
                validationSchema={Yup.object(getInitValAndValidationSchemaFromSnFormikObj(formikObj).validationSchema)}
                onSubmit={values => {
                    console.log(JSON.stringify(values, null, 2));
                }}>
                {formik => (<form onSubmit={formik.handleSubmit}>
                    <Box display="flex" alignItems="center" justifyContent='space-between' marginTop='7px'>
                        <h1 className={classes.h1}>Add New Site</h1>
                        <Box className={classes.btnBox}>
                            <Button className={classes.cancelBtn}>Cancel </Button>
                            <Button className={classes.submitBtn}><Add /> Submit </Button>
                        </Box>
                    </Box>

                    <Box component="form">
                        <Box display='flex' className={`${classes.formRow} ${classes.formRow1}`}>
                            <Box className={`${classes.inputContainer} ${classes.max33}`} flex={1} >
                                <SnTextInput
                                    label="Storage Gateway"
                                    name="storageGateway"
                                    className={classes.input}
                                    type="text" />
                            </Box>
                            <Box className={classes.inputContainer} flex={1}>
                                <SnTextInput
                                    label="HNA"
                                    name="hns"
                                    className={classes.input}
                                    type="text" />
                            </Box>
                        </Box>
                        <Box display='flex' className={`${classes.formRow} ${classes.formRow2}`}>
                            <Box className={classes.inputContainer} flex={1}>
                                <SnTextInput
                                    label="Skylink"
                                    name="skylink"
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
                            <Box className={classes.inputContainer} flex={1}>
                                <SnTextInput
                                    label="Minimum Portal Version"
                                    name="portalMinVersion"
                                    className={classes.input}
                                    type="text" />
                            </Box>
                        </Box>
                        <Box display='flex' className={`${classes.formRow} ${classes.formRow4}`}>
                            <Box className={classes.inputContainer} flex={1}>
                                <SnTextInput
                                    label="Github"
                                    name="sourceCode"
                                    className={classes.input}
                                    type="text" />
                            </Box>
                        </Box>
                        <div className={classes.OneRowInput}>
                            <Box position="relative">
                                <Grid container spacing={2}>
                                    <Grid item md={6} lg={4} style={{ alignSelf: 'center' }}>
                                        <Button className={classes.button} onClick={formik.handleSubmit}>Submit</Button>
                                    </Grid>

                                </Grid>
                            </Box>
                        </div>
                    </Box>
                </form>)}
            </Formik>
        </Box >
    )
};