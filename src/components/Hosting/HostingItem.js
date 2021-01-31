import React from 'react'
import { Box, Button, IconButton, makeStyles } from '@material-ui/core'
import HostingImg from '../../assets/img/hostingSc.png'
import EditIcon from '@material-ui/icons/Edit'
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined'
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined'
import { ReactComponent as FolderIcon } from '../../assets/img/icons/folderIcon.svg'
import { ReactComponent as ShareIcon } from '../../assets/img/icons/shareSite.svg'
import styles from '../../assets/jss/hosting/HostingItemStyle'
import { skylinkToUrl } from '../../utils/SnUtility'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
const useStyles = makeStyles(styles)
const HostingItem = ({ ActiveSite, app }) => {
    const classes = useStyles();
    let history = useHistory();
    const appContent = app.content;
    return (
        <Box display="flex" className={classes.root} position="relative">
            <div className={classes.HostingImgContainer}>
                {(appContent.imgThumbnailSkylink==null || appContent.imgThumbnailSkylink.trim()==="") && <img src={HostingImg} alt="" />}
                {appContent.imgThumbnailSkylink!= null && appContent.imgThumbnailSkylink.trim()!=="" && 
                <img alt="app"
                    src={skylinkToUrl(appContent.imgThumbnailSkylink)}
                    style={{
                        width: "250px",
                        height: "150px",
                        // border: props.arrSelectedAps.indexOf(app) > -1 ? "2px solid #1ed660" : null,
                    }}
                    name="1"
                />}
            </div>
            <div className={classes.detailsCol}>
                <h2 className={classes.h2}>{appContent.appName}</h2>
                <Box display="flex" alignItems="center" className={classes.verisonAndLink}>
                    <p>{appContent.hns}
                        <ShareIcon />
                    </p>
                    <span>version:{app.version}</span>
                </Box>
                <Box className={classes.updateText}>
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
                    <Button className={classes.editBtn}>
                        <EditIcon />
                    </Button>
                    <Button className={classes.manageBtn} onClick={()=>history.push(`/deploysite/${app.id}`)}>
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
