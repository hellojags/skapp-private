import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
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
    maxWidth: "1440px",
    "@media only screen and (max-width: 575px)": {
      marginBottom: 0,
    },
  },
  ellipsis: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
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

      <Box
        display="flex"
        marginTop="1rem"
        marginBottom="15px"
        className={classes.informationContainer}
      >
        <Box flex={1}>
          <Typography className={classes.subHeading}>Git URL</Typography>

          <Typography
            className={toggle ? classes.darkInfoText : classes.lightInfoText}
          >
            <a
              href={data?.content?.sourceCode}
              target="_blank"
              rel="noreferrer noopener"
            >
              https://github.com
            </a>
          </Typography>
        </Box>
        <Box flex={1}>
          <Typography className={classes.subHeading}>Demo URL</Typography>

          <Typography
            className={toggle ? classes.darkInfoText : classes.lightInfoText}
          >
            <a
              href={data?.content?.demoUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              {data?.content?.demoUrl}
            </a>
          </Typography>
        </Box>
        <Box flex={1}>
          <Typography className={classes.subHeading}>Target User</Typography>

          <Typography
            className={toggle ? classes.darkInfoText : classes.lightInfoText}
            style={{ textTransform: "capitalize" }}
          >
            {data?.content?.age}
          </Typography>
        </Box>
      </Box>

      <Box display="flex">
        {Object.keys(data?.content?.connections || {}).map((item, ind) => (
          <Box flex={1} minWidth="0px" key={ind}>
            <Typography className={classes.subHeading}>{item}</Typography>

            <Typography
              className={toggle ? classes.darkInfoText : classes.lightInfoText}
            >
              <a
                href={data?.content?.connections[item]}
                target="_blank"
                rel="noreferrer noopener"
              >
                {data?.content?.connections[item]}
              </a>
            </Typography>
          </Box>
        ))}
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

      <Box display="flex" flexWrap="wrap">
        {data?.content?.previewVideo?.thumbnail && (
          <Box paddingRight=".5rem" className={classes.scContainer}>
            <img
              src={transformImageUrl(data?.content?.previewVideo?.thumbnail)}
              alt="sc"
            />
          </Box>
        )}
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

      {data?.content?.previewImages?.images?.length && (
        <Fragment>
          <Typography
            component="h2"
            className={toggle ? classes.darkh2 : classes.lighth2}
          >
            Screenshots
          </Typography>
          <Box display="flex" flexWrap="wrap">
            {data.content.previewImages.images.map((i, index) => (
              <Box
                key={index}
                paddingRight=".5rem"
                className={classes.scContainer}
              >
                <img
                  src={transformImageUrl(i.thumbnail)}
                  height="100%"
                  alt="sc"
                />
              </Box>
            ))}
          </Box>
        </Fragment>
      )}

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
