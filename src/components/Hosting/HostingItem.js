import React from 'react'
import { Box, Button, IconButton, makeStyles } from '@material-ui/core'
import HostingImg from '../../assets/img/hostingSc.png'
import EditIcon from '@material-ui/icons/Edit'
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined'
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined'
import { ReactComponent as FolderIcon } from '../../assets/img/icons/folderIcon.svg'
import { ReactComponent as ShareIcon } from '../../assets/img/icons/shareSite.svg'
import styles from '../../assets/jss/hosting/HostingItemStyle'
import { skylinkToUrl } from "../../service/skynet-api";
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSelectedHostedApp } from '../../redux/action-reducers-epic/SnSelectedHostedAppAction'
import { Delete } from '@material-ui/icons';

const useStyles = makeStyles(styles)
const HostingItem = ({ ActiveSite, app, handleOpen, id, toggle }) => {
    const classes = useStyles();
    let history = useHistory();
    const dispatch = useDispatch();

    const appContent = app.content;

    const onManageDeployment = (evt) => {
        dispatch(setSelectedHostedApp(app.id));
        history.push(`/deploysite/${app.id}`);
    };

    const onPublish = (evt) => {
        dispatch(setSelectedHostedApp(app.id));
        history.push(`/submitapp/${app.id}`);
    };

    const onEdit = (evt) => {
        dispatch(setSelectedHostedApp(app.id));
        history.push(`/editsite/${app.id}`);
    };

    return (
        <Box display="flex" className={toggle ? classes.darkRoot : classes.lightRoot} position="relative">
            <div className={classes.HostingImgContainer}>
                {(appContent.imgThumbnailSkylink == null || appContent.imgThumbnailSkylink.trim() === "") && <img src={HostingImg} alt="" />}
                {appContent.imgThumbnailSkylink != null && appContent.imgThumbnailSkylink.trim() !== "" &&
                    <img alt="app"
                        src={skylinkToUrl(appContent.imgThumbnailSkylink)}
                        style={{
                            width: "250px",
                            height: "150px",
                            // border: props.arrSelectedAps.indexOf(app) > -1 ? "2px solid #1ed660" : null,
                            border: '2px solid #1ed660'
                        }}
                        name="1"
                    />}
            </div>
            <div className={classes.detailsCol}>
                <h2 className={toggle ? classes.darkh2 : classes.lighth2}>{appContent.appName}</h2>
                <Box display="flex" alignItems="center" className={toggle ? classes.darkVerisonAndLink : classes.lightVerisonAndLink}>
                    <p>{appContent.hns}
                        <ShareIcon />
                    </p>
                    <span>version:{app.version}</span>
                </Box>
                <Box className={toggle ? classes.darkUpdateText : classes.lightUpdateText}>
                    Last Updated: {moment(app.ts).format(
                    "h:mm:ss A, MMMM D, YYYY"
                )}
                </Box>
                <Box display='flex' className={classes.btnContainer}>
                    {
                        ActiveSite
                            ?
                            <Button className={classes.ActiveBtn}>
                                Active
                            </Button>
                            :
                            <Button className={classes.inActiveBtn}>
                                Inactive
                            </Button>
                    }
                    <Button className={toggle ? classes.darkManageBtn : classes.lightManageBtn} onClick={onPublish}>
                        <span>Publish</span>
                    </Button>
                    <Button className={toggle ? classes.darkManageBtn : classes.lightManageBtn} onClick={onEdit}>
                        <span>Edit</span>
                    </Button>
                    <Button className={toggle ? classes.darkTrashBtn : classes.lightTrashBtn} onClick={()=> handleOpen(appContent, id)}>
                        <Delete />
                    </Button>
                    <Button className={toggle ? classes.darkManageBtn : classes.lightManageBtn} onClick={onManageDeployment}>
                        <FolderIcon />
                        <span>Manage Deployment</span>
                        <ChevronRightOutlinedIcon />
                    </Button>
                </Box>
            </div>


            {/* Button More */}
            <IconButton className={classes.moreBtn}>
                <MoreVertOutlinedIcon />
            </IconButton>
        </Box>
    )
}

export default HostingItem
