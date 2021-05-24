import React, { createRef, Fragment, useEffect, useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, makeStyles, Modal, Typography } from '@material-ui/core'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import { SnTextInput, SnSelect } from "../Utils/SnFormikControlls";
import { FieldArray, Formik } from "formik";

import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setLoaderDisplay } from "../../redux/action-reducers-epic/SnLoaderAction";


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lightModalHeader: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333333',
        borderBottom: '1px solid #70707085',
        padding: '1.3rem',
        '@media only screen and (max-width: 1440px)': {
            fontSize: 24,
            padding: '1rem',
        }
    },
    darkModalHeader: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        borderBottom: '1px solid #70707085',
        padding: '1.3rem',
        '@media only screen and (max-width: 1440px)': {
            fontSize: 24,
            padding: '1rem',
        }
    },
    lightRoot: {
        width: 1180,
        maxWidth: '60%',
        boxShadow: '0px 2px 5px #15223221',
        borderRadius: 15,
        opacity: 1,
        '&, &:focus': {
            background: '#fff',
            border: 0,
            outline: 0,
        },
    },
    darkRoot: {
        width: 1180,
        maxWidth: '60%',
        boxShadow: '0px 2px 5px #15223221',
        borderRadius: 15,
        opacity: 1,
        '&, &:focus': {
            background: '#1E2029',
            border: 0,
            outline: 0,
        },
    },
    lightInputContainer: {
        '& input': {
            borderRadius: 10,
            paddingLeft: '1rem',
            paddingRight: '1rem',
            flex: 1,
            height: 60,
            fontSize: 21,
            color: '#2A2C34',
            background: '#fff',
            '@media only screen and (max-width: 575px)': {
                flex: '100%',
                marginBottom: 8, borderRadius: 10
            },
            // border: '1px solid #D9E1EC',
            '&:focus': {
                border: '1px solid #1DBF73',
                outline: 0
            },
            '@media only screen and (max-width: 1440px)': {
                height: 50,
                fontSize: 18,
            },

        },
        '@media only screen and (max-width: 575px)': {
            flexWrap: 'wrap',
            fontSize: 16,

        }
    },
    darkInputContainer: {
        '& input': {
            borderRadius: 10,
            paddingLeft: '1rem',
            paddingRight: '1rem',
            flex: 1,
            height: 60,
            fontSize: 21,
            color: '#fff',
            background: '#2A2C34',
            '@media only screen and (max-width: 575px)': {
                flex: '100%',
                marginBottom: 8, borderRadius: 10
            },
            border: '1px solid rgba(255, 255, 255, 0.1)',
            '&:focus': {
                border: '1px solid #1DBF73',
                outline: 0
            },
            '@media only screen and (max-width: 1440px)': {
                height: 50,
                fontSize: 18,
            },

        },
        '@media only screen and (max-width: 575px)': {
            flexWrap: 'wrap',
            fontSize: 16,

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
    submitBtn: {
        // height: '100%',
        borderRadius: 5,
        backgroundColor: '#1DBF73!important',
        minWidth: 210,
        color: '#fff',
        fontSize: 21,
        fontWeight: 300,
        '@media only screen and (max-width: 1440px)': {
            fontSize: 18,
        },
        '@media only screen and (max-width: 575px)': {
            flex: '100%',
            borderRadius: 10,
            fontSize: 18,
            height: 50,
            width: '100%'
        }
    },
    form: {

        marginLeft: 'auto',
        marginRight: 'auto',
        // '@media only screen and (max-width: 1440px)': {
        //     marginTop: 60,
        //     marginBottom: 120,
        // },
        // '@media only screen and (max-width: 575px)': {
        //     marginTop: 50,
        //     marginBottom: 90,
        // }

    },
    varifyText: {
        color: "#1DBF73",
        fontWeight: 'bold',
        marginTop: '1rem',
        '@media only screen and (max-width: 575px)': {
            marginTop: 17,
        }
    },
    contentContainer: {
        paddingRight: '7%',
        paddingLeft: '4%',
        paddingBottom: '4%',
        '@media only screen and (max-width: 575px)': {
            paddingRight: '20px',
            paddingLeft: '20px',
            paddingBottom: '35px',
        }

    },
    lightSubheading: {
        color: '#333333',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: '1rem',

        '@media only screen and (max-width: 575px)': {
            fontSize: 18,
            marginTop: 9,

        }
    },
    darkSubheading: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: '1rem',

        '@media only screen and (max-width: 575px)': {
            fontSize: 18,
            marginTop: 9,

        }
    },
    p: {
        color: '#5A607F'
    },
    checkBox: {
        marginTop: 10,
        marginBottom: 10,

        '& span': {
            color: '#5A607F',
            '@media only screen and (max-width: 575px)': {
                fontSize: 16,
            },
        },

        '@media only screen and (max-width: 575px)': {
            // flex: '100%',
            // borderRadius: 10,
            // fontSize: 18,
            // height: 50
        }
    },
    input: {
        background: "#fff",
        border: "1px solid #D9E1EC",
        borderRadius: 8,
        height: 45,
        width: "100%",
        fontSize: 19,
        padding: 20,
        "@media only screen and (max-width: 1440px)": {
          height: 45,
          // width: '100%',
          fontSize: 16,
          padding: 15,
        },
        "@media only screen and (max-width: 575px)": {
          height: 40,
          // width: '100%',
          fontSize: "14px !important",
          padding: 10,
        },
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
    marginTop: "5px",
    "&": {
        marginRight: "1rem",
    },
    "& input, & input": {
        fontSize: 16,
    },
    "@media only screen and (max-width: 575px)": {
        marginTop: "5px",
        marginRight: "10px",
    },
    },
    cancelBtn: {
        background: '#FF6060!important',
        color: '#fff',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        minWidth: 130,
        marginRight: '1rem',
        '@media only screen and (max-width: 575px)': {
            fontSize: '12px',
            marginRight: '.4rem',
            paddingLeft: '.5rem',
            paddingRight: '.5rem',
            minWidth: 70,
        }
    },
}))

