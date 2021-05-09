import React from 'react'
import { Box, makeStyles } from '@material-ui/core'
import { ReactComponent as ErrorIcon } from '../../assets/img/icons/errorGrahpics.svg'
import { ReactComponent as ErrorIconDark } from '../../assets/img/icons/errorGrahpicsDark.svg'
import styles from '../../assets/jss/error-page/ErrorPageStyle'
const useStyles = makeStyles(styles)

const Error = ({toggle}) => {
    const classes = useStyles()

    {toggle ? document.body.className = "darkBodyColor" : document.body.className = "lightBodyColor"}

    return (
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" minHeight="calc(100vh - 200px)" >
            {toggle ? <ErrorIconDark className={classes.errorIcon} /> : <ErrorIcon className={classes.errorIcon} /> }
            <h1 className={toggle ? classes.darkh1 : classes.lighth1}>505</h1>
            <p className={classes.text}>Don't worry, we will fix it soon.</p>
            <small className={classes.small}>Go back to <a href="#home ">home </a>or contact us <a href="#about">about</a> a problem.</small>
        </Box >
    )
}

export default Error
