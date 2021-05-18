import { Avatar, Box, Button, IconButton, Typography } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { PersonOutline } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { getGithubUrl, transformImageUrl } from "../../service/SnSkappService";
const useStyles = makeStyles((theme) => ({
  root: {
    height: 300,
    flexGrow: 1,
    minWidth: 300,
    transform: "translateZ(0)",
    // The position fixed scoping doesn't work in IE 11.
    // Disable this demo to preserve the others.
    "@media all and (-ms-high-contrast: none)": {
      display: "none",
    },
  },
  modal: {
    display: "flex",
    padding: theme.spacing(1),
    alignItems: "center",
    justifyContent: "center",
  },

  lightUserCard: {
    background: "#fff",
    paddingTop: "4rem",
    paddingBottom: "3rem",
    width: 460,
    maxWidth: "98%",
    // textAlign:
    borderRadius: 20,
    boxShadow: "0px 1px 4px #00000012",
    "&:focus": {
      border: "none",
      outline: "none",
    },
    position: "relative",

    "@media only screen and (max-width: 370px)": {
      paddingTop: "3rem",
      paddingRight: "1.4rem",
      paddingLeft: "1.4rem",
      paddingBottom: "1rem",
    },
  },
  darkUserCard: {
    background: "#2A2C34",
    paddingTop: "4rem",
    paddingBottom: "3rem",
    width: 460,
    maxWidth: "98%",
    // textAlign:
    borderRadius: 20,
    boxShadow: "0px 1px 4px #00000012",
    "&:focus": {
      border: "none",
      outline: "none",
    },
    position: "relative",

    "@media only screen and (max-width: 370px)": {
      paddingTop: "3rem",
      paddingRight: "1.4rem",
      paddingLeft: "1.4rem",
      paddingBottom: "1rem",
    },
  },
  lightCardUserName: {
    fontSize: 18,
    fontWeight: 800,
    color: "#4E4E4E",
  },
  darkCardUserName: {
    fontSize: 18,
    fontWeight: 800,
    color: "#fff",
  },
  lightCardUserAd: {
    fontSize: 18,
    color: "#4E4E4E",
  },
  darkCardUserAd: {
    fontSize: 18,
    color: "#fff",
  },
  userProfile: {
    marginBottom: "6px",
    textAlign: "center",
    "& img": {
      borderRadius: "50%",
      border: "8px solid #70707026",
    },
  },
  ul: {
    color: "#48494E",
    marginTop: ".4rem",
    justifyContent: "center",
    "& li:not(:last-child)": {
      marginRight: "1.7rem",
    },
    display: "flex",
    listStyle: "none",
    "& span": {
      // color: '#2a2c3499',
      // color: '#48494E',
      color: "#6A6F89",
      fontSize: 13,
      display: "block",
      "&:first-child": {
        color: "#6A6F89",
        fontWeight: "bold",
        fontSize: 15,
      },
    },
  },
  userDetails: {
    textAlign: "center",
  },
  lightUserDetailsList: {
    listStyle: "none",
    margin: "1rem auto",
    "& li": {
      display: "flex",
      maxWidth: 315,
      justifyContent: "space-between",
      margin: "0 auto",
      "& span": {
        fontSize: 18,
        lineHeight: 1.6,
        color: "#4E4E4E",
        "&:last-child": {
          fontWeight: "bold",
        },
      },
    },
  },
  darkUserDetailsList: {
    listStyle: "none",
    margin: "1rem auto",
    "& li": {
      display: "flex",
      maxWidth: 315,
      justifyContent: "space-between",
      margin: "0 auto",
      "& span": {
        fontSize: 18,
        lineHeight: 1.6,
        color: "#6A6F89",
        "&:last-child": {
          fontWeight: "bold",
        },
      },
    },
  },
  btnF: {
    background: "#1DBF73!important",
    width: 315,
    maxWidth: "100%",
    color: "#fff",
  },
  closeBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    color: "#6A6F89",
  },
}));

const UserCard = ({
  toggle,
  user,
  followingList = [],
  handleClose,
  handleFollowing,
}) => {
  const classes = useStyles();
  const rootRef = React.useRef(null);

  return (
    user && (
      <Modal
        open={!!user}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        handleClose={handleClose}
        className={classes.modal}
        container={() => rootRef.current}
      >
        <div className={toggle ? classes.darkUserCard : classes.lightUserCard}>
          <div className={classes.userProfile}>
            {user.avatar && user.avatar[0] ? (
              <img
                className={classes.devAvtar}
                src={transformImageUrl(user.avatar[0].url)}
                alt=""
              />
            ) : (
              <Avatar className={classes.devAvtar}>
                <PersonOutline className="icon" />
              </Avatar>
            )}
          </div>
          <div className={classes.userDetails}>
            <Typography
              className={
                toggle ? classes.darkCardUserName : classes.lightCardUserName
              }
            >
              {user.username}
            </Typography>
            <Typography
              className={
                toggle ? classes.darkCardUserAd : classes.lightCardUserAd
              }
            >
              {user.github}
            </Typography>

            <ul className={classes.ul}>
              <li>
                <span>{user.appCount}</span>
                <span>Apps</span>
              </li>
              <li>
                <span>Coming Soon</span>
                <span>Followers</span>
              </li>
              <li>
                <span>{user.following}</span>
                <span>Following</span>
              </li>
            </ul>
          </div>

          <ul
            className={
              toggle
                ? classes.darkUserDetailsList
                : classes.lightUserDetailsList
            }
          >
            <li>
              <span>User ID</span>
              <span title={user.uid}>{user.uid?.slice(0, 16)}...</span>
            </li>
            <li>
              <span>Location</span>
              <span>{user.location}</span>
            </li>
            <li>
              <span>GitHub/GitLab ID</span>
              <span>{getGithubUrl(user.connections || [])}</span>
            </li>
            <li>
              <span>No of apps</span>
              <span>{user.appCount}</span>
            </li>
          </ul>

          <Box textAlign="center" color="error.main">
            {followingList.includes(user?.uid) ? (
              <Button
                className={classes.unfollowBtn}
                variant="contained"
                color="inherit"
                disableElevation
                onClick={handleFollowing("unfollow", user?.uid)}
              >
                Unfollow
              </Button>
            ) : (
              <Button
                // variant="contained"
                // color="primary"
                className={classes.btnF}
                disableElevation
                onClick={handleFollowing("follow", user?.uid)}
              >
                Follow
              </Button>
            )}
          </Box>

          <IconButton className={classes.closeBtn} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </Modal>
    )
  );
};

export default UserCard;
