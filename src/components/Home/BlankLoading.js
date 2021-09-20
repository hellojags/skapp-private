import React, { Fragment } from 'react'
import { Box, makeStyles } from '@material-ui/core'
import styles from '../../assets/jss/no-apps/NoAppsStyle'
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles(styles)

const BlankLoading = ({toggle }) => {
    const classes = useStyles()
    {toggle ? document.body.className = "darkBodyColor" : document.body.className = "lightBodyColor"}
    return (
        <Fragment>
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="calc(100vh - 200px)" flexDirection="column" paddingTop="1rem" paddingBottom="1rem">
                <h2 className={toggle ? classes.lighth2 : classes.darkh2}>Loading...</h2>
            </Box>
        </Fragment>
    )
}
export default BlankLoading
