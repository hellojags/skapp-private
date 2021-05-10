import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { getPortalUrl } from "../../service/skynet-api";
import { transformImageUrl } from "../../service/SnSkappService";
// import SimilarApps from "./SimilarApps";
import AppComments from "./AppComments";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  lighth2: {
    fontSize: 28,
    color: "#131523",
    fontWeight: 700,
    marginBottom: "10px",
    marginTop: 15,
    "@media only screen and (max-width: 575px)": {
      fontSize: 20,
      marginTop: 10,
    },
  },
  darkh2: {
    fontSize: 28,
    color: "#fff",
    fontWeight: 700,
    marginBottom: "10px",
    marginTop: 15,
    "@media only screen and (max-width: 575px)": {
      fontSize: 20,
      marginTop: 10,
    },
  },
  submitBtn: {
    background: "#1DBF73!important",
    color: "#fff",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    display: "inlin-flex",
    alignItems: "center",
    minWidth: 130,
    "& svg": {
      fontSize: "19px",
      marginRight: "5px",
    },
    "@media only screen and (max-width: 575px)": {
      fontSize: "12px",

      paddingLeft: ".5rem",
      paddingRight: ".5rem",
      minWidth: 70,
    },
  },
  subHeading: {
    color: "#7E84A3",
    fontSize: "16px",
    fontWeight: 500,
    marginBottom: "5px",
    "@media only screen and (max-width: 575px)": {
      fontSize: 10,
      marginBottom: "3px",
      marginTop: ".5rem",
    },
  },
  lightInfoText: {
    color: "#131523",
    fontSize: 20,
    fontWeight: "bold",
    "@media only screen and (max-width: 1600px)": {
      fontSize: 18,
    },
    "@media only screen and (max-width: 1300px)": {
      fontSize: 16,
    },
    "@media only screen and (max-width: 575px)": {
      fontSize: 12,
    },
  },
  darkInfoText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    "@media only screen and (max-width: 1600px)": {
      fontSize: 18,
    },
    "@media only screen and (max-width: 1300px)": {
      fontSize: 16,
    },
    "@media only screen and (max-width: 575px)": {
      fontSize: 12,
    },
  },
  lightDescText: {
    fontSize: 18,
    whiteSpace: "pre-wrap",
    color: "#131523",
    "@media only screen and (max-width: 1300px)": {
      fontSize: 16,
    },
    "@media only screen and (max-width: 575px)": {
      fontSize: 12,
    },
  },
  darkDescText: {
    fontSize: 18,
    whiteSpace: "pre-wrap",
    color: "#fff",
    "@media only screen and (max-width: 1300px)": {
      fontSize: 16,
    },
    "@media only screen and (max-width: 575px)": {
      fontSize: 12,
    },
  },
  readMoreBtn: {
    color: "#1DBF73",
    fontSize: 16,
    cursor: "pointer",
    fontWeight: "bold",
    marginLeft: ".7rem",
  },
  descTextContainer: {
    maxWidth: 1285,
  },
  scContainer: {
    borderRadius: 10,
    "& > img": {
      height: "150px",
    },
    "@media only screen and (max-width: 575px)": {
      maxWidth: "50%",
      "& > img": {
        width: "100%",
        height: "auto",
      },
    },
  },
  infoItemsContain: {
    "@media only screen and (max-width: 575px)": {
      flexDirection: "row",
      display: "flex",
    },
  },
  informationContainer: {
    maxWidth: "1500px",
    "@media only screen and (max-width: 575px)": {
      display: "inline-block",
      maxWidth: "50%",
      margin: 0,
    },

    "&:last-child": {
      "@media only screen and (max-width: 575px)": {
        paddingLeft: "7px",
      },
    },
  },
  mb0: {
    "@media only screen and (max-width: 575px)": {
      marginBottom: 0,
    },
  },
}));