const options = [
    { value: 'HNS', label: 'HNS' },
]

const AddNewDomainTXT = ({ toggle, error, editDomain, newDomain, initailValueFormikObj, validationSchema, submitProfileForm, setNewDomain }) => {
    const classes = useStyles()
    const [formikObj, setFormikObj] = useState(initailValueFormikObj); // to store Formik Form data

    return (

        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={newDomain}
                onClose={() => setNewDomain(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={newDomain}>
                    <Box className={toggle ? classes.darkRoot : classes.lightRoot}>
                        <div className={toggle ? classes.darkModalHeader : classes.lightModalHeader}>
                            { editDomain !== null ? "Edit Custom Domain" : "New Custom Domain" }
                        </div>
                        <div className={classes.contentContainer}>

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
                                        <Box component="form">
                                            <Typography className={classes.varifyText}>
                                                Verification
                                            </Typography>
                                            <Typography className={toggle ? classes.darkSubheading: classes.lightSubheading}>
                                                Add New TXT record to skapp.io
                                            </Typography>
                                            <p className={classes.p}>TXT records are simple text  notes for your domain and won't affect your email or website settings.</p>
                                            <Box display="flex" className={`${classes.formRow} formSiteRow`}>
                                                <Box className={`${classes.inputContainer}`} flex={1}>
                                                    <SnTextInput
                                                        label="DomainName"
                                                        name="domainName"
                                                        className={classes.input}
                                                        type="text"
                                                        toggle={toggle}
                                                    />
                                                </Box>
                                            </Box>
                                            <Box display="flex"  style={{ pointerEvents: "none" }} className={`${classes.formRow} formSiteRow`}>
                                                <Box className={`${classes.inputContainer}`} flex={1}>
                                                    <label>Domain Type</label>
                                                    <Box>
                                                        <SnSelect
                                                            toggle={toggle}
                                                            label="Domain Type"
                                                            name="domainType"
                                                            options={options}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box display="flex" className={`${classes.formRow} formSiteRow`}>
                                                <Box className={`${classes.inputContainer}`} flex={1}>
                                                    <SnTextInput
                                                        label="DataLink"
                                                        name="dataLink"
                                                        className={classes.input}
                                                        type="text"
                                                        toggle={toggle}
                                                    />
                                                </Box>
                                            </Box>
                                            <Box display="flex" style={{ float: 'right', marginBottom: 10, marginTop: 10 }} className={`${classes.formRow} formSiteRow`}>
                                                <Button className={classes.cancelBtn} onClick={()=>setNewDomain(false)}>Cancel</Button>                                                
                                                <Button className={classes.submitBtn} onClick={formik.handleSubmit}>Save</Button>
                                            </Box>
                                            { error ? <Box display="flex" style={{ marginBottom: 10, marginTop: 10 }} className={`${classes.formRow} formSiteRow`}>
                                                <Typography style={{ color: 'red' }}>
                                                    {error}
                                                </Typography>
                                            </Box> : null }
                                        </Box>
                                    </form>
                                )}
                            </Formik>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default AddNewDomainTXT