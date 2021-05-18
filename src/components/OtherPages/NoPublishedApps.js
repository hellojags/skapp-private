import React, { Fragment } from 'react'
import { Box, Button, makeStyles } from '@material-ui/core'
import { Link } from 'react-router-dom'
import styles from '../../assets/jss/no-apps/NoAppsStyle'
import { ReactComponent as RoundedBoxs } from '../../assets/img/icons/roundedBoxs.svg'
import { userProfileDacTest } from '../../service/dac/userprofile-api'
import { useSelector } from "react-redux"
const useStyles = makeStyles(styles)
const NoApps = ({ pageTitle, heading, pharase, showTitle }) => {
// const NoApps = ({ btnText, pageType, msg, link }) => {

    const classes = useStyles()

    const stUserSession = useSelector((state) => state.userSession)    

    return (
        <Fragment>
            { !showTitle ? <h1 className={classes.h1}> { pageTitle ? pageTitle : `My Apps`} </h1> : null }
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="calc(100vh - 200px)" flexDirection="column" paddingTop="1rem" paddingBottom="1rem">
                <div className={classes.boxIcon}>
                    <RoundedBoxs />
                </div>
                <h2 className={classes.h2}>{ heading ? heading : `No apps installed`}</h2>
                <p className={classes.p}>{pharase ? pharase : `Go to app store, Explore apps and install`}</p>
                {/* <Button className={classes.button}  onClick={() => userProfileDacTest(stUserSession)}> */}
                <Button className={classes.button} >
                    Discover Apps

      {/* <h2 className={classes.h2}>No apps {pageType}</h2>
                <p className={classes.p}>{msg}</p>
                <Button className={classes.button}>
                    {btnText}
                    <Link className="link" to={link}></Link> */}

                </Button>
            </Box>
        </Fragment>
    )
}
export default NoApps
