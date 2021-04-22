import React, { Fragment } from 'react'
import { Box, Button, makeStyles } from '@material-ui/core'
import { Link } from 'react-router-dom'

import styles from '../../assets/jss/no-apps/NoAppsStyle'
import { ReactComponent as RoundedBoxs } from '../../assets/img/icons/roundedBoxs.svg'
const useStyles = makeStyles(styles)
const NoApps = ({ btnText, pageType, msg, link }) => {
    const classes = useStyles()
    return (
        <Fragment>
            <h1 className={classes.h1}>My Apps</h1>
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="calc(100vh - 200px)" flexDirection="column" paddingTop="1rem" paddingBottom="1rem">
                <div className={classes.boxIcon}>
                    <RoundedBoxs />
                </div>
                <h2 className={classes.h2}>No apps {pageType}</h2>
                <p className={classes.p}>{msg}</p>
                <Button className={classes.button}>
                    {btnText}
                    <Link className="link" to={link}></Link>
                </Button>
            </Box>
        </Fragment>
    )
}
export default NoApps
