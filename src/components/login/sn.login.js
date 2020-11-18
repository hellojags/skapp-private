import React from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons';
import {
    mapStateToProps,
    matchDispatcherToProps,
} from "./sn.login.container";
import { connect } from "react-redux";
import { bsGetImportedSpacesObj } from '../../blockstack/blockstack-api';

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
    constructor(props) {
        super(props);
        this.state = {
            seed: null,
        }
    }

    componentDidMount() {
        if (this.props.showDesktopMenu===false) {
            this.props.setDesktopMenuState(true);
        }
        if (this.props.person) {
            this.props.history.push("/upload");
        }
    }

    componentDidUpdate() {
        if (this.props.person) {
            this.props.history.push("/upload");
        }
    }

    handleSeedChange = (evt) => {
        this.setState({
            seed: evt.target.value
        });
    }

    login = async () => {
        const personObj = {
            username: this.state.seed,
            profile: {
                decentralizedID: this.state.seed
            }
        }
        this.props.setLoaderDisplay(true);
        const userSession = { skydbseed: this.state.seed };
        this.props.setUserSession(userSession);
        this.props.setPersonGetOtherData(personObj);
        this.props.setImportedSpace(await bsGetImportedSpacesObj(userSession));
        this.props.setLoaderDisplay(false);
        this.props.history.push("/upload"+this.props.location.search);
    }

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
                                <TextField id="seed" label="Seed" type="text" onChange={this.handleSeedChange} fullWidth required />
                            </Grid>
                        </Grid>
                        {/* <Grid container alignItems="center" justify="space-between">
                        <Grid item>
                            <FormControlLabel control={
                                <Checkbox
                                    color="primary"
                                />
                            } label="Remember me" />
                        </Grid>
                    </Grid> */}
                        <Grid container justify="center" style={{ marginTop: '10px' }}>
                            <Button variant="outlined" color="primary" style={{ textTransform: "none" }}
                                onClick={this.login}>Login</Button>
                        </Grid>
                    </div>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })
    (
        connect(mapStateToProps, matchDispatcherToProps)(snLogin)
    );