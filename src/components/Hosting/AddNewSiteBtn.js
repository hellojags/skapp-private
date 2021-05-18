import React from 'react'
import { makeStyles } from '@material-ui/core'
import styles from '../../assets/jss/hosting/AddNewSiteBtnStyle'
const useStyles = makeStyles(styles)

const AddNewSite = (props) => {
    const classes = useStyles()
    return (
        <div className={props.toggle ? classes.darkRoot : classes.lightRoot} onClick={props?.onClick}>
            <span><h1>+ Deploy New App</h1></span>
        </div>
    )
}
export default AddNewSite