const AppInfo = ({ data, appId, toggle }) => {
  const classes = useStyles();
  const history = useHistory();

  console.log(data);

  return (
    <Fragment>
      <Typography
        component="h2"
        className={`${toggle ? classes.darkh2 : classes.lighth2} ${
          classes.mb0
        }`}
      >
        App Details{" "}
        <Button
          style={{ float: "right" }}
          className={classes.submitBtn}
          onClick={(e) => history.push(`/editpublishapp/${appId}`)}
        >
          {" "}
          Edit{" "}
        </Button>
      </Typography>

      <Box display="flex" className={classes.informationContainer}>
        <Box flex={1}>
          <Typography className={classes.subHeading}>Version</Typography>

          <Typography
            className={toggle ? classes.darkInfoText : classes.lightInfoText}
          >
            {data && data.version}
          </Typography>
        </Box>
        {/* <Box flex={2}>
          <Typography className={classes.subHeading}>
            Interface language
          </Typography>

          <Typography
            className={toggle ? classes.darkInfoText : classes.lightInfoText}
          >
            Russian, English, German, French, Spanish, Italian, Portuguese,
            Arabic
          </Typography>
        </Box> */}
        {/* <Box flex={1}>
          <Typography className={classes.subHeading}>The size</Typography>

          <Typography
            className={toggle ? classes.darkInfoText : classes.lightInfoText}
          >
            183.9 MB
          </Typography>
        </Box> */}
      </Box>
      <Box
        display="flex"
        marginTop="1rem"
        marginBottom="15px"
        className={classes.informationContainer}
      >
        {/* <Box flex={1}>
          <Typography className={classes.subHeading}>Compatibility</Typography>

          <Typography
            className={toggle ? classes.darkInfoText : classes.lightInfoText}
          >
            OS X 10.9 or later, 64-bit processor
          </Typography>
        </Box> */}
        {/* <Box flex={2}>
          <Typography className={classes.subHeading}>Verified</Typography>

          <Typography
            className={toggle ? classes.darkInfoText : classes.lightInfoText}
          >
            Dr.Web for Mac - No viruses
          </Typography>
        </Box> */}
        <Box flex={1}>
          <Typography className={classes.subHeading}>Tags</Typography>

          <Typography
            className={toggle ? classes.darkInfoText : classes.lightInfoText}
          >
            {data?.content?.tags?.join(", ")}
          </Typography>
        </Box>
      </Box>

      <Box
        marginBottom="10px"
        className={classes.descTextContainer}
        marginTop="15px"
      >
        <Typography
          component="h2"
          className={toggle ? classes.darkh2 : classes.lighth2}
        >
          Description
        </Typography>
        <Typography
          className={toggle ? classes.darkDescText : classes.lightDescText}
        >
          {data?.content?.appDescription}
        </Typography>
      </Box>
      <Typography
        component="h2"
        className={toggle ? classes.darkh2 : classes.lighth2}
      >
        Screenshots
      </Typography>
      <Box display="flex" flexWrap="wrap">
        {data?.content?.previewVideo?.thumbnail && (
          <Box paddingRight=".5rem" className={classes.scContainer}>
            <img
              src={transformImageUrl(data?.content?.previewVideo?.thumbnail)}
              alt="sc"
            />
          </Box>
        )}
        {data && data.content.previewImages.images.length
          ? data.content.previewImages.images.map((i, index) => {
              return (
                <Box
                  key={index}
                  paddingRight=".5rem"
                  className={classes.scContainer}
                >
                  <img
                    src={getPortalUrl() + `${i.thumbnail.split("sia:")[1]}`}
                    alt="sc"
                  />
                </Box>
              );
            })
          : null}

        {/* // <Box paddingRight=".5rem" className={classes.scContainer}>
        //   <img src={ScreenShot} alt="sc" />
        // </Box>
        // <Box paddingRight=".5rem" className={classes.scContainer}>
        //   <img src={ScreenShot} alt="sc" />
        // </Box>
        // <Box className={classes.scContainer}>
        //   <img src={ScreenShot} alt="sc" />
        // </Box> */}
      </Box>
      <Box className={classes.descTextContainer} marginTop="15px">
        <Typography
          component="h2"
          className={toggle ? classes.darkh2 : classes.lighth2}
        >
          Release Notes
        </Typography>
        <Typography
          className={toggle ? classes.darkDescText : classes.lightDescText}
        >
          {data?.content?.releaseNotes}
        </Typography>
      </Box>
      <Box overflow="hidden" marginTop="15px">
        <Typography
          component="h2"
          className={toggle ? classes.darkh2 : classes.lighth2}
        >
          Similar Apps
        </Typography>
        {/* <SimilarApps /> */}
      </Box>
      <Box overflow="hidden" marginTop="15px">
        <Typography
          component="h2"
          className={toggle ? classes.darkh2 : classes.lighth2}
        >
          Comments
        </Typography>

        <AppComments
          toggle={toggle}
          uid={data && data.id}
          version={data && data.version}
        />
      </Box>
    </Fragment>
  );
};

export default AppInfo;
