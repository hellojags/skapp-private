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
import { Button, Chip, makeStyles, Popover, Tooltip, Typography } from "@material-ui/core";
import { bsSaveSharedWithObj, bsSetSharedSkylinkIdxV2, bsShareSkyspaceV2, getSharedMasterJSONFromSkyDB, getSkySpace } from "../../blockstack/blockstack-api";
import Slide from "@material-ui/core/Slide";
import { useDispatch, useSelector } from "react-redux";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";
import cliTruncate from "cli-truncate";
import { SKYSPACE_PATH, SHARED_PATH_PREFIX } from "../../blockstack/constants"
import { putFileForShared } from "../../blockstack/utils"
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


    // this method must move to blockstack api
    // Handling of deleted Recipients
    const handleDeletedRecipients = async () => {
        const skylinkListById = {}; //{PublicKey1 : [list of skylinks]}, {PublicKey2 : [list of skylinks]}...

        // Do this for each deleted publicKey of Recipient 
        for (const id of deletedIdList) {
            // get currentSpace name
            const idxCurrentSpace = props.sharedWithObj[id].spaces.indexOf(props.skyspaceName);
            //props.sharedWithObj[id].spaces.splice(idxCurrentSpace, 1);
            if (props.sharedWithObj[id].spaces.length === 0) {
                // delete props.sharedWithObj[id];
            } else {
                skylinkListById[id] = [];
                for (const skyspaceName of props.sharedWithObj[id].spaces) {
                    let skyspaceObj = await getSkySpace(stUserSession, skyspaceName);
                    skylinkListById[id] = [...skylinkListById[id], ...skyspaceObj.skhubIdList];
                }
            }
            if (skylinkListById[id]) {
                // prepare latest Skylink list
                const skylinkList = [...new Set([...skylinkListById[id]])];
                props.sharedWithObj[id].skylinks = props.sharedWithObj[id].skylinks.filter(skhubId => skylinkList.indexOf(skhubId) > -1);
                let masterSharedFileJSON = await getSharedMasterJSONFromSkyDB(id);
                // Step1: updating List of Shared Skylinks
                let keyValueObj = await bsSetSharedSkylinkIdxV2(stUserSession, id, props.sharedWithObj[id].skylinks, props.sharedWithObj);
                //Update skylinkIdxObj with updated values in MasterSharedDB-JSON
                masterSharedFileJSON[keyValueObj[0]] = keyValueObj[1];
                // Step2: // unshare Space for this recipient "id /PulickKey"
                const SHARED_SKYSPACE_FILEPATH = SKYSPACE_PATH + props.skyspaceName + '.json';
                // remove shared space from MasterSharedDB-JSON
                delete masterSharedFileJSON[SHARED_SKYSPACE_FILEPATH];
                // update masterSharedFileJSON in SkyDB
                await putFileForShared(stUserSession, SHARED_PATH_PREFIX + id, masterSharedFileJSON);
                // BELOW TAKES CARE OF NEW SPACE SHARING 
                props.sharedWithObj[id].spaces.splice(idxCurrentSpace, 1);
                await bsSaveSharedWithObj(props.userSession, props.sharedWithObj);

                // arguments ( Session, list of spaces shared with recipient, Recipient's publicKey, loggedInUser's "SharedWith" JSON Object)
                await bsShareSkyspaceV2(props.userSession, props.sharedWithObj[id]["spaces"], props.sharedWithObj[id].userid, props.sharedWithObj);
            }
            
           
        }
    }

    // This method gets called on click of "OK/Share"
    const shareWithRecipient = async () => {
        try {
            dispatch(setLoaderDisplay(true));
            if (deletedIdList.length > 0) {
                await handleDeletedRecipients();
            }

            if (recipientId && recipientId.trim() !== "") {
                await bsShareSkyspaceV2(props.userSession, [props.skyspaceName], recipientId, props.sharedWithObj);
            }

            dispatch(setLoaderDisplay(false));
            props.onNo();
        } catch (err) {
            dispatch(setLoaderDisplay(false));
            setDeletedIdList([]);
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
                        (Hint: User can access PublicKey by clicking on profile icon on left top corner)
                    </DialogContentText>
                    <Grid container spacing={1} direction="row">
                        <Grid item xs={12}>
                            <>
                                {props.sharedWithObj && Object.keys(props.sharedWithObj)
                                    .filter(key => deletedIdList.indexOf(key) === -1)
                                    .filter(id => props.sharedWithObj[id].spaces.indexOf(props.skyspaceName) > -1)
                                    .map((key, idx) =>
                                        <Tooltip title={props.sharedWithObj[key].userid} arrow>
                                            <Chip key={idx} label={cliTruncate(props.sharedWithObj[key].userid, 30)}
                                                onDelete={() => handleDelete(key)}
                                                color="primary" variant="outlined" />
                                        </Tooltip>
                                    )}

                                <TextField
                                    id="recipientId"
                                    name="recipientId"
                                    label="Recipient's PublicKey"
                                    fullWidth
                                    value={recipientId}
                                    autoComplete="off"
                                    helperText="Please enter recipient's publicKey"
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
        </>
    );
}
