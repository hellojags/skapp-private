import React, { Fragment }  from 'react'
import { Box, makeStyles } from '@material-ui/core'
import { ReactComponent as UnderDevelopmentIcon} from '../../assets/img/icons/website-maintenance.svg'
import styles from '../../assets/jss/error-page/ErrorPageStyle'
const useStyles = makeStyles(styles)

const UnderDevelopment = ({toggle}) => {
    const classes = useStyles()

    {toggle ? document.body.className = "darkBodyColor" : document.body.className = "lightBodyColor"}

    return (
        <Fragment>
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="calc(100vh - 200px)" maxHeight="500px" flexDirection="column" paddingTop="1rem" paddingBottom="1rem">
            <UnderDevelopmentIcon className={classes.errorIcon} />
            <h2 className={toggle ? classes.darkh2 : classes.lighth2}> Coming Soon...</h2>
            <p className={classes.text}>This functionality is under active development</p>
            <small className={classes.small}>Reach out to us on Skynet Discord (userId: Crypto_Rocket) <a href="#home ">Discord </a>or check GitHub repo for latest progress <a href="#about">GitHub</a> on this.</small>
        </Box >
         </Fragment>
    )
}
export default UnderDevelopment
