import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux"
import { makeStyles } from "@material-ui/core/styles"
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined"
import VisibilityIcon from '@material-ui/icons/Visibility'
import LaunchOutlinedIcon from '@material-ui/icons/LaunchOutlined'
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined'
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined'
import Card from "@material-ui/core/Card"
import CardActionArea from "@material-ui/core/CardActionArea"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import AppImg from "../../assets/img/placeholderImg.png"
import { Avatar, Box, IconButton, Tooltip } from "@material-ui/core"
import millify from "millify";
import DataUsageIcon from "@material-ui/icons/DataUsage";
import { PersonOutline } from "@material-ui/icons";
// import { ReactComponent as HeartIcon } from "../../assets/img/icons/Heart.svg"
import { ReactComponent as HeartIcon1 } from "../../assets/img/icons/Heart1.svg";
import { ReactComponent as MsgIcon } from "../../assets/img/icons/Messages, Chat.15.svg";
import { ReactComponent as ShareIcon1 } from "../../assets/img/icons/share.11.svg";
// const MobileBreakPoint = '575px'
//import styles
import styles from "../../assets/jss/apps/AppCardStyle";
import { setAppStatsAction } from "../../redux/action-reducers-epic/SnAppStatsAction";
import { getPortalUrl } from "../../service/skynet-api";
import {
  getAggregatedAppStatsByAppId,
  getAppStats,
  setAppStatsEvent,
} from "../../service/SnSkappService";
import {
  EVENT_APP_ACCESSED,
  EVENT_APP_FAVORITE,
  EVENT_APP_FAVORITE_REMOVED,
  EVENT_APP_LIKED,
  EVENT_APP_LIKED_REMOVED,
  EVENT_APP_VIEWED,
} from "../../utils/SnConstants";
import ShareApp from "../ShareApp/ShareApp";

const useStyles = makeStyles(styles);

const appBg = {
  Social: "rgb(29, 191, 115)",
  Video: "lightgray",
  Pictures: "gray",
  Music: "#8ad4c5",
  Productivity: "#cf4cac",
  Utilities: "#cf4cac",
  Games: "#cf4cac",
  Blogs: "#cf4cac",
  Software: "#cf4cac",
  DAC: "#cf4cac",
  Livestream: "#cf4cac",
  Books: "#cf4cac",
  Marketplace: "#cf4cac",
  Finance: "#cf4cac",
  SkynetPortal: "#cf4cac",
  Portal: "#cf4cac",
};
// const appBg = {
//   'Social': "#000000",
//   'Video': "#000000",
//   'Pictures': "#000000",
//   'Music': "#000000",
//   'Productivity': "#000000",
//   'Utilities': "#000000",
//   'Games': "#000000",
//   'Blogs': "#000000",
//   'Software':"#000000",
//   'DAC': "#000000",
//   'Livestream': "#000000",
//   'Books': "#000000",
//   'Marketplace': "#000000",
//   'Finance': "#000000",
//   'SkynetPortal': "#000000",
//   'Portal': "#000000",
// }

