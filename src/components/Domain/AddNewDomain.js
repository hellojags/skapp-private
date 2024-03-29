import React from 'react'
import { Box, Button, makeStyles, Modal } from '@material-ui/core'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
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
        color: '#fff',
        borderBottom: '1px solid #70707085',
        padding: '1.3rem',
        '@media only screen and (max-width: 1440px)': {
            fontSize: 24,
            padding: '1rem',
        }
    },
    lightRoot: {
        width: 1180,
        maxWidth: '95%',
        boxShadow: '0px 2px 5px #15223221',
        borderRadius: 15,
        opacity: 1,
        '&, &:focus': {
            background: '#fff',
            border: 0,
            outline: 0,
        }
    },
    darkRoot: {
        width: 1180,
        maxWidth: '95%',
        boxShadow: '0px 2px 5px #15223221',
        borderRadius: 15,
        opacity: 1,
        '&, &:focus': {
            background: '#1E2029',
            border: 0,
            outline: 0,
        }
    },
    lightInputContainer: {
        '& input': {
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            paddingLeft: '1rem',
            paddingRight: '1rem',
            flex: 1,
            height: 60,
            color: '#2A2C34',
            background: '#fff',
            '@media only screen and (max-width: 575px)': {
                flex: '100%',
                marginBottom: '1rem', borderRadius: 10
            },
            // border: '1px solid #D9E1EC',
            border: '1px solid rgba(0, 0, 0, 0.4)',
            '&:focus': {
                border: '1px solid #1DBF73',
                outline: 0
            },
            '@media only screen and (max-width: 1440px)': {
                height: 50,
            },

        },
        '@media only screen and (max-width: 575px)': {
            flexWrap: 'wrap',


        }
    },
    darkInputContainer: {
        '& input': {
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            paddingLeft: '1rem',
            paddingRight: '1rem',
            flex: 1,
            height: 60,
            color: '#fff',
            background: '#2A2C34',
            '@media only screen and (max-width: 575px)': {
                flex: '100%',
                marginBottom: '1rem', borderRadius: 10
            },
            // border: '1px solid #D9E1EC',
            border: '1px solid rgba(0, 0, 0, 0.4)',
            '&:focus': {
                border: '1px solid #1DBF73',
                outline: 0
            },
            '@media only screen and (max-width: 1440px)': {
                height: 50,
            },

        },
        '@media only screen and (max-width: 575px)': {
            flexWrap: 'wrap',


        }
    },
    lightLabel: {
        fontSize: 21,
        color: '#000',
        marginBottom: 10,
        display: 'block',
        '@media only screen and (max-width: 1440px)': {
            fontSize: 19,
        },
        '@media only screen and (max-width: 575px)': {
            fontSize: 16,
        }
    },
    darkLabel: {
        fontSize: 21,
        color: '#fff',
        marginBottom: 10,
        display: 'block',
        '@media only screen and (max-width: 1440px)': {
            fontSize: 19,
        },
        '@media only screen and (max-width: 575px)': {
            fontSize: 16,
        }
    },
    submitBtn: {
        // height: '100%',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        backgroundColor: '#1DBF73!important',
        minWidth: 150,
        color: '#fff',
        fontSize: 21,
        fontWeight: 400,
        '@media only screen and (max-width: 1440px)': {
            fontSize: 18,
        },
        '@media only screen and (max-width: 575px)': {
            flex: '100%',
            borderRadius: 10,
            fontSize: 18,
            height: 50
        }
    },
    form: {
        marginTop: 70,
        marginBottom: 150,
        maxWidth: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        '@media only screen and (max-width: 1440px)': {
            marginTop: 60,
            marginBottom: 120,
        },
        '@media only screen and (max-width: 575px)': {
            marginTop: 50,
            marginBottom: 90,
        }

    }
}))

const AddNewDomain = ({ openModal, openModalHandler, toggle }) => {
    const classes = useStyles()

    // const [open, setOpen] = React.useState(true)

    // const handleOpen = () => {
    //     openModalHandler()
    // }

    const handleClose = () => {
        // setOpen(false)
        openModalHandler()
    }

    {toggle ? document.body.className = "darkBodyColor" : document.body.className = "lightBodyColor"}

    return (

        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openModal}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModal}>
                    <Box className={toggle ? classes.darkRoot : classes.lightRoot}>
                        <div className={toggle ? classes.darkModalHeader : classes.lightModalHeader}>
                            New Custom Domain
                        </div>

                        <form className={classes.form}>
                            <label className={toggle ? classes.darkLabel : classes.lightLabel} htmlFor="domainName">Enter Domain Name</label>
                            <Box display="flex" className={toggle ? classes.darkInputContainer : classes.lightInputContainer}>
                                <input required type="text" id="domainName" placeholder='e.g., mysite.com' />
                                <Button className={classes.submitBtn} onClick={handleClose}> Next</Button>
                            </Box>
                        </form>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default AddNewDomain
