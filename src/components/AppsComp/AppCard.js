import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AppImg from "../../assets/img/placeholderImg.png";
import { Box, IconButton } from "@material-ui/core";
import { ReactComponent as HeartIcon } from "../../assets/img/icons/Heart.svg";
import { ReactComponent as ShareIcon } from "../../assets/img/icons/share.1.svg";
import { ReactComponent as MsgIcon } from "../../assets/img/icons/Messages, Chat.15.svg";
import { ReactComponent as StarIcon } from "../../assets/img/icons/star-favorite.svg";
// import { ReactComponent as OutLineStarIcon } from "../../assets/img/icons/starOutlinedIcon.svg";
import FiberManualRecordRoundedIcon from "@material-ui/icons/FiberManualRecordRounded";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ShareApp from "../ShareApp/ShareApp";
import { getAppStatsAction,setAppStatsAction } from "../../redux/action-reducers-epic/SnAppStatsAction";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {LIKES, FAVORITE, VIEW_COUNT, ACCESS_COUNT} from "../../utils/SnConstants";

// const MobileBreakPoint = '575px'
//import styles
import styles from "../../assets/jss/apps/AppCardStyle";
const useStyles = makeStyles(styles);

const AppCard = ({ selectable, updated, item }) => {
  const dispatch = useDispatch();
  const history = useHistory()
  const [modalOpen, setModalOpen] = useState(false);
  const HandleShareModel = () => {
    modalOpen ? setModalOpen(false) : setModalOpen(true);
  };
  const classes = useStyles();
  const [isCardSelected, setIsCardSelected] = useState(false);

  const pushRoute = (getID) => {
    let win = window.open(`/appdetail/${getID}`, "_blank");
    win.focus();
  };

  const checkBoxClickHanlder = async (getID) => {
    isCardSelected ? setIsCardSelected(false) : setIsCardSelected(true);
  };

  const ViewAppDetail = async (appId) => {
    dispatch(setAppStatsAction(VIEW_COUNT,null, appId));
    history.push(`/appdetail/${appId}`);
  };

  const OpenAppUrl = (url) => {
   window.open(url, "_blank");
    // win.focus();
  };

  const AccessApp = async (appId, appurl) => {
    dispatch(setAppStatsAction(ACCESS_COUNT,null, appId));
    OpenAppUrl(appurl);
  };

  return (
    <Box className="card-container" position="relative">
      {/* {selectable && (
        <Box
          role="button"
          onClick={checkBoxClickHanlder}
          className={classes.checkBox}
          style={{ opacity: isCardSelected ? 1 : 0.62 }}
        >
          <FiberManualRecordRoundedIcon />
          {isCardSelected && (
            <CheckRoundedIcon className={classes.checkedIcon} />
          )}
        </Box>
      )} */}
      <ShareApp shareModelOpen={modalOpen} shareModelFn={HandleShareModel} />
      <Card className={classes.root}>
        <CardActionArea className={classes.cardActionArea} component="div">
          <CardMedia
            onClick={() => ViewAppDetail(item.id)}
            className={classes.media}
            image={
              item.content.skappLogo.thumbnail &&
              `https://siasky.net/${
                item.content.skappLogo.thumbnail.split("sia:")[1]
              }`
            }
            title="Contemplative Reptile"
          />
          <CardContent className={classes.cardContent}>
            <Box
              className="card-head"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                onClick={() => AccessApp(item.id, item.content.appUrl)}
                className={classes.cardH2}
                gutterBottom
                variant="h5"
                component="h2"
              >
                {item.content.appname}
              </Typography>
              <Box className={classes.shareAndSaveBtn}>
                <IconButton
                  aria-label="Favourite Button"
                  size="small"
                  className={classes.heartBtn}
                >
                  <HeartIcon />
                </IconButton>
                <IconButton
                  onClick={HandleShareModel}
                  aria-label="Share Button"
                  size="small"
                  className={classes.shareBtn}
                >
                  <ShareIcon />
                </IconButton>
              </Box>
            </Box>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className={classes.cardSmallText}
              noWrap
            >
              {item.content.appDescription}
            </Typography>
          </CardContent>
        </CardActionArea>
        
        <CardActions className={`${classes.detailsArea} cardFooter`}>
          <Box
            display="flex"
            width="100%"
            paddingLeft=".45rem"
            paddingTop="6px"
            alignSelf="flex-end"
            paddingRight=".45rem"
          >
            <Box
              display="flex"
              alignItems="center"
              className={classes.footerItem}
            >
              <VisibilityOutlinedIcon className={classes.cardFooterIcon} />
              <Typography variant="caption">2.5k</Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              className={classes.footerItem}
            >
              <MsgIcon className={classes.cardFooterIcon} />
              <Typography variant="caption">1.3k</Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              className={`${classes.footerItem} ${classes.ratingDiv}`}
            >
              <StarIcon className={classes.cardFooterIcon} />
              <Typography variant="caption">5.0 (1k+)</Typography>
            </Box>
            <Box marginLeft="auto">
              <Button
                size="small"
                color="default"
                className={classes.versionBtn}
              >
                Version {item.version}
              </Button>
            </Box>
          </Box>
        </CardActions>
        <CardActions className={classes.footerBottom}>
          <Box>
            <Button
              size="medium"
              className={`${classes.installBtn} ${
                updated ? classes.bgUnistall : classes.bgUpdate
              }`}
            >
              {updated && "Uninstall"}
              {updated === false && "Update"}
              {updated === undefined && "Install"}
            </Button>
          </Box>
          <Box className={`${classes.tags} tags-card`} display="flex">
            <Typography variant="caption" component="span">
              Add
            </Typography>
            <Typography variant="caption" component="span">
              |
            </Typography>
            <Typography variant="caption" component="span">
              Programms
            </Typography>
            <Typography variant="caption" component="span">
              |
            </Typography>
            <Typography variant="caption" component="span">
              Utilities
            </Typography>
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
};

export default AppCard;