const AppCard = ({ selectable, updated, item, handleInstall, toggle }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const [modalOpen, setModalOpen] = useState(false);
  const HandleShareModel = () => {
    modalOpen ? setModalOpen(false) : setModalOpen(true);
  };
  const [isCardSelected, setIsCardSelected] = useState(false);
  const [appStats, setAppStats] = useState(false);
  const [aggregatedAppStats, setAggregatedAppStats] = useState(false);

  const stUserSession = useSelector((state) => state.userSession);
  const [Fav, setFav] = useState({});
  const [liked, setLiked] = useState({});

  useEffect(() => {
    if (item) {
      if (stUserSession) {
        fetchMyAppStats();
      }
      fetchAggregatedAppStats();
      // onload get apps stats data and load in store
      //dispatch(getAppStatsAction(data.id));
    }
  }, [item]);

  //JSON Object
  const fetchMyAppStats = async () => {
    const result = await getAppStats(item.id);
    setAppStats(result);
  };

  // View|access|likes|fav
  const fetchAggregatedAppStats = async () => {
    const result = await getAggregatedAppStatsByAppId(item.id);
    setAggregatedAppStats(result);
  };
  const appStatsAction = (eventType) => {
    // EVENT_APP_FAVORITE, EVENT_APP_FAVORITE_REMOVED
    dispatch(setAppStatsAction(eventType, item.id));
  };
  const pushRoute = (getID) => {
    let win = window.open(`/appdetail/${getID}`, "_blank");
    win.focus();
  };

  const checkBoxClickHanlder = async (getID) => {
    isCardSelected ? setIsCardSelected(false) : setIsCardSelected(true);
  };

  const ViewAppDetail = async (appId) => {
    dispatch(setAppStatsAction(EVENT_APP_VIEWED, appId));
    //await setAppStatsEvent(EVENT_APP_VIEWED, appId);
    history.push(`/appdetail/${appId}`);
  };

  const OpenAppUrl = (url) => {
    window.open(url, "_blank");
    // win.focus();
  };

  const AccessApp = async (appId, appurl) => {
    dispatch(setAppStatsAction(EVENT_APP_ACCESSED, appId));
    OpenAppUrl(appurl);
  };
  // logical Tool tip
  const descRef = React.createRef();
  const tagsRef = React.createRef();

  const [showLink, setShowLink] = useState(false);
  const [allowToolTip, setAllowToolTip] = useState(false);
  React.useLayoutEffect(() => {
    if (tagsRef.current.scrollHeight > tagsRef.current.offsetHeight) {
      setAllowToolTip(true);
    } else {
      setAllowToolTip(false);
    }
    // console.log("descRef scroll height" + tagsRef.current.scrollHeight, "offset" + tagsRef.current.offsetHeight)
  }, [tagsRef]);
  React.useLayoutEffect(() => {
    if (descRef.current.scrollHeight > descRef.current.offsetHeight + 1) {
      setShowLink(true);
    } else {
      setShowLink(false);
    }

    // console.log("descRef scroll height" + tagsRef.current.scrollHeight, "offset" + tagsRef.current.offsetHeight)
  }, [descRef]);

  // like and fav ui
  // const [likeClick, setLikeClick] = useState(false)
  const [uiSpiner, setUiSpiner] = useState(null);
  const [uiliked, setUiLiked] = useState(null);
  const onLikeClick = () => {
    setUiSpiner(true);
    setTimeout(() => {
      setUiSpiner(false);
    }, 2000);
  };
  // useEffect(() => {
  //   setUiSpiner(null)

  // }, [])
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
      <>
        <ShareApp shareModelOpen={modalOpen} shareModelFn={HandleShareModel} />
        {item &&
          <Card className={`${toggle ? classes.darkRoot : classes.lightRoot}`}>
            <CardActionArea className={classes.cardActionArea} component="div">
              <div onClick={() => ViewAppDetail(item.id)}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignContent="center"
                  className={`${classes.media} appCardHeader`}
                  style={{
                    backgroundColor: appBg[item.content.category]
                      ? appBg[item.content.category]
                      : Math.floor(Math.random() * 16777215).toString(16),
                  }}
                >
                  <span className="app-logo-img">
                    <img
                      src={
                        item.content.skappLogo.thumbnail &&
                        getPortalUrl() +
                        `${item.content.skappLogo.thumbnail.split("sia:")[1]}`
                      }
                      alt=""
                    />
                  </span>
                </Box>
                {toggle ? (
                  <div className="lightCategoryOnAppCard">
                    <span>{item.content.category}</span>
                  </div>
                ) : (
                  <div className="darkCategoryOnAppCard">
                    <span>{item.content.category}</span>
                  </div>
                )}
              </div>
              <CardContent className={classes.cardContent}>
                <Box
                  className="card-head"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    onClick={() => AccessApp(item.id, item.content.appUrl)}
                    className={
                      toggle ? classes.darkCardH2 : classes.lightCardH2
                    }
                    gutterBottom
                    variant="h5"
                    component="h2"
                  >
                    {item.content.appname}
                  </Typography>
                  <Box marginRight="auto">
                    <Button
                      size="small"
                      color="default"
                      className={classes.versionBtn}
                    >
                      Version {item.version}
                    </Button>
                  </Box>
                  <Box className={classes.shareAndSaveBtn}>
                    <IconButton
                      aria-label="Favourite Button"
                      size="small"
                      color="#fff"
                      className={classes.heartBtn}
                    >
                      <HeartIcon1 />
                    </IconButton>
                    <IconButton
                      onClick={HandleShareModel}
                      aria-label="Share Button"
                      size="small"
                      color="#fff"
                      className={classes.shareBtn}
                    >
                      <ShareIcon1 />
                    </IconButton>
                  </Box>
                </Box>
                <Typography
                  ref={descRef}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  className={`${toggle ? classes.darkCardSmallText : classes.lightCardSmallText} ${classes.desc}`}
                >
                  {item.content.appDescription}

                  {showLink && <span className={classes.moreDescBtn} onClick={() => ViewAppDetail(item.id)}> ...more</span>}
                </Typography>
                {item.content.tags && allowToolTip ? (
                  <Box
                    position="relative"
                    className={`${classes.tags} tags-card`}
                    ref={tagsRef}
                  >
                    {item.content.tags &&
                      item.content.tags.map((item, index) => {
                        return (
                          // <Typography variant="caption" component="span">
                          //   #{item}
                          // </Typography>
                          <>
                            <Typography
                              className="tagOnAppCard"
                              variant="caption"
                              component="span"
                            >
                              #{item}
                            </Typography>
                          </>
                        );
                      })}
                    {/* <Typography variant="caption" component="span">
                    Programms
                    </Typography>
                    <Typography variant="caption" component="span">
                    |
                    </Typography>
                    <Typography variant="caption" component="span">
                    Utilities
                    </Typography> */}
                    <Tooltip
                      title={
                        item.content.tags &&
                        item.content.tags.map((item) => " #" + item)
                      }
                    >
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 400,
                        }}
                        className={classes.moreDescBtn}
                      >
                        {" "}
                        ...more
                      </span>
                    </Tooltip>
                  </Box>
                ) : (
                  <Box className={`${classes.tags} tags-card`} ref={tagsRef}>
                    {item.content.tags &&
                      item.content.tags.map((item, index) => {
                        return (
                          // <Typography variant="caption" component="span">
                          //   #{item}
                          // </Typography>
                          <>
                            <Typography
                              className="tagOnAppCard"
                              variant="caption"
                              component="span"
                            >
                              #{item}
                            </Typography>
                          </>
                        );
                      })}
                    {/* <Typography variant="caption" component="span">
                    Programms
                    </Typography>
                    <Typography variant="caption" component="span">
                    |
                    </Typography>
                    <Typography variant="caption" component="span">
                    Utilities
                    </Typography> */}
                  </Box>
                )}
                {/* <Box className={`${classes.tags} tags-card`} display="flex" >

                  <Typography variant="caption" component='span'>
                    Programms
                        </Typography>
                  <Typography variant="caption" component='span'>
                    |
                        </Typography>
                  <Typography variant="caption" component='span'>
                    Utilities
                        </Typography>
                </Box> */}

                {/* <div
                  ref={descRef}
                  className={`${classes.cardSmallText} ${classes.desc}`}

                >
                  {showLink && <span className={classes.moreDescBtn} onClick={() => ViewAppDetail(item.id)}> ...more</span>} Lorem ipsum dolor sit amet co
                </div> */}
                {/* {
                  
                    ? <Tooltip title={item.content.appDescription}>
                     
                    </Tooltip>
                    : <Typography
                      ref={divRef}
                      variant="body2"
                      color="textSecondary"
                      component="p"
                      className={`${classes.cardSmallText} ${classes.desc}`}


                    >
                      {item.content.appDescription}
                    </Typography>
                } */}
              </CardContent>
            </CardActionArea>

            <CardActions
              className={`${toggle ? classes.darkDetailsArea : classes.lightDetailsArea
                } cardFooter`}
            >
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
                  <Tooltip title="Number of views" placement="top" arrow>
                    <VisibilityIcon className={classes.cardFooterIcon} />
                  </Tooltip>
                  <Typography variant="caption">
                    {aggregatedAppStats[0] && millify(aggregatedAppStats[0])}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  className={classes.footerItem}
                >
                  <Tooltip title="Number of App Access" placement="top" arrow>
                    <LaunchOutlinedIcon className={classes.cardFooterIcon} />
                  </Tooltip>
                  <Typography variant="caption">
                    {aggregatedAppStats[1] && millify(aggregatedAppStats[1])}
                  </Typography>
                </Box>
                {/* <Box
              display="flex"
              alignItems="center"
              className={`${classes.footerItem} ${classes.ratingDiv}`}
            >
              <StarIcon className={classes.cardFooterIcon} />
              <Typography variant="caption">2.5k</Typography>
            </Box> */}
                <Box
                  display="flex"
                  alignItems="center"
                  className={classes.footerItem}
                >
                  {parseInt(appStats?.content?.liked) === parseInt(1) ? (
                    <Tooltip
                      title="Number of user liked this app"
                      placement="top"
                      arrow
                    >
                      {uiSpiner === null ? (
                        <ThumbUpAltIcon
                          className={`${classes.cardFooterIcon} unlike`}
                          onClick={() => {
                            appStatsAction(EVENT_APP_LIKED_REMOVED);
                            onLikeClick();
                          }}
                        />
                      ) : uiSpiner === false ? (
                        <ThumbUpAltOutlinedIcon
                          className={`${classes.cardFooterIcon} like`}
                          onClick={() => {
                            appStatsAction(EVENT_APP_LIKED);
                            onLikeClick();
                          }}
                        />
                      ) : (
                        <DataUsageIcon
                          className={`${classes.cardFooterIcon}`}
                        />
                      )}
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title="Number of user liked this app"
                      placement="top"
                      arrow
                    >
                      {uiSpiner === null ? (
                        <ThumbUpAltOutlinedIcon
                          className={`${classes.cardFooterIcon} like`}
                          onClick={() => {
                            appStatsAction(EVENT_APP_LIKED);
                            onLikeClick();
                          }}
                        />
                      ) : uiSpiner === false ? (
                        <ThumbUpAltIcon
                          className={`${classes.cardFooterIcon} unlike`}
                          onClick={() => {
                            appStatsAction(EVENT_APP_LIKED_REMOVED);
                            onLikeClick();
                          }}
                        />
                      ) : (
                        <DataUsageIcon
                          className={`${classes.cardFooterIcon}`}
                        />
                      )}
                    </Tooltip>
                  )}
                  <Typography variant="caption">
                    {aggregatedAppStats[2] && millify(aggregatedAppStats[2])}
                  </Typography>
                  {/* <ThumbUpAltIcon className={classes.cardFooterIcon} />
                  <Typography variant="caption">2.5k</Typography> */}
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  className={classes.footerItem}
                >
                  {/* <FavoriteOutlinedIcon className={classes.cardFooterIcon} />
                  <Typography variant="caption">2.5k</Typography> */}
                  {parseInt(appStats?.content?.favorite) === parseInt(1) ? (
                    <Tooltip
                      title="Number of user marked this App Favorite"
                      placement="top"
                      arrow
                    >
                      <FavoriteOutlinedIcon
                        className={`${classes.cardFooterIcon} unFav`}
                        onClick={() =>
                          appStatsAction(EVENT_APP_FAVORITE_REMOVED)
                        }
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title="Number of user marked this App Favorite"
                      placement="top"
                      arrow
                    >
                      <FavoriteBorderOutlinedIcon
                        className={`${classes.cardFooterIcon} fav`}
                        onClick={() => appStatsAction(EVENT_APP_FAVORITE)}
                      />
                    </Tooltip>
                  )}
                  <Typography variant="caption">
                    {aggregatedAppStats[3] && millify(aggregatedAppStats[3])}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  className={classes.footerItem}
                >
                  <MsgIcon
                    className={`${classes.cardFooterIcon} ${toggle ? classes.darkIcon : classes.lightIcon
                      }`}
                  />
                  <Typography variant="caption">{millify(1456044)}</Typography>
                </Box>
                <Box className={classes.imageAvatar}>
                  <img src='https://image.flaticon.com/icons/png/512/3135/3135715.png' alt='Developer Avatar' className={classes.devAvtar} title="Developer Name" />
                  <Box className={classes.developerName}><Typography component="p">Developer</Typography></Box>
                </Box>
                {/* <Box marginLeft="auto">
              <Button
                size="small"
                color="default"
                className={classes.versionBtn}
              >
                Version {item.version}
              </Button>
            </Box> */}
              </Box>
            </CardActions>
            <CardActions className={classes.footerBottom}>
              <Box>
                <Button
                  size="medium"
                  className={`${classes.installBtn} ${updated ? classes.bgUnistall : classes.bgUpdate
                    }`}
                  onClick={(e) =>
                    handleInstall(item, updated ? "uninstall" : "install")
                  }
                >
                  {updated && "Uninstall"}
                  {updated === false && "Update"}
                  {updated === undefined && "Install"}
                </Button>
              </Box>
              {/* <Box className={`${classes.tags} tags-card`} display="flex" >
                {item.content.tags && item.content.tags.map((item, index) => {
                  return (
                    <Typography variant="caption" component="span">
                      #{item}
                    </Typography>
                  )
                })}
              </Box> */}
            </CardActions>
          </Card>
        }
      </>
    </Box>
  );
};
export default AppCard;
