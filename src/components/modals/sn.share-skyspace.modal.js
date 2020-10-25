import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MuiAlert from "@material-ui/lab/Alert";
import BlockIcon from "@material-ui/icons/Block";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DoneIcon from "@material-ui/icons/Done";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button, Chip, makeStyles, Popover, Snackbar, Typography } from "@material-ui/core";
import { bsSaveSharedWithObj, bsSetSharedSkylinkIdx, bsShareSkyspace, getSkySpace } from "../../blockstack/blockstack-api";
import Slide from "@material-ui/core/Slide";
import { red } from "@material-ui/core/colors";
import { useDispatch, useSelector } from "react-redux";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(1)
    },
}));

export default function SnShareSkyspaceModal(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [recipientId, setRecipientId] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [deletedIdList, setDeletedIdList] = useState([]);

    const stUserSession = useSelector((state) => state.userSession);

    useEffect(() => {
        setRecipientId("");
        setDeletedIdList([]);
    }, [props.open]);

    const handleDeletedRecipients = async () => {
        const promises = [];
        const skylinkListById = {};
        deletedIdList.forEach(id => {
            const idxCurrentSpace = props.sharedWithObj[id].spaces.indexOf(props.skyspaceName);
            props.sharedWithObj[id].spaces.splice(idxCurrentSpace, 1);
            if (props.sharedWithObj[id].spaces.length === 0) {
                delete props.sharedWithObj[id];
            } else {
                skylinkListById[id] = [];
                props.sharedWithObj[id].spaces.forEach(skyspaceName => {
                    promises.push(getSkySpace(stUserSession, skyspaceName)
                        .then(skyspaceObj => {
                            skylinkListById[id] = [...skylinkListById[id], ...skyspaceObj.skhubIdList];
                        }
                        ));
                })
            }
        });
        await Promise.all(promises);
        promises.length = 0;

        deletedIdList.forEach(id => {
            if (skylinkListById[id]) {
                const skylinkList = [...new Set([...skylinkListById[id]])];
                props.sharedWithObj[id].skylinks = props.sharedWithObj[id].skylinks.filter(skhubId => skylinkList.indexOf(skhubId) > -1);
                promises.push(bsSetSharedSkylinkIdx(stUserSession, id, props.sharedWithObj[id].skylinks, props.sharedWithObj));
            }
        });
        promises.push(bsSaveSharedWithObj(props.userSession, props.sharedWithObj));
        await Promise.all(promises);
    }

    const shareWithRecipient = async () => {
        try {
            dispatch(setLoaderDisplay(true));
            if (deletedIdList.length > 0) {
                await handleDeletedRecipients();
            }

            if (recipientId && recipientId.trim() !== "") {
                await bsShareSkyspace(props.userSession, [props.skyspaceName], recipientId, props.sharedWithObj);
            }

            dispatch(setLoaderDisplay(false));
            props.onNo();
        } catch (err) {
            dispatch(setLoaderDisplay(false));
            console.log("share space error", err);
            setShowAlert(true);
        }
    }

    const handleDelete = (key) => setDeletedIdList([...deletedIdList, key]);

    return (
        <>
            <Dialog
                open={props.open}
                onClose={props.onNo}
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.content}
                    </DialogContentText>
                    <Grid container spacing={1} direction="row">
                        <Grid item xs={12}>
                            <>
                                {props.sharedWithObj && Object.keys(props.sharedWithObj)
                                    .filter(key => deletedIdList.indexOf(key) === -1)
                                    .filter(id => props.sharedWithObj[id].spaces.indexOf(props.skyspaceName) > -1)
                                    .map((key, idx) =>
                                        <Chip key={idx} label={props.sharedWithObj[key].userid}
                                            onDelete={() => handleDelete(key)}
                                            color="primary" variant="outlined" />
                                    )}
                                <TextField
                                    id="recipientId"
                                    name="recipientId"
                                    label="Recipient Id"
                                    fullWidth
                                    value={recipientId}
                                    autoComplete="off"
                                    helperText="Please enter recipient blockstack ID."
                                    onChange={evt => {
                                        setAnchorEl(evt.target);
                                        setRecipientId(evt.target.value);
                                    }}
                                />
                                <Popover
                                    id={"id"}
                                    open={showAlert}
                                    anchorEl={anchorEl}
                                    onClose={() => setShowAlert(false)}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                >
                                    <Typography className={classes.typography}>The user has not created an account with Skyspaces!</Typography>
                                </Popover>
                            </>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={props.onNo}
                        autoFocus
                        variant="contained"
                        color="secondary"
                        className="btn-bg-color"
                        startIcon={<BlockIcon />}
                    >
                        Cancel
            </Button>
                    <Button
                        onClick={evt => shareWithRecipient()}
                        autoFocus
                        disabled={(recipientId == null || recipientId.trim() === "") && deletedIdList.length === 0}
                        variant="contained"
                        color="primary"
                        className="btn-bg-color"
                        startIcon={<DoneIcon />}
                    >
                        OK
            </Button>
                </DialogActions>
            </Dialog>
            {/* <Snackbar
        open={showAlert}
        autoHideDuration={40000}
        onClose={() => setShowAlert(false)}
        style={{ zIndex: 999999}}
      >
        <Alert onClose={() => setShowAlert(false)} severity={"error"}>
          The user has not created an account with Skyspaces!
        </Alert>
      </Snackbar> */}
        </>
    );
}
