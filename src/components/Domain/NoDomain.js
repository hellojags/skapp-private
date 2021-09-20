import React, { Fragment } from 'react'
import { Box, Button, makeStyles } from '@material-ui/core'
import { Link } from 'react-router-dom'
import styles from '../../assets/jss/no-apps/NoAppsStyle'
import { ReactComponent as DomainIcon } from '../../assets/img/icons/domain.svg'
const useStyles = makeStyles(styles)

const NoDomain = ({toggle}) => {
    const classes = useStyles()

    {toggle ? document.body.className = "darkBodyColor" : document.body.className = "lightBodyColor"}

    return (
        <Fragment>
           <h1 className={toggle ? classes.lighth1 : classes.darkh1}>Domain Manager</h1>
            <p className={toggle ? classes.darkh3 : classes.lighth3}>(Under Active Development. Coming soon...)</p>
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="calc(100vh - 200px)" flexDirection="column" paddingTop="1rem" paddingBottom="1rem">
                <DomainIcon className={classes.domainIcon} />


                <h2 className={toggle ? classes.lighth2 : classes.darkh2}>No Custom Domains</h2>
                <p className={classes.p}>You don't have any custom domains. Click below button to add new domain</p>
                <Link to='domains'>
                    <Button className={classes.button}>
                        Add domain
                </Button>
                </Link>
            </Box>
        </Fragment>
    )
}
export default NoDomain
