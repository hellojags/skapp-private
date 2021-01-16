import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import AppCard from './AppCard'
import styles from "../../assets/jss/apps/AppListStyle"
const useStyles = makeStyles(styles)
const AppsList = () => {
    const classes = useStyles()
    return (
        <div className={`${classes.listContain} list-grid-container`}>
            <Grid container spacing={1}>
                <Grid item xs={6} sm={6} md={4} lg={3} xl={3}>
                    <AppCard selectable={true} />
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={3} xl={3}>
                    <AppCard selectable={true} />
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={3} xl={3}>
                    <AppCard />
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={3} xl={3}>
                    <AppCard />
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={3} xl={3}>
                    <AppCard selectable={true} />
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={3} xl={3}>
                    <AppCard />
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={3} xl={3}>
                    <AppCard />
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={3} xl={3}>
                    <AppCard />
                </Grid>
            </Grid>
        </div>
    )
}

export default AppsList
