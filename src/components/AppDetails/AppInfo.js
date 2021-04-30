import React, { Fragment, useEffect } from "react";
import { Box, makeStyles, Typography, Button } from "@material-ui/core";
import ScreenShot from "../../assets/img/sc.jpg";
// import SimilarApps from "./SimilarApps";
import AppComments from "./AppComments";
import { useHistory } from  'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  h2: {
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
  submitBtn: {
    background: '#1DBF73!important',
    color: '#fff',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    display: 'inlin-flex',
    alignItems: 'center',
    minWidth: 130,
    '& svg': {
      fontSize: '19px',
      marginRight: '5px'
    },
    '@media only screen and (max-width: 575px)': {
      fontSize: '12px',

      paddingLeft: '.5rem',
      paddingRight: '.5rem',
      minWidth: 70,
    }
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
  infoText: {
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
  descText: {
    fontSize: 20,
    color: "#131523",
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

const AppInfo = ({ data, appId }) => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <Fragment>
      <Typography component="h2" className={`${classes.h2} ${classes.mb0}`}>
        App Details <Button style={{ float: 'right' }} className={classes.submitBtn} onClick={(e) => history.push(`/editpublishapp/${appId}`)}> Edit </Button>
      </Typography>

      <Box display="flex" className={classes.informationContainer}>
        <Box flex={1}>
          <Typography className={classes.subHeading}>Version</Typography>

          <Typography className={classes.infoText}>
            {data && data.version}
          </Typography>
        </Box>
        <Box flex={2}>
          <Typography className={classes.subHeading}>
            Interface language
          </Typography>

          <Typography className={classes.infoText}>
            Russian, English, German, French, Spanish, Italian, Portuguese,
            Arabic
          </Typography>
        </Box>
        <Box flex={1}>
          <Typography className={classes.subHeading}>The size</Typography>

          <Typography className={classes.infoText}>183.9 MB</Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        marginTop="1rem"
        marginBottom="15px"
        className={classes.informationContainer}
      >
        <Box flex={1}>
          <Typography className={classes.subHeading}>Compatibility</Typography>

          <Typography className={classes.infoText}>
            OS X 10.9 or later, 64-bit processor
          </Typography>
        </Box>
        <Box flex={2}>
          <Typography className={classes.subHeading}>Verified</Typography>

          <Typography className={classes.infoText}>
            Dr.Web for Mac - No viruses
          </Typography>
        </Box>
        <Box flex={1}>
          <Typography className={classes.subHeading}>Tags</Typography>

          <Typography className={classes.infoText}>
            Programs, Utilities
          </Typography>
        </Box>
      </Box>

      <Box
        marginBottom="10px"
        className={classes.descTextContainer}
        marginTop="15px"
      >
        <Typography component="h2" className={classes.h2}>
          Description
        </Typography>
        <Typography variant="body2" className={classes.descText}>
          {data && data.content.appDescription}
          {/* Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et.
          <br />
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et.
          <span className={classes.readMoreBtn}>Read More</span> */}
        </Typography>
      </Box>
      <Typography component="h2" className={classes.h2}>
        Screenshots
      </Typography>
      <Box display="flex" flexWrap="wrap">
        <Box paddingRight=".5rem" className={classes.scContainer}>
          <img
            src={
              data &&
              data.content.previewVideo.thumbnail &&
              `https://siasky.net/${
                data.content.previewVideo.thumbnail.split("sia:")[1]
              }`
            }
            alt="sc"
          />
        </Box>
        {data && data.content.previewImages.images.length
          ? data.content.previewImages.images.map((i, index) => {
              return (
                <Box
                  key={index}
                  paddingRight=".5rem"
                  className={classes.scContainer}
                >
                  <img
                    src={`https://siasky.net/${i.thumbnail.split("sia:")[1]}`}
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
        <Typography component="h2" className={classes.h2}>
          Description
        </Typography>
        <Typography variant="body2" className={classes.descText}>
          What's new in iMazing 2.12.7 Licensing Server Change: iMazing will now
          connect to https://api.imazing.com for license validation. This change
          anticipates the upcoming retirement of our previous licensing
          platform, Devmate. Please make sure to whitelist api.imazing.com if
          you're experiencing activation issues. Licensing: added support for
          new license types (imz *** license codes). Licensing: new license and
          trial screens. Misc: added assets for new Apple devices.
          <br />
          <br />
        </Typography>
        <Typography variant="body2" className={classes.descText}>
          Fixes and improvements in 2.12.7 Licensing: fixed various activation
          issues Fixed inactive Choose Wallpaper button in Supervision wizard
          (macOS) Other minor fixes and stability improvements
        </Typography>
      </Box>
      <Box overflow="hidden" marginTop="15px">
        <Typography component="h2" className={classes.h2}>
          Similar Apps
        </Typography>
        {/* <SimilarApps /> */}
      </Box>
      <Box overflow="hidden" marginTop="15px">
        <Typography component="h2" className={classes.h2}>
          Comments (65)
        </Typography>

        <AppComments uid={data && data.id} version={data && data.version} />
      </Box>
    </Fragment>
  );
};

export default AppInfo;
