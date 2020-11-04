import React from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons';
import {
    mapStateToProps,
    matchDispatcherToProps,
  } from "./sn.login.container";
import { connect } from "react-redux";

const styles = theme => ({
    margin: {
        margin: theme.spacing.unit * 2,
    },
    padding: {
        padding: theme.spacing.unit
    },
    paddingTop: {
        paddingTop: 200
    }
});

class snLogin extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.paddingTop}>
            <Paper className={classes.padding}>
                {/* App Tabs
                Blockstakc Login Button
                SkyID Login Button 
                Ceramic Login Button */}
                <div className={classes.margin}>
                    {/* <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <Face />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="username" label="Username" type="email" fullWidth autoFocus required />
                        </Grid>
                    </Grid> */}
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <Fingerprint />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="seed" label="Password" type="password" fullWidth required />
                        </Grid>
                    </Grid>
                    <Grid container alignItems="center" justify="space-between">
                        <Grid item>
                            <FormControlLabel control={
                                <Checkbox
                                    color="primary"
                                />
                            } label="Remember me" />
                        </Grid>
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                        <Button variant="outlined" color="primary" style={{ textTransform: "none" }}>Login</Button>
                    </Grid>
                </div>
            </Paper>
            </div>
        );
    }
}

export default withStyles(styles,{ withTheme: true })
(
    connect(mapStateToProps, matchDispatcherToProps)(snLogin)
);