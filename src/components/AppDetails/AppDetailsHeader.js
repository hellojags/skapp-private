import {
  Box,
  Button,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import {
  FavoriteBorder,
  FavoriteOutlined,
  OpenInNew,
  Share,
  ThumbUpSharp,
} from "@material-ui/icons";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import VisibilityIcon from "@material-ui/icons/Visibility";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import cubsImg from "../../assets/img/cubs.png";
import { ReactComponent as MsgIcon } from "../../assets/img/icons/Messages, Chat.15.svg";
import { setAppStatsAction } from "../../redux/action-reducers-epic/SnAppStatsAction";
import {
  getAggregatedAppStatsByAppId,
  getAppStats,
  transformImageUrl,
} from "../../service/SnSkappService";
import {
  EVENT_APP_FAVORITE,
  EVENT_APP_FAVORITE_REMOVED,
  EVENT_APP_LIKED,
  EVENT_APP_LIKED_REMOVED,
} from "../../utils/SnConstants";

const useStyles = makeStyles({
  AppHeaderContainer: {
    padding: "2rem",
    color: "#fff",
    maxWidth: "1440px",
    borderRadius: 15,
    background: (props) => props.bgColor || "#1DBF73",
    "@media only screen and (max-width: 575px)": {
      paddingLeft: "20px",
      paddingRight: "20px",
      paddingTop: "25px",
    },
  },
  HeartIcon: {
    "& #Path_52298": {
      stroke: "#fff",
    },
    // color: '#fff'
  },
  ShareIcon: {
    color: "inherit",
    "& g > path": {
      stroke: "#fff",
    },
  },
  MsgIcon: {
    "& path:not(:first-child)": {
      stroke: "#fff",
    },
    transform: "scale(1.4)",
    marginRight: "8px",
    "@media only screen and (max-width: 575px)": {
      transform: "scale(1.2)",
      marginRight: "4px",
      "& p": {
        fontSize: 14,
      },
    },
  },
  addFav: {
    color: "white",
    fontSize: 25,
  },
  StarIcon: {
    "& path:not(:first-child)": {
      stroke: "#fff",
      fill: "#fff",
    },
    // cursor: "pointer",
    transform: "scale(1.4)",
    marginRight: "8px",

    "@media only screen and (max-width: 575px)": {
      transform: "scale(1.2)",
      marginRight: "4px",

      "& p": {
        fontSize: 14,
      },
    },
  },
  h1: {
    fontSize: "48px",
    fontWeight: "700",
    lineHeight: 1,
    marginRight: "1rem",
    // marginTop: 5,
    // marginBottom: 10,
    "@media only screen and (max-width: 575px)": {
      fontSize: "25px",
    },
  },
  programBtn: {
    background: "rgba(255,255,255,0.7)!important",
    color: (props) => props.bgColor || "#1DBF73",
    paddingLeft: "10px",
    paddingRight: "10px",
    fontSize: 14,
    fontWeight: 600,
  },
  installBtn: {
    background: "#fff!important",
    minWidth: 165,
    margin: "22px 0",
    fontSize: 12,
  },
  text: {
    fontSize: 18,
    lineHeight: "21px",
    whiteSpace: "pre-wrap",
    "@media only screen and (max-width: 575px)": {
      fontSize: "14px",
      lineHeight: "17px",
    },
  },
  box1: {
    marginRight: "3rem",
  },
  box2: {
    textAlign: "center",
    "@media only screen and (max-width: 575px)": {
      display: "none",
    },
  },
  favrIcon: {
    marginLeft: ".8rem",

    "@media only screen and (max-width: 575px)": {
      marginLeft: ".5rem",
    },
  },
  sharIcon: {
    marginLeft: ".5rem",

    "@media only screen and (max-width: 575px)": {
      marginLeft: "0",
    },
  },
  VisiIconContainer: {
    marginRight: "1rem",
    "@media only screen and (max-width: 575px)": {
      marginRight: "8px",
    },
  },
  msgIconContainer: {
    marginLeft: ".5rem",
    marginRight: "1rem",
    "@media only screen and (max-width: 575px)": {
      marginRight: "8px",
      marginLeft: "0",
    },
  },
  tags: {
    marginLeft: "1rem",
  },
});

const AppDetailsHeader = ({ data }) => {
  const classes = useStyles({
    bgColor: appBg[data?.content?.category],
  });
  const dispatch = useDispatch();
  const [appStats, setAppStats] = useState(false);
  const [aggregatedAppStats, setAggregatedAppStats] = useState(false);

  useEffect(() => {
    if (data) {
      fetchMyAppStats();
      fetchAggregatedAppStats();
      // onload get apps stats data and load in store
      //dispatch(getAppStatsAction(data.id));
    }
  }, [data]);

  // View|access|likes|fav
  const fetchMyAppStats = async () => {
    const result = await getAppStats(data.id);
    setAppStats(result);
  };

  // View|access|likes|fav
  const fetchAggregatedAppStats = async () => {
    const result = await getAggregatedAppStatsByAppId(data.id);
    setAggregatedAppStats(result);
  };

  const appStatsAction = async (eventType) => {
    // EVENT_APP_FAVORITE, EVENT_APP_FAVORITE_REMOVED
    await dispatch(setAppStatsAction(eventType, data.id));
  };

  // useEffect(() => {
  //   if (data) {
  //     // onload get apps stats data and load in store
  //     //dispatch(getAppStatsAction(data.id));
  //     setAppStats(getAppStats(data.id));
  //   }
  // }, [data,appStats]);

  return (
    <Box
      className={classes.AppHeaderContainer}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box className={classes.box1}>
        <Box display="flex" alignItems="center">
          <Box
            display="flex"
            alignItems="center"
            className={classes.VisiIconContainer}
          >
            <VisibilityIcon />
            <Typography>{aggregatedAppStats[0]}</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            className={classes.VisiIconContainer}
          >
            <OpenInNew />
            <Typography>{aggregatedAppStats[1]}</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            {/* <ThumbUpAltIcon/> */}
            {parseInt(appStats?.content?.liked) === parseInt(1) ? (
              <ThumbUpSharp
                fontSize="small"
                className={classes.StarIcon}
                onClick={() => appStatsAction(EVENT_APP_LIKED_REMOVED)}
              />
            ) : (
              <ThumbUpAltOutlinedIcon
                className={classes.StarIcon}
                onClick={() => appStatsAction(EVENT_APP_LIKED)}
              />
            )}
            <Typography>{aggregatedAppStats[2]}</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            mr="0.5rem"
            className={classes.favrIcon}
          >
            {/* <FavoriteOutlinedIcon/> */}
            {parseInt(appStats?.content?.favorite) === parseInt(1) ? (
              <FavoriteOutlined
                className={classes.HeartIcon}
                onClick={() => appStatsAction(EVENT_APP_FAVORITE_REMOVED)}
              />
            ) : (
              <FavoriteBorder
                className={classes.addFav}
                onClick={() => appStatsAction(EVENT_APP_FAVORITE)}
              />
            )}
            <Typography>{aggregatedAppStats[3]}</Typography>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            className={classes.msgIconContainer}
          >
            <MsgIcon className={classes.MsgIcon} />
            <Typography>1.3k</Typography>
          </Box>

          <Box className={classes.sharIcon}>
            <IconButton aria-label="Share Button" color="inherit" size="small">
              <Share className={classes.ShareIcon} color="inherit" />
            </IconButton>
          </Box>
        </Box>

        <Box marginTop="10px">
          <Box display="flex" alignItems="center">
            <Typography component="h1" className={classes.h1}>
              {data && data.content.appname}
            </Typography>
            <Button size="small" className={classes.programBtn}>
              {data?.content?.appStatus} | {data?.version}
            </Button>
          </Box>

          {data?.content?.appUrl && (
            <a
              href={data?.content?.appUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Box mt="1rem" display="flex" alignItems="center">
                <Box mr="0.25rem">{data?.content?.appUrl}</Box>

                <OpenInNew fontSize="small" />
              </Box>
            </a>
          )}

          <Box display="flex" mt="1rem" alignItems="center">
            <Button size="small" className={classes.programBtn}>
              {data && data.content.category}
            </Button>

            <Typography className={classes.tags}>
              {data?.content?.tags?.map((i) => `#${i}`).join(" ")}
            </Typography>
          </Box>
        </Box>
      </Box>
      <img
        src={
          (data?.content?.skappLogo?.thumbnail &&
            transformImageUrl(data?.content?.skappLogo?.thumbnail)) ||
          cubsImg
        }
        width="180px"
        alt="igm"
      />
    </Box>
  );
};

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

export default AppDetailsHeader;
